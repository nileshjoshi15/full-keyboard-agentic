// Keyboard Overlay Component
// Handles the overlay/dialog functionality for the virtual keyboard

class KeyboardOverlay {
    constructor() {
        this.overlayKeyboard = null;
        this.init();
    }

    init() {
        // Setup global functions for overlay functionality
        this.setupGlobalFunctions();
    }

    setupGlobalFunctions() {
        // Make overlay functions globally accessible
        window.openKeyboardOverlay = () => this.openKeyboardOverlay();
        window.closeKeyboardOverlay = () => this.closeKeyboardOverlay();
        window.copyOverlayText = () => this.copyOverlayText();
        
        // Setup event listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Close overlay when clicking outside the content
        document.addEventListener('click', (e) => {
            const overlay = document.getElementById('keyboard-overlay');
            const overlayContent = document.querySelector('.overlay-content');
            
            if (overlay && overlay.classList.contains('active') && 
                e.target === overlay && !overlayContent.contains(e.target)) {
                this.closeKeyboardOverlay();
            }
        });

        // Handle escape key to close overlay
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const overlay = document.getElementById('keyboard-overlay');
                if (overlay && overlay.classList.contains('active')) {
                    e.preventDefault();
                    this.closeKeyboardOverlay();
                }
            }
        });
    }

    openKeyboardOverlay() {
        const overlay = document.getElementById('keyboard-overlay');
        const overlayOutput = document.getElementById('overlay-output');
        
        if (overlay) {
            overlay.classList.add('active');
            
            // Initialize overlay keyboard if not already done
            if (!this.overlayKeyboard) {
                this.overlayKeyboard = new KeyboardComponent('overlay-keyboard', {
                    showTitle: false,
                    outputId: 'overlay-output',
                    onInput: (char, key) => {
                        // Update output display
                        if (overlayOutput && overlayOutput.textContent === 'Start typing...') {
                            overlayOutput.textContent = '';
                        }
                    }
                });
                
                // Make overlay keyboard globally accessible for button controls
                window.overlayKeyboard = this.overlayKeyboard;
            } else {
                // Reset output text if keyboard already exists
                if (overlayOutput) {
                    overlayOutput.textContent = 'Start typing...';
                }
            }
            
            // Prevent body scrolling when overlay is open
            document.body.style.overflow = 'hidden';
            
            // Focus management for accessibility
            this.focusOverlay();
        }
    }

    closeKeyboardOverlay() {
        const overlay = document.getElementById('keyboard-overlay');
        
        if (overlay) {
            overlay.classList.remove('active');
            
            // Restore body scrolling
            document.body.style.overflow = '';
            
            // Return focus to the trigger button if it exists
            const triggerButton = document.querySelector('.overlay-button');
            if (triggerButton) {
                triggerButton.focus();
            }
        }
    }

    focusOverlay() {
        // Focus the first interactive element in the overlay for accessibility
        const closeButton = document.querySelector('.close-button');
        if (closeButton) {
            closeButton.focus();
        }
    }

    copyOverlayText() {
        if (this.overlayKeyboard) {
            const text = this.overlayKeyboard.getText();
            
            if (text && text !== 'Start typing...') {
                // Try to use the modern clipboard API
                if (navigator.clipboard && window.isSecureContext) {
                    navigator.clipboard.writeText(text).then(() => {
                        this.showCopyFeedback('Text copied to clipboard!');
                    }).catch(() => {
                        this.fallbackCopyText(text);
                    });
                } else {
                    this.fallbackCopyText(text);
                }
            } else {
                this.showCopyFeedback('No text to copy');
            }
        }
    }

    fallbackCopyText(text) {
        // Fallback method for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showCopyFeedback('Text copied to clipboard!');
        } catch (err) {
            this.showCopyFeedback('Failed to copy text');
        }
        
        document.body.removeChild(textArea);
    }

    showCopyFeedback(message) {
        // Create temporary feedback element
        const feedback = document.createElement('div');
        feedback.textContent = message;
        feedback.className = 'copy-feedback';
        feedback.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(76, 175, 80, 0.9);
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            z-index: 1001;
            font-size: 14px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            animation: fadeInOut 2s ease-in-out forwards;
        `;
        
        document.body.appendChild(feedback);
        
        // Remove feedback after animation completes
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.parentNode.removeChild(feedback);
            }
        }, 2000);
    }

    // Method to get the overlay keyboard instance
    getOverlayKeyboard() {
        return this.overlayKeyboard;
    }

    // Method to destroy the overlay keyboard (useful for cleanup)
    destroy() {
        if (this.overlayKeyboard && typeof this.overlayKeyboard.destroy === 'function') {
            this.overlayKeyboard.destroy();
        }
        this.overlayKeyboard = null;
        
        // Clean up global functions
        delete window.openKeyboardOverlay;
        delete window.closeKeyboardOverlay;
        delete window.copyOverlayText;
        delete window.overlayKeyboard;
    }
}

// Initialize overlay functionality when script loads
const keyboardOverlay = new KeyboardOverlay();

// Export for use in other scripts if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { KeyboardOverlay, keyboardOverlay };
}