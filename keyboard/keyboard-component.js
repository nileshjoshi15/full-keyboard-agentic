class KeyboardComponent {
    constructor(containerId, options = {}) {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        this.options = {
            showTitle: options.showTitle !== false,
            title: options.title || 'Virtual Keyboard',
            outputId: options.outputId || null,
            onInput: options.onInput || null,
            ...options
        };
        
        this.capsLock = false;
        this.shiftPressed = false;
        this.shiftToggle = false;
        this.keyboard = null;
        this.output = null;
        
        this.init();
    }

    init() {
        this.render();
        this.setupEventListeners();
        
        // Add physical keyboard listeners if enabled
        if (this.options.enablePhysicalKeyboard !== false) {
            document.addEventListener('keydown', (e) => this.handleKeyDown(e));
            document.addEventListener('keyup', (e) => this.handleKeyUp(e));
        }
    }

    render() {
        const keyboardHTML = `
            <div class="keyboard-container">
                ${this.options.showTitle ? `<h1 class="keyboard-title">${this.options.title}</h1>` : ''}
                ${this.options.outputId ? '' : '<div class="keyboard-output" id="keyboard-output"></div>'}
                <div class="keyboard">
                    <!-- Number Row -->
                    <div class="row">
                        <button class="key" data-key="\`">~<br>\`</button>
                        <button class="key" data-key="1">!<br>1</button>
                        <button class="key" data-key="2">@<br>2</button>
                        <button class="key" data-key="3">#<br>3</button>
                        <button class="key" data-key="4">$<br>4</button>
                        <button class="key" data-key="5">%<br>5</button>
                        <button class="key" data-key="6">^<br>6</button>
                        <button class="key" data-key="7">&<br>7</button>
                        <button class="key" data-key="8">*<br>8</button>
                        <button class="key" data-key="9">(<br>9</button>
                        <button class="key" data-key="0">)<br>0</button>
                        <button class="key" data-key="-">_<br>-</button>
                        <button class="key" data-key="=">+<br>=</button>
                        <button class="key backspace special" data-key="Backspace">⌫</button>
                    </div>

                    <!-- Top Letter Row -->
                    <div class="row">
                        <button class="key tab special" data-key="Tab">Tab</button>
                        <button class="key" data-key="q">Q</button>
                        <button class="key" data-key="w">W</button>
                        <button class="key" data-key="e">E</button>
                        <button class="key" data-key="r">R</button>
                        <button class="key" data-key="t">T</button>
                        <button class="key" data-key="y">Y</button>
                        <button class="key" data-key="u">U</button>
                        <button class="key" data-key="i">I</button>
                        <button class="key" data-key="o">O</button>
                        <button class="key" data-key="p">P</button>
                        <button class="key" data-key="[">{<br>[</button>
                        <button class="key" data-key="]">}<br>]</button>
                        <button class="key" data-key="\\">|<br>\\</button>
                    </div>

                    <!-- Middle Letter Row -->
                    <div class="row">
                        <button class="key caps-lock special" data-key="CapsLock">Caps</button>
                        <button class="key" data-key="a">A</button>
                        <button class="key" data-key="s">S</button>
                        <button class="key" data-key="d">D</button>
                        <button class="key" data-key="f">F</button>
                        <button class="key" data-key="g">G</button>
                        <button class="key" data-key="h">H</button>
                        <button class="key" data-key="j">J</button>
                        <button class="key" data-key="k">K</button>
                        <button class="key" data-key="l">L</button>
                        <button class="key" data-key=";">:<br>;</button>
                        <button class="key" data-key="'">"<br>'</button>
                        <button class="key enter special" data-key="Enter">Enter</button>
                    </div>

                    <!-- Bottom Letter Row -->
                    <div class="row">
                        <button class="key shift special" data-key="ShiftLeft">Shift</button>
                        <button class="key" data-key="z">Z</button>
                        <button class="key" data-key="x">X</button>
                        <button class="key" data-key="c">C</button>
                        <button class="key" data-key="v">V</button>
                        <button class="key" data-key="b">B</button>
                        <button class="key" data-key="n">N</button>
                        <button class="key" data-key="m">M</button>
                        <button class="key" data-key=",">&lt;<br>,</button>
                        <button class="key" data-key=".">><br>.</button>
                        <button class="key" data-key="/">?<br>/</button>
                        <button class="key shift special" data-key="ShiftRight">Shift</button>
                    </div>

                    <!-- Space Row -->
                    <div class="row">
                        <button class="key ctrl special" data-key="ControlLeft">Ctrl</button>
                        <button class="key alt special" data-key="AltLeft">Alt</button>
                        <button class="key space" data-key=" ">Space</button>
                        <button class="key alt special" data-key="AltRight">Alt</button>
                        <button class="key ctrl special" data-key="ControlRight">Ctrl</button>
                    </div>
                </div>
            </div>
        `;

        this.container.innerHTML = keyboardHTML;
        this.keyboard = this.container.querySelector('.keyboard');
        
        // Set up output element
        if (this.options.outputId) {
            this.output = document.getElementById(this.options.outputId);
        } else {
            this.output = this.container.querySelector('.keyboard-output');
        }
    }

    setupEventListeners() {
        const keys = this.container.querySelectorAll('.key');
        keys.forEach(key => {
            key.addEventListener('click', (e) => this.handleKeyClick(e));
        });
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

        // Handle shift state for physical keyboard (optional)
        if (e.key === 'Shift') {
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
            if (!this.shiftToggle) {
                this.shiftPressed = false;
            }
        }
    }

    findVisualKey(keyCode) {
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
        return this.container.querySelector(`[data-key="${mappedKey}"]`);
    }

    processKey(key) {
        let char = '';
        let shouldOutput = true;

        switch (key) {
            case 'Backspace':
                if (this.output) {
                    this.output.textContent = this.output.textContent.slice(0, -1);
                }
                char = 'Backspace';
                break;
            
            case 'Enter':
                if (this.output) {
                    this.output.textContent += '\n';
                }
                char = '\n';
                break;
            
            case 'Tab':
                if (this.output) {
                    this.output.textContent += '    ';
                }
                char = '\t';
                break;
            
            case 'CapsLock':
                this.capsLock = !this.capsLock;
                const capsKey = this.container.querySelector('[data-key="CapsLock"]');
                capsKey.classList.toggle('active', this.capsLock);
                shouldOutput = false;
                break;
            
            case 'Shift':
            case 'ShiftLeft':
            case 'ShiftRight':
                this.shiftToggle = !this.shiftToggle;
                this.shiftPressed = this.shiftToggle;
                
                const leftShift = this.container.querySelector('[data-key="ShiftLeft"]');
                const rightShift = this.container.querySelector('[data-key="ShiftRight"]');
                if (leftShift) {
                    leftShift.classList.toggle('active', this.shiftToggle);
                }
                if (rightShift) {
                    rightShift.classList.toggle('active', this.shiftToggle);
                }
                shouldOutput = false;
                break;
            
            case 'Control':
            case 'ControlLeft':
            case 'ControlRight':
            case 'Alt':
            case 'AltLeft':
            case 'AltRight':
                shouldOutput = false;
                break;
            
            case ' ':
                if (this.output) {
                    this.output.textContent += ' ';
                }
                char = ' ';
                break;
            
            default:
                if (key.length === 1) {
                    char = key;
                    
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
                    
                    if (this.output) {
                        this.output.textContent += char;
                    }
                    
                    // Auto-disable shift after typing a character
                    if (this.shiftToggle && !this.capsLock) {
                        this.shiftToggle = false;
                        this.shiftPressed = false;
                        
                        const leftShift = this.container.querySelector('[data-key="ShiftLeft"]');
                        const rightShift = this.container.querySelector('[data-key="ShiftRight"]');
                        if (leftShift) {
                            leftShift.classList.remove('active');
                        }
                        if (rightShift) {
                            rightShift.classList.remove('active');
                        }
                    }
                } else {
                    shouldOutput = false;
                }
                break;
        }

        // Call custom input handler if provided
        if (shouldOutput && this.options.onInput) {
            this.options.onInput(char, key);
        }
    }

    // Public methods for external control
    getText() {
        return this.output ? this.output.textContent : '';
    }

    setText(text) {
        if (this.output) {
            this.output.textContent = text;
        }
    }

    clear() {
        if (this.output) {
            this.output.textContent = '';
        }
    }

    destroy() {
        document.removeEventListener('keydown', this.handleKeyDown);
        document.removeEventListener('keyup', this.handleKeyUp);
        this.container.innerHTML = '';
    }
}