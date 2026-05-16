/**
 * JOHAR GANDHI - Main Application
 * Coordinates slide rendering, scroll engine, speech, and state.
 */

import slideRenderer from './slide-renderer.js';
import scrollEngine from './scroll-engine.js';
import speechEngine from './speech.js';
import brandEngine from './brand-engine.js';
import downloadEngine from './download.js';

class App {
    constructor() {
        this.currentSeries = 1;
        this.currentEpisode = 1;
        this.mode = localStorage.getItem('jg_mode') || 'visual'; // 'visual' or 'reading'
        this.episodeData = null;
    }

    async initPlayer() {
        // Parse URL params
        const urlParams = new URLSearchParams(window.location.search);
        this.currentSeries = parseInt(urlParams.get('s')) || 1;
        this.currentEpisode = parseInt(urlParams.get('e')) || 1;

        // Apply initial mode
        this.setMode(this.mode);

        // Build HUD
        const hud = brandEngine.createPlayerHUD();
        document.body.appendChild(hud);
        
        // Mode toggle listener
        const toggleBtn = document.getElementById('mode-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                const newMode = this.mode === 'visual' ? 'reading' : 'visual';
                this.setMode(newMode);
            });
        }

        // Load data
        this.episodeData = await slideRenderer.loadEpisode(this.currentSeries, this.currentEpisode);
        
        if (this.episodeData) {
            // Initialize Scroll Engine
            scrollEngine.init('#slide-container');
            scrollEngine.setMode(this.mode);
            
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

    setMode(mode) {
        this.mode = mode;
        localStorage.setItem('jg_mode', mode);
        
        if (mode === 'visual') {
            document.body.classList.remove('mode-read');
            document.body.classList.add('mode-visual');
            const toggle = document.getElementById('mode-toggle');
            if(toggle) toggle.innerHTML = '<span class="icon">📖</span> Read Along';
            speechEngine.stop();
        } else {
            document.body.classList.remove('mode-visual');
            document.body.classList.add('mode-read');
            const toggle = document.getElementById('mode-toggle');
            if(toggle) toggle.innerHTML = '<span class="icon">🎬</span> Visual Story';
        }

        // Update scroll engine timings
        if (scrollEngine.container) {
            scrollEngine.setMode(mode);
        }
    }

    handleSlideChange(index, slideElement) {
        const slideData = this.episodeData.slides[index] || {};
        
        // Handle Speech
        speechEngine.stop();
        if (this.mode === 'reading' && slideData.text) {
            // Wait a moment for transition before speaking
            setTimeout(() => {
                // Only speak if we are still on this slide and still in reading mode
                if (scrollEngine.activeIndex === index && this.mode === 'reading') {
                    speechEngine.speak(slideData.text);
                }
            }, 800);
        }
    }

    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('../sw.js').then(registration => {
                    console.log('SW registered: ', registration);
                    
                    // Send message to cache current episode
                    if (registration.active && this.episodeData) {
                        registration.active.postMessage({
                            type: 'CACHE_EPISODE',
                            payload: {
                                series: this.currentSeries,
                                episode: this.currentEpisode,
                                images: this.episodeData.slides.map(s => s.image)
                            }
                        });
                    }
                }).catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
            });
        }
    }
}

// Initialize if we are on the player page
if (window.location.pathname.includes('player.html')) {
    const app = new App();
    document.addEventListener('DOMContentLoaded', () => app.initPlayer());
    window.jgApp = app; // Expose for debugging/console
}

export default App;
