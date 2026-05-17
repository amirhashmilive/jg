/**
 * JOHAR GANDHI - Main Application
 * Coordinates slide rendering, scroll engine, and state.
 */

import slideRenderer from './slide-renderer.js?v=8';
import scrollEngine from './scroll-engine.js?v=8';
import brandEngine from './brand-engine.js?v=8';


class App {
    constructor() {
        this.currentSeries = 1;
        this.currentEpisode = 1;
        this.episodeData = null;
    }

    async initPlayer() {
        // Parse URL params
        const urlParams = new URLSearchParams(window.location.search);
        this.currentSeries = parseInt(urlParams.get('s')) || 1;
        this.currentEpisode = parseInt(urlParams.get('e')) || 1;

        // Build HUD
        const hud = brandEngine.createPlayerHUD();
        document.body.appendChild(hud);

        // Build Bottom Nav
        this.buildNavigation();

        // Load data
        this.episodeData = await slideRenderer.loadEpisode(this.currentSeries, this.currentEpisode);
        
        if (this.episodeData) {
            // Initialize Scroll Engine
            scrollEngine.init('#slide-container');
            
            // Listen for slide changes
            scrollEngine.onSlideChange((index, slideElement) => {
                this.handleSlideChange(index, slideElement);
            });

            // Initial slide trigger
            const firstSlide = document.querySelector('.slide');
            if (firstSlide) {
                scrollEngine.handleSlideActive(firstSlide);
            }

            // Register Service Worker for offline caching of this episode
            this.registerServiceWorker();
        }
    }

    handleSlideChange(index, slideElement) {
        // Update Slide Counter
        const counter = document.getElementById('slide-counter');
        if (counter && this.episodeData) {
            counter.innerText = `Slide ${index + 1} of ${this.episodeData.slides.length}`;
        }
        
        // Update Progress Bar
        const progressFill = document.getElementById('nav-progress-fill');
        if (progressFill && this.episodeData) {
            const percentage = ((index + 1) / this.episodeData.slides.length) * 100;
            progressFill.style.width = `${percentage}%`;
        }
    }

    buildNavigation() {
        const navContainer = document.createElement('div');
        navContainer.className = 'bottom-nav';

        // Progress Bar
        const progressBar = document.createElement('div');
        progressBar.className = 'nav-progress-bar';
        const progressFill = document.createElement('div');
        progressFill.id = 'nav-progress-fill';
        progressBar.appendChild(progressFill);

        // Controls Container
        const controls = document.createElement('div');
        controls.className = 'nav-controls';

        // Prev Button
        const prevBtn = document.createElement('button');
        prevBtn.className = 'nav-btn';
        prevBtn.innerHTML = '&#8592; Prev';
        prevBtn.addEventListener('click', () => {
            if (scrollEngine.activeIndex > 0) {
                const prevSlide = scrollEngine.slides[scrollEngine.activeIndex - 1];
                if (prevSlide) prevSlide.scrollIntoView({ behavior: 'smooth' });
            }
        });

        // Counter
        const counter = document.createElement('div');
        counter.id = 'slide-counter';
        counter.className = 'nav-counter body-sm';
        counter.innerText = 'Slide 1 of --';

        // Next Button
        const nextBtn = document.createElement('button');
        nextBtn.className = 'nav-btn';
        nextBtn.innerHTML = 'Next &#8594;';
        nextBtn.addEventListener('click', () => {
            if (scrollEngine.activeIndex < scrollEngine.slides.length - 1) {
                const nextSlide = scrollEngine.slides[scrollEngine.activeIndex + 1];
                if (nextSlide) nextSlide.scrollIntoView({ behavior: 'smooth' });
            }
        });

        controls.appendChild(prevBtn);
        controls.appendChild(counter);
        controls.appendChild(nextBtn);

        navContainer.appendChild(progressBar);
        navContainer.appendChild(controls);

        document.body.appendChild(navContainer);
    }

    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(registrations => {
                for (let registration of registrations) {
                    registration.unregister();
                }
            });
        }
    }
}

// Initialize if we are on the player page
if (window.location.pathname.includes('player')) {
    const app = new App();
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => app.initPlayer());
    } else {
        app.initPlayer();
    }
    window.jgApp = app; // Expose for debugging/console
}

export default App;
