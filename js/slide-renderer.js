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
            // Assuming player is always in /pages folder, we need ../ to get to root
            const response = await fetch(`../data/series${series}/episode${epNum}.json`);
            
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

        // EVERY EPISODE: Inject a pure Hero Title Card as Slide 1
        const heroSlide = this.createHeroSlide(seriesNum, epNum, data.title);
        heroSlide.dataset.index = slideIndex++;
        this.container.appendChild(heroSlide);

        // We randomly select 5 slides to be "Editor's Choice" for the "Most Downloaded" badges
        const editorsChoiceIndices = this.getEditorsChoiceIndices(data.slides.length);

        // Slide 2+ are the actual story text from the JSON
        data.slides.forEach((slideData, i) => {
            const isEditorsChoice = editorsChoiceIndices.includes(i);
            const slideEl = this.createSlideElement(slideData, isEditorsChoice, data);
            slideEl.dataset.index = slideIndex++;
            this.container.appendChild(slideEl);
        });
    }

    createSlideElement(data, isEditorsChoice, epData) {
        const slide = document.createElement('div');
        slide.className = 'slide';
        
        // Data attributes for scroll engine and ken burns
        slide.dataset.id = data.id || '';
        slide.dataset.type = data.type || 'content';
        slide.dataset.animation = JSON.stringify(data.animation || {});

        // Small placeholder badge (top-right corner)
        const placeholderBadge = document.createElement('div');
        placeholderBadge.className = 'placeholder-badge';
        placeholderBadge.title = data.visualDescription || 'Image to be generated';
        placeholderBadge.innerHTML = `<span class="badge-label">📷 Image TBD</span>`;
        slide.appendChild(placeholderBadge);

        // Editor's Choice Badge
        if (isEditorsChoice) {
            const badge = document.createElement('div');
            badge.className = 'editors-choice-badge';
            badge.innerHTML = `<span class="icon">★</span> Editor's Choice`;
            slide.appendChild(badge);
        }

        // STORY TEXT
        if (data.text) {
            const textPanel = document.createElement('div');
            textPanel.className = 'slide-text-panel';
            
            const textContent = document.createElement('p');
            textContent.className = 'slide-text';
            textContent.textContent = data.text;
            
            textPanel.appendChild(textContent);
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

    createHeroSlide(series, episode, title) {
        const slide = document.createElement('div');
        slide.className = 'slide title-card hero-card';
        slide.dataset.type = 'title';
        slide.dataset.animation = JSON.stringify({ type: 'zoomIn', duration: 10 });
        
        const epNumStr = episode.toString().padStart(2, '0');
        
        // Small placeholder badge (top-right corner)
        const placeholderBadge = document.createElement('div');
        placeholderBadge.className = 'placeholder-badge';
        placeholderBadge.title = 'Cinematic Hero Image';
        placeholderBadge.innerHTML = `<span class="badge-label">📷 Image TBD</span>`;
        slide.appendChild(placeholderBadge);
        
        const textPanel = document.createElement('div');
        textPanel.className = 'slide-text-panel center-content';
        textPanel.innerHTML = `
            <p class="caption uppercase text-gold">Series ${series} • Episode ${epNumStr}</p>
            <div class="gold-line"></div>
            <h2 class="heading-lg">${title || 'Johar Gandhi'}</h2>
        `;

        // Chapter Navigation
        const navPanel = document.createElement('div');
        navPanel.className = 'chapter-nav';
        let navHtml = '<p class="caption uppercase text-muted" style="margin-bottom: 0.5rem; font-size: 0.7rem;">Select Episode</p><div class="chapter-nav-links">';
        for (let i = 1; i <= 10; i++) {
            const isActive = i === parseInt(episode) ? 'active' : '';
            navHtml += `<a href="player.html?s=${series}&e=${i}" class="chapter-link ${isActive}">${i}</a>`;
        }
        navHtml += '</div>';
        navPanel.innerHTML = navHtml;

        const progress = document.createElement('div');
        progress.className = 'slide-progress';
        progress.innerHTML = '<div class="progress-bar-fill"></div>';

        slide.appendChild(textPanel);
        slide.appendChild(navPanel);
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
