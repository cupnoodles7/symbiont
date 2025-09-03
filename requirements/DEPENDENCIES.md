# Project Dependencies

This document lists all the dependencies required for the Capy Project.

## Runtime Dependencies

### Server Dependencies (Express.js Backend)

| Package   | Version | Purpose                                  |
| --------- | ------- | ---------------------------------------- |
| express   | ^5.1.0  | Web server framework                     |
| socket.io | ^4.8.1  | Real-time bidirectional communication    |
| cors      | ^2.8.5  | Cross-Origin Resource Sharing middleware |

### Client Dependencies (React Frontend)

| Package          | Version | Purpose                                      |
| ---------------- | ------- | -------------------------------------------- |
| react            | ^19.1.1 | UI library for building user interfaces      |
| react-dom        | ^19.1.1 | React DOM renderer                           |
| socket.io-client | ^4.8.1  | Socket.IO client for real-time communication |

### Client Development Dependencies

| Package                     | Version  | Purpose                                   |
| --------------------------- | -------- | ----------------------------------------- |
| vite                        | ^7.1.2   | Fast build tool and development server    |
| @vitejs/plugin-react        | ^5.0.0   | Vite plugin for React support             |
| eslint                      | ^9.33.0  | JavaScript linting utility                |
| @eslint/js                  | ^9.33.0  | ESLint JavaScript configuration           |
| eslint-plugin-react-hooks   | ^5.2.0   | ESLint rules for React Hooks              |
| eslint-plugin-react-refresh | ^0.4.20  | ESLint plugin for React Fast Refresh      |
| @types/react                | ^19.1.10 | TypeScript type definitions for React     |
| @types/react-dom            | ^19.1.7  | TypeScript type definitions for React DOM |
| globals                     | ^16.3.0  | Global variables for various environments |

### Root Level Dependencies

| Package      | Version | Purpose                            |
| ------------ | ------- | ---------------------------------- |
| concurrently | ^9.1.0  | Run multiple commands concurrently |

## System Requirements

### Node.js

- **Minimum Version**: 18.0.0
- **Recommended Version**: 18.20.0 (LTS)
- **Download**: https://nodejs.org/

### npm

- **Minimum Version**: 8.0.0
- **Comes with**: Node.js installation

## Asset Dependencies

The project also depends on the following asset files:

### Game Assets

- `assets/capy_atlas.png` - Sprite sheet containing all animation frames
- `assets/capy_atlas.webp` - WebP version of the sprite sheet
- `assets/capy_atlas.json` - Generated JSON mapping for animations
- `frames_resized/` - Individual 64x64 animation frames

### Configuration Files

- `buildAtlasJson.js` - Script to generate atlas JSON from frames

## Port Requirements

The application uses the following default ports:

- **Client (Vite)**: 5173
- **Server (Express)**: 4000

Make sure these ports are available on your system, or configure alternative ports via environment variables.

## Browser Compatibility

### Supported Browsers

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Required Features

- ES6+ JavaScript support
- WebSocket support (for Socket.IO)
- Canvas API (for game rendering)
- Modern CSS features (Flexbox, CSS Grid)

## Development Tools (Optional but Recommended)

- **VS Code**: Recommended IDE with React and Node.js extensions
- **Git**: For version control
- **Postman**: For API testing
- **React Developer Tools**: Browser extension for React debugging
