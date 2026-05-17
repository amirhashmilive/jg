/**
 * JOHAR GANDHI - Brand Engine
 * Manages dynamic brand identity integration across the experience.
 */

class BrandEngine {
    constructor() {
        this.colors = {
            gold: '#C8A85C',
            black: '#0A0A0A',
            ivory: '#F5F0E8'
        };
    }

    /**
     * Creates the HUD for the player
     * @returns {HTMLElement} The HUD container
     */
    createPlayerHUD() {
        const hud = document.createElement('div');
        hud.className = 'player-hud';
        
        // Brand elements
        const jgLogo = document.createElement('a');
        jgLogo.href = '../index.html';
        jgLogo.className = 'hud-logo jg-logo display-lg text-primary';
        jgLogo.style.fontSize = '1.5rem';
        jgLogo.style.textDecoration = 'none';
        jgLogo.innerText = 'Johar Gandhi';

        const mfLogo = document.createElement('div');
        mfLogo.className = 'hud-logo mf-logo body-sm text-muted';
        mfLogo.style.alignSelf = 'center';
        mfLogo.innerText = 'A Cinematic History Experience';

        hud.appendChild(jgLogo);
        hud.appendChild(mfLogo);

        return hud;
    }

    /**
     * Stamps branding on a canvas context (used by download.js)
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} width 
     * @param {number} height 
     */
    async applyBrandingToCanvas(ctx, width, height) {
        // Subtle gradient overlay at bottom
        const gradient = ctx.createLinearGradient(0, height * 0.7, 0, height);
        gradient.addColorStop(0, 'rgba(10, 10, 10, 0)');
        gradient.addColorStop(1, 'rgba(10, 10, 10, 0.9)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, height * 0.7, width, height * 0.3);

        // Gold Border
        ctx.strokeStyle = this.colors.gold;
        ctx.lineWidth = Math.max(2, width * 0.002);
        ctx.strokeRect(0, 0, width, height);

        // Brand Text Rendering
        ctx.font = `900 ${width * 0.04}px Playfair Display`;
        ctx.fillStyle = this.colors.ivory;
        ctx.textAlign = 'left';
        ctx.fillText('Johar Gandhi', width * 0.05, height * 0.1);
        
        // "A Cinematic History Experience"
        ctx.font = `300 ${width * 0.015}px Inter`;
        ctx.fillStyle = this.colors.ivory;
        ctx.textAlign = 'right';
        ctx.globalAlpha = 0.8;
        ctx.fillText('A Cinematic History Experience', width - (width * 0.05), height - (width * 0.05));
        ctx.globalAlpha = 1.0;
    }

    loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }
}

export default new BrandEngine();
