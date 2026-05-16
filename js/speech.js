/**
 * JOHAR GANDHI - Speech Engine
 * Wraps window.speechSynthesis for Read Along mode.
 */

class SpeechEngine {
    constructor() {
        this.synth = window.speechSynthesis;
        this.voices = [];
        this.preferredVoice = null;
        this.isPlaying = false;
        this.isSupported = 'speechSynthesis' in window;

        if (this.isSupported) {
            this.populateVoices();
            if (speechSynthesis.onvoiceschanged !== undefined) {
                speechSynthesis.onvoiceschanged = () => this.populateVoices();
            }
        }
    }

    populateVoices() {
        this.voices = this.synth.getVoices();
        // Prefer Hindi voices, specifically Google's if available
        this.preferredVoice = this.voices.find(v => v.lang.includes('hi') && v.name.includes('Google')) || 
                              this.voices.find(v => v.lang.includes('hi')) || 
                              this.voices.find(v => v.lang.includes('en'));
    }

    /**
     * Reads text aloud
     * @param {string} text - The text to read
     * @param {function} onEndCallback - Optional callback when speech finishes
     */
    speak(text, onEndCallback = null) {
        if (!this.isSupported || !text) return;
        
        this.stop(); // Stop any ongoing speech

        const utterance = new SpeechSynthesisUtterance(text);
        if (this.preferredVoice) {
            utterance.voice = this.preferredVoice;
        }
        utterance.rate = 0.9; // Slightly slower for dramatic effect
        utterance.pitch = 1.0;

        utterance.onend = () => {
            this.isPlaying = false;
            if (onEndCallback) onEndCallback();
        };

        utterance.onerror = (e) => {
            console.error('SpeechSynthesisError', e);
            this.isPlaying = false;
        };

        this.isPlaying = true;
        this.synth.speak(utterance);
    }

    /**
     * Stops the current speech
     */
    stop() {
        if (this.isSupported) {
            this.synth.cancel();
            this.isPlaying = false;
        }
    }

    togglePause() {
        if (!this.isSupported) return;
        
        if (this.synth.paused) {
            this.synth.resume();
            this.isPlaying = true;
        } else if (this.synth.speaking) {
            this.synth.pause();
            this.isPlaying = false;
        }
    }
}

export default new SpeechEngine();
