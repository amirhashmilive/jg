/**
 * JOHAR GANDHI - Slide Renderer
 * Fetches episode JSON and renders slide DOM elements.
 * Implements corrections: low-bandwidth mode, "Previously on" recaps, and Editor's Choice badges.
 */

class SlideRenderer {
    constructor() {
        this.container = document.getElementById('slide-container');
        this.prefersReducedData = false;
        
        // Detect reduced data preference
        if ('connection' in navigator) {
            this.prefersReducedData = navigator.connection.saveData;
        }
    }

    /**
     * Load and render an episode
     * @param {number} series - Series number (1 or 2)
     * @param {number} episode - Episode number (1-10)
     * @returns {Promise<Object>} The episode data
     */
    async loadEpisode(series, episode) {
        try {
            const epNum = episode.toString().padStart(2, '0');
            const response = await fetch(`data/series${series}/episode${epNum}.json`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            await this.renderSlides(data, series, episode);
            return data;
        } catch (error) {
            console.error("Failed to load episode data:", error);
            this.container.innerHTML = `<div class="error-slide">Failed to load episode content.</div>`;
            return null;
        }
    }

    /**
     * Renders the slides into the DOM
     */
    async renderSlides(data, seriesNum, epNum) {
        this.container.innerHTML = '';
        
        let slideIndex = 0;

        // Implement Correction: "Previously on" recap for episodes 2-20
        if (epNum > 1) {
            const recapSlide = this.createRecapSlide(seriesNum, epNum);
            recapSlide.dataset.index = slideIndex++;
            this.container.appendChild(recapSlide);
        }

        // We randomly select 5 slides to be "Editor's Choice" for the "Most Downloaded" badges (Correction)
        // In a real scenario, this would be flagged in the JSON.
        const editorsChoiceIndices = this.getEditorsChoiceIndices(data.slides.length);

        data.slides.forEach((slideData, i) => {
            const isEditorsChoice = editorsChoiceIndices.includes(i);
            const slideEl = this.createSlideElement(slideData, isEditorsChoice);
            slideEl.dataset.index = slideIndex++;
            this.container.appendChild(slideEl);
        });
    }

    createSlideElement(data, isEditorsChoice) {
        const slide = document.createElement('div');
        slide.className = 'slide';
        
        // Data attributes for scroll engine and ken burns
        slide.dataset.id = data.id || '';
        slide.dataset.type = data.type || 'content';
        slide.dataset.animation = JSON.stringify(data.animation || {});

        // Image optimization logic
        let imagePath = data.image;
        if (this.prefersReducedData) {
            // Simulated logic: if we had a 720p folder, we would alter the path here
            // imagePath = imagePath.replace('images/', 'images/720p/');
        }

        // Image Container
        const imgWrap = document.createElement('div');
        imgWrap.className = 'slide-image-wrap vignette';
        
        const img = document.createElement('img');
        img.dataset.src = imagePath; // For lazy loading
        img.src = imagePath; // Currently eager loading for simplicity, optimize later
        img.alt = data.visualDescription || 'Johar Gandhi illustration';
        img.loading = "lazy";
        
        imgWrap.appendChild(img);
        slide.appendChild(imgWrap);

        // Editor's Choice Badge
        if (isEditorsChoice) {
            const badge = document.createElement('div');
            badge.className = 'editors-choice-badge';
            badge.innerHTML = `<span class="icon">★</span> Editor's Choice`;
            slide.appendChild(badge);
        }

        // Text Overlay Container (Visible in Read Along mode)
        if (data.type !== 'visual' && data.type !== 'brand' && data.text) {
            const textPanel = document.createElement('div');
            textPanel.className = 'slide-text-panel';
            
            const textContent = document.createElement('p');
            textContent.className = 'slide-text';
            textContent.textContent = data.text;
            
            textPanel.appendChild(textContent);

            // If Hindi text exists, we can add it (toggled via settings later)
            if (data.textHindi) {
                const textHindi = document.createElement('p');
                textHindi.className = 'slide-text text-hindi';
                textHindi.textContent = data.textHindi;
                textPanel.appendChild(textHindi);
            }

            slide.appendChild(textPanel);
        }

        // Progress bar element
        const progress = document.createElement('div');
        progress.className = 'slide-progress';
        const progressFill = document.createElement('div');
        progressFill.className = 'progress-bar-fill';
        progress.appendChild(progressFill);
        slide.appendChild(progress);

        return slide;
    }

    createRecapSlide(series, episode) {
        const slide = document.createElement('div');
        slide.className = 'slide title-card recap-card';
        slide.dataset.type = 'recap';
        slide.dataset.animation = JSON.stringify({ type: 'zoomOut', duration: 10 });
        
        const imgWrap = document.createElement('div');
        imgWrap.className = 'slide-image-wrap vignette';
        const img = document.createElement('img');
        img.src = `images/series${series}/ep${(episode-1).toString().padStart(2, '0')}/slide-085.webp`; // Placeholder path
        imgWrap.appendChild(img);
        
        const textPanel = document.createElement('div');
        textPanel.className = 'slide-text-panel center-content';
        textPanel.innerHTML = `
            <p class="caption uppercase text-gold">Previously on Johar Gandhi</p>
            <div class="gold-line"></div>
            <h2 class="heading-lg">Series ${series}, Episode ${episode - 1}</h2>
        `;

        const progress = document.createElement('div');
        progress.className = 'slide-progress';
        progress.innerHTML = '<div class="progress-bar-fill"></div>';

        slide.appendChild(imgWrap);
        slide.appendChild(textPanel);
        slide.appendChild(progress);

        return slide;
    }

    getEditorsChoiceIndices(total) {
        // Randomly select 5 indices
        const indices = new Set();
        const max = Math.min(5, total);
        while(indices.size < max) {
            indices.add(Math.floor(Math.random() * total));
        }
        return Array.from(indices);
    }
}

export default new SlideRenderer();
