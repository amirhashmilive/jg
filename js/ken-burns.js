/**
 * JOHAR GANDHI - Ken Burns Animation Controller
 * Manages the application of CSS animation classes to images based on slide data.
 */

class KenBurnsController {
    constructor() {
        this.activeImage = null;
        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    /**
     * Applies the Ken Burns effect to a specific slide element
     * @param {HTMLElement} slideEl - The slide DOM element
     * @param {Object} animationData - Animation properties from JSON
     */
    applyEffect(slideEl, animationData) {
        if (!slideEl || this.prefersReducedMotion) return;

        const img = slideEl.querySelector('.slide-image-wrap img');
        if (!img) return;

        // Reset previous animations
        img.className = '';
        
        // Force reflow
        void img.offsetWidth;

        if (animationData && animationData.type) {
            // Apply the specific CSS animation class defined in animations.css
            img.classList.add(`kb-${animationData.type}`);
        } else {
            // Fallback default
            img.classList.add('kb-zoomIn');
        }

        // Adjust animation duration if specified
        if (animationData && animationData.duration) {
            img.style.animationDuration = `${animationData.duration}s`;
        }

        this.activeImage = img;
    }

    /**
     * Pauses the animation on the currently active slide
     */
    pause() {
        if (this.activeImage) {
            this.activeImage.style.animationPlayState = 'paused';
        }
    }

    /**
     * Resumes the animation on the currently active slide
     */
    resume() {
        if (this.activeImage) {
            this.activeImage.style.animationPlayState = 'running';
        }
    }
}

export default new KenBurnsController();
