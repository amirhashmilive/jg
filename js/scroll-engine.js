/**
 * JOHAR GANDHI - Scroll Engine
 * Manages IntersectionObserver for active slides, auto-scroll mechanics, and manual overrides.
 */

import kenBurns from './ken-burns.js';

class ScrollEngine {
    constructor() {
        this.container = null;
        this.slides = [];
        this.activeIndex = 0;
        
        // Settings (from user corrections)
        this.settings = {
            readingDuration: 30000, // 30s for Read Along mode
            visualDuration: 15000,  // 15s for Visual Story mode
            speedMultiplier: 1.0,
            autoScrollEnabled: true,
            inactivityTimeout: 5000 // 5s resume after manual scroll
        };

        this.autoScrollTimer = null;
        this.inactivityTimer = null;
        this.isManualScrolling = false;
        this.currentMode = 'visual'; // 'visual' or 'reading'

        this.onSlideChangeCallbacks = [];

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.handleSlideActive(entry.target);
                }
            });
        }, {
            root: null, // viewport
            threshold: 0.6 // triggers when 60% of slide is visible
        });
    }

    init(containerSelector) {
        this.container = document.querySelector(containerSelector);
        if (!this.container) return;

        this.slides = Array.from(this.container.querySelectorAll('.slide'));
        this.slides.forEach(slide => this.observer.observe(slide));

        this.setupEventListeners();
        this.startAutoScroll();
    }

    setupEventListeners() {
        // Detect manual scrolling (wheel or touch)
        const pauseAutoScroll = () => {
            if (!this.settings.autoScrollEnabled) return;
            
            this.isManualScrolling = true;
            this.pauseAutoScroll();
            
            // Reset inactivity timer
            clearTimeout(this.inactivityTimer);
            this.inactivityTimer = setTimeout(() => {
                this.isManualScrolling = false;
                this.startAutoScroll();
            }, this.settings.inactivityTimeout);
        };

        window.addEventListener('wheel', pauseAutoScroll, { passive: true });
        window.addEventListener('touchstart', pauseAutoScroll, { passive: true });
        window.addEventListener('keydown', (e) => {
            if (['ArrowUp', 'ArrowDown', 'Space'].includes(e.code)) {
                pauseAutoScroll();
            }
        });
    }

    handleSlideActive(slideElement) {
        // Remove active class from all
        this.slides.forEach(s => s.classList.remove('active'));
        
        // Set new active slide
        slideElement.classList.add('active');
        this.activeIndex = parseInt(slideElement.dataset.index || 0);

        // Apply Ken Burns
        const animDataStr = slideElement.dataset.animation;
        const animData = animDataStr ? JSON.parse(animDataStr) : null;
        
        // Determine current duration based on mode and multiplier
        const baseDuration = this.currentMode === 'reading' ? this.settings.readingDuration : this.settings.visualDuration;
        const actualDuration = baseDuration / this.settings.speedMultiplier;

        // Apply CSS variable for progress bar
        slideElement.style.setProperty('--slide-duration', `${actualDuration}ms`);

        // Apply animation
        if (animData) {
            animData.duration = actualDuration / 1000; // convert to seconds for CSS
        }
        kenBurns.applyEffect(slideElement, animData);

        // Restart auto scroll timer for this slide
        if (this.settings.autoScrollEnabled && !this.isManualScrolling) {
            this.startAutoScroll();
        }

        // Notify subscribers
        this.onSlideChangeCallbacks.forEach(cb => cb(this.activeIndex, slideElement));
    }

    startAutoScroll() {
        this.pauseAutoScroll(); // Clear existing

        if (!this.settings.autoScrollEnabled) return;

        const baseDuration = this.currentMode === 'reading' ? this.settings.readingDuration : this.settings.visualDuration;
        const duration = baseDuration / this.settings.speedMultiplier;

        // Visual progress bar reset
        const currentSlide = this.slides[this.activeIndex];
        if (currentSlide) {
            currentSlide.style.setProperty('--progress-state', 'running');
        }

        this.autoScrollTimer = setTimeout(() => {
            this.scrollToNext();
        }, duration);
    }

    pauseAutoScroll() {
        clearTimeout(this.autoScrollTimer);
        
        // Visual progress bar pause
        const currentSlide = this.slides[this.activeIndex];
        if (currentSlide) {
            currentSlide.style.setProperty('--progress-state', 'paused');
        }
    }

    scrollToNext() {
        if (this.activeIndex < this.slides.length - 1) {
            this.slides[this.activeIndex + 1].scrollIntoView({ behavior: 'smooth' });
        }
    }

    scrollToPrev() {
        if (this.activeIndex > 0) {
            this.slides[this.activeIndex - 1].scrollIntoView({ behavior: 'smooth' });
        }
    }

    setMode(mode) {
        this.currentMode = mode;
        this.startAutoScroll(); // Restart with new timing
    }

    setSpeed(multiplier) {
        this.settings.speedMultiplier = multiplier;
        this.startAutoScroll();
    }

    toggleAutoScroll() {
        this.settings.autoScrollEnabled = !this.settings.autoScrollEnabled;
        if (this.settings.autoScrollEnabled) {
            this.startAutoScroll();
        } else {
            this.pauseAutoScroll();
        }
        return this.settings.autoScrollEnabled;
    }

    onSlideChange(callback) {
        this.onSlideChangeCallbacks.push(callback);
    }
}

export default new ScrollEngine();
