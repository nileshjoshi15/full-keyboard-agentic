class FullKeyboard {
    constructor() {
        this.output = document.getElementById('output');
        this.keys = document.querySelectorAll('.key');
        this.capsLock = false;
        this.shiftPressed = false;
        this.shiftToggle = false;
        this.init();
    }

    init() {
        // Add click listeners to all keys
        this.keys.forEach(key => {
            key.addEventListener('click', (e) => this.handleKeyClick(e));
        });

        // Add physical keyboard listeners
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
    }

    handleKeyClick(e) {
        const key = e.target.closest('.key');
        const keyValue = key.dataset.key;
        
        // Add pressed effect
        key.classList.add('pressed');
        setTimeout(() => key.classList.remove('pressed'), 150);

        this.processKey(keyValue);
    }

    handleKeyDown(e) {
        // Find the corresponding visual key
        const visualKey = this.findVisualKey(e.code || e.key);
        if (visualKey) {
            visualKey.classList.add('pressed');
        }

        // Handle shift state for physical keyboard (optional - can be disabled)
        if (e.key === 'Shift') {
            // Only use physical shift if toggle is not active
            if (!this.shiftToggle) {
                this.shiftPressed = true;
            }
        }

        this.processKey(e.key);
        e.preventDefault();
    }

    handleKeyUp(e) {
        // Remove pressed effect from visual key
        const visualKey = this.findVisualKey(e.code || e.key);
        if (visualKey) {
            visualKey.classList.remove('pressed');
        }

        // Handle shift release for physical keyboard
        if (e.key === 'Shift') {
            // Only release physical shift if toggle is not active
            if (!this.shiftToggle) {
                this.shiftPressed = false;
            }
        }
    }

    findVisualKey(keyCode) {
        // Map some common key codes to our data-key values
        const keyMap = {
            'Space': ' ',
            'ShiftLeft': 'ShiftLeft',
            'ShiftRight': 'ShiftRight',
            'ControlLeft': 'ControlLeft',
            'ControlRight': 'ControlRight',
            'AltLeft': 'AltLeft',
            'AltRight': 'AltRight'
        };

        const mappedKey = keyMap[keyCode] || keyCode.replace('Key', '').toLowerCase();
        return document.querySelector(`[data-key="${mappedKey}"]`);
    }

    processKey(key) {
        switch (key) {
            case 'Backspace':
                this.output.textContent = this.output.textContent.slice(0, -1);
                break;
            
            case 'Enter':
                this.output.textContent += '\n';
                break;
            
            case 'Tab':
                this.output.textContent += '    ';
                break;
            
            case 'CapsLock':
                this.capsLock = !this.capsLock;
                const capsKey = document.querySelector('[data-key="CapsLock"]');
                capsKey.classList.toggle('active', this.capsLock);
                break;
            
            case 'Shift':
            case 'ShiftLeft':
            case 'ShiftRight':
                // Toggle shift state
                this.shiftToggle = !this.shiftToggle;
                this.shiftPressed = this.shiftToggle;
                
                // Update visual state for both shift keys
                const leftShift = document.querySelector('[data-key="ShiftLeft"]');
                const rightShift = document.querySelector('[data-key="ShiftRight"]');
                if (leftShift) {
                    leftShift.classList.toggle('active', this.shiftToggle);
                }
                if (rightShift) {
                    rightShift.classList.toggle('active', this.shiftToggle);
                }
                break;
            
            case 'Control':
            case 'ControlLeft':
            case 'ControlRight':
            case 'Alt':
            case 'AltLeft':
            case 'AltRight':
                // Modifier keys don't produce output
                break;
            
            case ' ':
                this.output.textContent += ' ';
                break;
            
            default:
                if (key.length === 1) {
                    let char = key;
                    
                    // Handle letter case
                    if (key.match(/[a-z]/)) {
                        if (this.capsLock || this.shiftPressed) {
                            char = key.toUpperCase();
                        }
                    }
                    
                    // Handle shifted symbols
                    if (this.shiftPressed) {
                        const shiftMap = {
                            '1': '!', '2': '@', '3': '#', '4': '$', '5': '%',
                            '6': '^', '7': '&', '8': '*', '9': '(', '0': ')',
                            '-': '_', '=': '+', '[': '{', ']': '}', '\\': '|',
                            ';': ':', "'": '"', ',': '<', '.': '>', '/': '?',
                            '`': '~'
                        };
                        char = shiftMap[key] || char;
                    }
                    
                    this.output.textContent += char;
                    
                    // Auto-disable shift after typing a character (like on real keyboards)
                    if (this.shiftToggle && !this.capsLock) {
                        this.shiftToggle = false;
                        this.shiftPressed = false;
                        
                        // Remove visual state from shift keys
                        const leftShift = document.querySelector('[data-key="ShiftLeft"]');
                        const rightShift = document.querySelector('[data-key="ShiftRight"]');
                        if (leftShift) {
                            leftShift.classList.remove('active');
                        }
                        if (rightShift) {
                            rightShift.classList.remove('active');
                        }
                    }
                }
                break;
        }
    }
}

// Initialize the keyboard when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new FullKeyboard();
});