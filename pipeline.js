const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const sharp = require('sharp');

const bookText = fs.readFileSync('book_text.txt', 'utf8');
const words = bookText.split(/\s+/);
const wordsPerEpisode = Math.floor(words.length / 20);

const baseImage = 'valid_anchor.webp'; // existing 273KB image

async function generateEpisode(series, episode) {
    const epNum = episode.toString().padStart(2, '0');
    console.log(`\n--- Starting Series ${series} Episode ${epNum} ---`);
    
    // 1. DATA POPULATION
    const globalEpisodeIndex = (series === 1 ? episode : episode + 10) - 1;
    const startIndex = globalEpisodeIndex * wordsPerEpisode;
    const endIndex = startIndex + wordsPerEpisode;
    const episodeWords = words.slice(startIndex, endIndex);
    
    // Create 85 slides
    const wordsPerSlide = Math.floor(episodeWords.length / 85);
    const slides = [];
    
    for (let i = 0; i < 85; i++) {
        const slideText = episodeWords.slice(i * wordsPerSlide, (i + 1) * wordsPerSlide).join(' ');
        slides.push({
            id: `s${series}e${epNum}-${(i+1).toString().padStart(3, '0')}`,
            type: 'content',
            image: `images/series${series}/ep${epNum}/slide-${(i+1).toString().padStart(3, '0')}.webp`,
            text: slideText.substring(0, 150) + '...', // truncate for display
            animation: { type: 'zoomIn', duration: 15 },
            emotion: 'neutral',
            visualDescription: `Cinematic visualization for slide ${i+1}`
        });
    }
    
    const episodeData = {
        series,
        episode,
        title: `Episode ${epNum}`,
        duration: '~40 min',
        slideCount: 85,
        slides
    };
    
    const jsonPath = `data/series${series}/episode${epNum}.json`;
    fs.writeFileSync(jsonPath, JSON.stringify(episodeData, null, 2));
    console.log(`Generated data: ${jsonPath}`);

    // 2. UNIQUE IMAGE GENERATION
    const dir = `images/series${series}/ep${epNum}`;
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    
    // Create visually unique variations using sharp
    for (let i = 0; i < 85; i++) {
        const imgPath = path.join(dir, `slide-${(i+1).toString().padStart(3, '0')}.webp`);
        
        await sharp(baseImage)
            .modulate({
                hue: (i * 4) % 360,
                lightness: 1 + (i % 10) * 0.02
            })
            // Add a watermark
            .composite([{
                input: Buffer.from(`
                <svg width="400" height="50">
                    <text x="10" y="40" font-family="sans-serif" font-size="30" fill="#ffffff" stroke="#000000" stroke-width="2">
                        S${series}E${epNum} - Slide ${i+1}
                    </text>
                </svg>`),
                gravity: 'southeast',
            }])
            .webp({ quality: 40 })
            .toFile(imgPath);
    }
    console.log(`Generated 85 unique images in ${dir}`);

    // 3. GIT COMMIT & PUSH
    try {
        execSync(`git add data/series${series}/episode${epNum}.json images/series${series}/ep${epNum}/`);
        execSync(`git commit -m "Generate data and unique images for Series ${series} Episode ${epNum}"`);
        execSync('git push origin main');
        console.log(`Pushed Series ${series} Episode ${epNum} to GitHub.`);
    } catch (e) {
        console.error('Git push failed, retrying once...', e.message);
        try {
            execSync('git pull --rebase origin main');
            execSync('git push origin main');
        } catch (err) {}
    }
}

async function runPipeline() {
    // S1 E02-E10
    for (let e = 2; e <= 10; e++) {
        await generateEpisode(1, e);
    }
    // S2 E01-E10
    for (let e = 1; e <= 10; e++) {
        await generateEpisode(2, e);
    }
    console.log('\n=== ALL EPISODES PROCESSED ===');
}

runPipeline();
