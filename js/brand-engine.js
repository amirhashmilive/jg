/**
 * JOHAR GANDHI - Brand Engine
 * Manages dynamic brand identity integration across the experience.
 */

class BrandEngine {
    constructor() {
        this.assets = {
            jgPrimary: 'images/brand/LOGO Johar Gandhi.png',
            mfPrimary: 'images/brand/LOGO - MEER FOUNDATION horizontal logo.png',
            mfSquare: 'images/brand/LOGO - MEER FOUNDATION 1x1.png',
            mfLeaf: 'images/brand/Meer Foundation Leaf.png'
        };
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
        
        // Mode Toggle
        const modeToggle = document.createElement('button');
        modeToggle.id = 'mode-toggle';
        modeToggle.className = 'hud-button pill';
        modeToggle.innerHTML = '<span class="icon">📖</span> Read Along';
        
        // Brand elements
        const jgLogo = document.createElement('img');
        jgLogo.src = this.assets.jgPrimary;
        jgLogo.className = 'hud-logo jg-logo';
        jgLogo.alt = 'Johar Gandhi';

        const mfLogo = document.createElement('img');
        mfLogo.src = this.assets.mfLeaf;
        mfLogo.className = 'hud-logo mf-logo';
        mfLogo.alt = 'Meer Foundation';

        hud.appendChild(jgLogo);
        hud.appendChild(modeToggle);
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

        // Load and draw logos
        try {
            const jgImg = await this.loadImage(this.assets.jgPrimary);
            const mfImg = await this.loadImage(this.assets.mfPrimary);

            // JG Top Left
            const jgWidth = width * 0.15;
            const jgHeight = (jgWidth / jgImg.width) * jgImg.height;
            ctx.drawImage(jgImg, width * 0.05, width * 0.05, jgWidth, jgHeight);

            // MF Bottom Right
            const mfWidth = width * 0.2;
            const mfHeight = (mfWidth / mfImg.width) * mfImg.height;
            ctx.drawImage(mfImg, width - mfWidth - (width * 0.05), height - mfHeight - (width * 0.05), mfWidth, mfHeight);
            
            // "A Meer Foundation Initiative"
            ctx.font = `300 ${width * 0.015}px Inter`;
            ctx.fillStyle = this.colors.ivory;
            ctx.textAlign = 'right';
            ctx.globalAlpha = 0.6;
            ctx.fillText('A Meer Foundation Initiative', width - (width * 0.05), height - mfHeight - (width * 0.06));
            ctx.globalAlpha = 1.0;
        } catch (e) {
            console.error("Failed to apply brand images to canvas", e);
        }
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
