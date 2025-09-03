# Capy Project - Virtual Pet Game

A virtual pet capybara game built with React and Express, featuring real-time animations and socket communication.

## Features

- Animated capybara pet with multiple states (idle, walk, eat, celebrate, sick)
- Real-time updates using Socket.IO
- Sprite-based animations using HTML Canvas
- Responsive design
- Cross-browser compatible

## Quick Start

1. Install dependencies:

   ```bash
   npm run setup
   ```

2. Start development servers:
   ```bash
   npm run dev
   ```

Frontend will be available at http://localhost:5173
Backend will be available at http://localhost:4000

## Project Structure

```
capy_project/
├── client/          # React frontend (Vite)
├── server/          # Express.js backend
├── assets/          # Game assets (atlas files)
├── frames/          # Original animation frames
├── frames_resized/  # Resized animation frames
└── requirements/    # Setup and documentation
```

## Available Scripts

- `npm run dev` - Start both client and server
- `npm run build` - Build for production
- `npm run atlas` - Rebuild game atlas
- `npm run lint` - Run ESLint

## Requirements

- Node.js 18.0.0+
- npm 8.0.0+

For detailed setup instructions and troubleshooting, see the documentation in the `requirements/` folder.
