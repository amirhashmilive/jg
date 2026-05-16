const fs = require('fs');
const path = require('path');

const planFile = path.join(__dirname, 'PLAN', 'PLAN_PART3_EpisodeStructure_SlideBreakdown.md');
const planContent = fs.readFileSync(planFile, 'utf8');

const s1e1Path = path.join(__dirname, 'data', 'series1', 'episode01.json');
let episodeData = JSON.parse(fs.readFileSync(s1e1Path, 'utf8').replace(/^\uFEFF/, ''));
episodeData.slides = [];

const slideRegex = /\|\s*(\d+)\s*\|\s*([^\|]+?)\s*\|\s*([^\|]+?)\s*\|\s*([^\|]+?)\s*\|\s*([^\|]+?)\s*\|/g;
let match;
while ((match = slideRegex.exec(planContent)) !== null) {
    const idNum = match[1].trim();
    if (idNum === '#' || isNaN(parseInt(idNum))) continue;

    const visual = match[2].trim();
    const text = match[3].trim().replace(/^"|"$/g, '').replace(/^\*|\*$/g, '');
    const animationType = match[4].trim();
    const emotion = match[5].trim();

    episodeData.slides.push({
        id: `s1e01-${idNum.padStart(3, '0')}`,
        type: text.includes('[No text') ? 'visual' : (text.includes('[Brand card') ? 'brand' : 'content'),
        image: `images/series1/ep01/slide-${idNum.padStart(3, '0')}.webp`,
        text: text.includes('[') ? '' : text,
        animation: {
            type: animationType,
            duration: 15 // from correction: visual mode 15s, reading 30s. default visual animation
        },
        emotion: emotion,
        visualDescription: visual
    });
}
episodeData.slideCount = episodeData.slides.length;

fs.writeFileSync(s1e1Path, JSON.stringify(episodeData, null, 2), 'utf8');
console.log(`Parsed ${episodeData.slides.length} slides for S1E01.`);
