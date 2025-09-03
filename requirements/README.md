# Project Setup Requirements

This folder contains all the necessary files and instructions to set up the Capy Project on your local system.

## Prerequisites

Before setting up this project, ensure you have the following installed on your system:

### Required Software

1. **Node.js** (version 18.0.0 or higher)

   - Download from: https://nodejs.org/
   - This includes npm (Node Package Manager)

2. **Git** (for version control)
   - Download from: https://git-scm.com/

### System Requirements

- **Operating System**: Windows 10/11, macOS 10.15+, or Linux (Ubuntu 18.04+)
- **RAM**: Minimum 4GB, recommended 8GB+
- **Storage**: At least 500MB free space for dependencies
- **Network**: Internet connection for downloading dependencies

## Quick Setup

1. **Clone the repository** (if not already done):

   ```bash
   git clone <repository-url>
   cd capy_project
   ```

2. **Run the setup script**:

   **Windows:**

   ```bash
   .\requirements\setup.bat
   ```

   **macOS/Linux:**

   ```bash
   chmod +x requirements/setup.sh
   ./requirements/setup.sh
   ```

3. **Start the development servers**:
   ```bash
   npm run dev
   ```

## Manual Setup

If you prefer to set up manually, follow these steps:

### 1. Install Dependencies

```bash
# Install server dependencies
cd server
npm install
cd ..

# Install client dependencies
cd client
npm install
cd ..

# Generate atlas JSON (required for the game assets)
node buildAtlasJson.js
```

### 2. Start the Development Environment

Open two terminal windows:

**Terminal 1 - Start the backend server:**

```bash
cd server
npm start
```

**Terminal 2 - Start the frontend development server:**

```bash
cd client
npm run dev
```

The application will be available at:

- Frontend: http://localhost:5173
- Backend API: http://localhost:4000

## Project Structure

```
capy_project/
├── client/          # React frontend (Vite)
├── server/          # Express.js backend
├── assets/          # Game assets (images, JSON)
├── frames/          # Original animation frames
├── frames_resized/  # Resized animation frames (64x64)
├── buildAtlasJson.js # Script to build atlas configuration
└── requirements/    # Setup files and documentation
```

## Available Scripts

### Root Level

- `npm run dev` - Start both client and server in development mode
- `npm run build` - Build the client for production
- `npm run atlas` - Rebuild the game atlas JSON

### Client (frontend)

- `npm run dev` - Start development server (Vite)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Server (backend)

- `npm start` - Start the Express server
- No additional scripts currently configured

## Environment Configuration

The project uses the following default ports:

- **Client (Vite)**: 5173
- **Server (Express)**: 4000

To change the server port, set the `PORT` environment variable:

```bash
# Windows
set PORT=3000

# macOS/Linux
export PORT=3000
```

## Troubleshooting

### Common Issues

1. **Port already in use**:

   - Check if another application is using ports 5173 or 4000
   - Kill the process or change the port configuration

2. **Dependencies installation fails**:

   - Clear npm cache: `npm cache clean --force`
   - Delete `node_modules` folders and reinstall
   - Check internet connection

3. **Atlas JSON missing**:

   - Run `node buildAtlasJson.js` from the project root
   - Ensure `frames_resized/` directory exists with animation frames

4. **Module not found errors**:
   - Ensure you're in the correct directory
   - Run `npm install` in both client and server directories

### Getting Help

If you encounter issues not covered here:

1. Check the console for specific error messages
2. Ensure all prerequisites are installed correctly
3. Verify you're running commands from the correct directory
4. Try clearing browser cache and restarting development servers

## Development Notes

- The project uses modern JavaScript features (ES6+)
- React 19 is used for the frontend
- Socket.IO enables real-time communication between client and server
- Assets are served statically from the server
- Hot module replacement is enabled in development mode
