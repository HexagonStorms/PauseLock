# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## NoFlake Chrome Extension

### Project Structure
- Chrome extension using Manifest V3
- Vanilla JavaScript (no frameworks)
- Content script injects into YouTube pages
- Background service worker for initialization
- Popup for user settings

### Development
- **Installation**: Load unpacked extension via Chrome's developer mode
- **Testing**: Manual testing on YouTube.com
- **Deployment**: No build process - extension loaded directly

### Code Style Guidelines
- **Formatting**: 2-space indentation, semicolons required
- **Naming**: camelCase for variables and functions
- **Comments**: Document function purpose and code sections
- **Error Handling**: Input validation for user settings
- **Organization**: Global variables at top, followed by initialization, functions, and event handlers
- **Async Pattern**: Use Chrome API callbacks for storage operations
- **DOM Interaction**: Use querySelector for element selection
- **Event Handling**: Use addEventListener for DOM events