
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FullKeyboard is a web-based virtual keyboard application built with HTML, CSS, and vanilla JavaScript. It provides a fully interactive keyboard interface that responds to both mouse clicks and physical keyboard input.

## Development Setup

This is a static web application that requires no build process or dependencies. To run:

- Open `index.html` in any modern web browser
- Or serve locally with: `python -m http.server 8000` (Python 3) or `python -m SimpleHTTPServer 8000` (Python 2)

## File Structure

- **index.html**: Main HTML file with keyboard structure
- **style.css**: All CSS styling including responsive design and animations
- **script.js**: JavaScript with FullKeyboard class handling all interactions
- **CLAUDE.md**: Development guidance file

## Features

- Full QWERTY keyboard layout with number row and special keys
- Visual feedback for key presses (both mouse and keyboard)
- Caps Lock toggle functionality
- Shift key support for uppercase letters and symbols
- Special key handling (Backspace, Enter, Tab, Space)
- Text output display area
- Responsive design for mobile devices
- Glassmorphism design with gradient background