/**
 * JOHAR GANDHI - Download Engine
 * Handles rendering of current slide to a Canvas and downloading as an image.
 */

import brandEngine from './brand-engine.js';

class DownloadEngine {
    constructor() {
        this.isProcessing = false;
    }

    /**
     * Captures the current slide and triggers a download
     * @param {HTMLElement} slideElement - The active slide DOM element
     * @param {Object} slideData - The data object for the slide
     */
    async downloadSlide(slideElement, slideData) {
        if (this.isProcessing || !slideElement) return;
        this.isProcessing = true;

        try {
            const canvas = document.createElement('canvas');
            // Target 1920x1080 for downloads (16:9)
            canvas.width = 1920;
            canvas.height = 1080;
            const ctx = canvas.getContext('2d');

            // 1. Draw base image
            const imgEl = slideElement.querySelector('.slide-image-wrap img');
            if (imgEl && imgEl.complete) {
                // Calculate cover math for 16:9
                const imgRatio = imgEl.naturalWidth / imgEl.naturalHeight;
                const canvasRatio = canvas.width / canvas.height;
                let drawWidth = canvas.width;
                let drawHeight = canvas.height;
                let offsetX = 0;
                let offsetY = 0;

                if (imgRatio > canvasRatio) {
                    drawWidth = canvas.height * imgRatio;
                    offsetX = (canvas.width - drawWidth) / 2;
                } else {
                    drawHeight = canvas.width / imgRatio;
                    offsetY = (canvas.height - drawHeight) / 2;
                }

                // Need to draw image to a temporary canvas first if we want to bypass CORS on local
                // Assuming images are local and relative, so no CORS issue
                ctx.drawImage(imgEl, offsetX, offsetY, drawWidth, drawHeight);
            } else {
                ctx.fillStyle = '#0A0A0A';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            // 2. Draw text if in Read Along mode or if it's a quote slide
            const isReadMode = document.body.classList.contains('mode-read');
            if ((isReadMode || slideData.type === 'quote') && slideData.text) {
                this.drawText(ctx, slideData.text, canvas.width, canvas.height);
            }

            // 3. Apply Brand Overlays
            await brandEngine.applyBrandingToCanvas(ctx, canvas.width, canvas.height);

            // 4. Trigger Download
            const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
            const link = document.createElement('a');
            link.download = `Johar-Gandhi-${slideData.id || 'slide'}.jpg`;
            link.href = dataUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (error) {
            console.error("Failed to generate download:", error);
            alert("Sorry, there was an issue generating your image.");
        } finally {
            this.isProcessing = false;
        }
    }

    drawText(ctx, text, width, height) {
        ctx.fillStyle = 'rgba(10, 10, 10, 0.7)';
        ctx.fillRect(0, height * 0.75, width, height * 0.25);

        ctx.font = `400 ${width * 0.025}px Inter`;
        ctx.fillStyle = '#F5F0E8';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Simple word wrap
        const words = text.split(' ');
        let line = '';
        let lines = [];
        const maxWidth = width * 0.8;

        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                lines.push(line);
                line = words[n] + ' ';
            } else {
                line = testLine;
            }
        }
        lines.push(line);

        const lineHeight = width * 0.035;
        const startY = height * 0.85 - ((lines.length - 1) * lineHeight) / 2;

        for (let i = 0; i < lines.length; i++) {
            ctx.fillText(lines[i], width / 2, startY + (i * lineHeight));
        }
    }
}

export default new DownloadEngine();
