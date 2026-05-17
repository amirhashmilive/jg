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
            
            // Initialize global keyboard navigation
            this.initKeyboardListeners();

            // Presentation Mode Loop Navigation (Always on for player)
            document.addEventListener('episodeEnd', () => {
                let nextE = this.currentEpisode + 1;
                let nextS = this.currentSeries;
                
                if (nextE > 10) {
                    nextE = 1;
                    nextS++;
                }
                
                if (nextS > 2) {
                    // Loop back to landing page to restart
                    window.location.href = '../index.html';
                } else {
                    // Go to next episode
                    window.location.href = `player.html?s=${nextS}&e=${nextE}`;
                }
            });

            // Register Service Worker for offline caching of this episode
            this.registerServiceWorker();
        }
    }

    handleSlideChange(index, slideElement) {
        // Update Slide Counter (add 1 because we injected the pure Hero Title Card)
        const counter = document.getElementById('slide-counter');
        const totalSlides = this.episodeData ? this.episodeData.slides.length + 1 : 1;
        
        if (counter && this.episodeData) {
            counter.innerText = `Slide ${index + 1} of ${totalSlides}`;
        }
        
        // Update Progress Bar
        const progressFill = document.getElementById('nav-progress-fill');
        if (progressFill && this.episodeData) {
            const percentage = ((index + 1) / totalSlides) * 100;
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

    initKeyboardListeners() {
        window.addEventListener('keydown', (e) => {
            // Ignore if modifier keys are pressed to not interfere with browser defaults
            if (e.ctrlKey || e.altKey || e.metaKey) return;
            // Ignore if focus is inside an input field
            if (e.target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

            switch(e.code) {
                case 'ArrowDown':
                case 'ArrowRight':
                    e.preventDefault();
                    scrollEngine.scrollToNext();
                    break;
                case 'ArrowUp':
                case 'ArrowLeft':
                    e.preventDefault();
                    scrollEngine.scrollToPrev();
                    break;
                case 'Space':
                    e.preventDefault();
                    scrollEngine.toggleAutoScroll();
                    break;
                case 'Home':
                    e.preventDefault();
                    scrollEngine.scrollToFirst();
                    break;
                case 'End':
                    e.preventDefault();
                    scrollEngine.scrollToLast();
                    break;
                case 'Escape':
                    e.preventDefault();
                    scrollEngine.stopAutoScroll();
                    break;
            }
        });
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
