#!/bin/bash

# Capy Project Setup Script for macOS/Linux
# This script will install all dependencies and set up the project

echo "🦫 Setting up Capy Project..."
echo "================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js 18.0.0 or higher from https://nodejs.org/"
    echo "Or use nvm: nvm install 18.20.0 && nvm use 18.20.0"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2)
REQUIRED_VERSION="18.0.0"

if ! node -e "process.exit(require('semver').gte('$NODE_VERSION', '$REQUIRED_VERSION') ? 0 : 1)" 2>/dev/null; then
    echo "❌ Node.js version $NODE_VERSION is too old!"
    echo "Please upgrade to Node.js 18.0.0 or higher"
    exit 1
fi

echo "✅ Node.js version: v$NODE_VERSION"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed!"
    echo "Please install npm (usually comes with Node.js)"
    exit 1
fi

echo "✅ npm version: $(npm -v)"

# Navigate to project root (assuming script is run from requirements/ folder)
cd "$(dirname "$0")/.."

echo ""
echo "📦 Installing dependencies..."
echo "================================"

# Install root dependencies (for concurrently)
echo "Installing root dependencies..."
npm install

# Install server dependencies
echo "Installing server dependencies..."
cd server
if ! npm install; then
    echo "❌ Failed to install server dependencies"
    exit 1
fi
cd ..

# Install client dependencies
echo "Installing client dependencies..."
cd client
if ! npm install; then
    echo "❌ Failed to install client dependencies"
    exit 1
fi
cd ..

echo ""
echo "🎮 Building game assets..."
echo "================================"

# Build atlas JSON
if ! node buildAtlasJson.js; then
    echo "❌ Failed to build atlas JSON"
    exit 1
fi

echo ""
echo "🎉 Setup completed successfully!"
echo "================================"
echo ""
echo "To start the development servers:"
echo "  npm run dev"
echo ""
echo "Or start them separately:"
echo "  Terminal 1: cd server && npm start"
echo "  Terminal 2: cd client && npm run dev"
echo ""
echo "Frontend will be available at: http://localhost:5173"
echo "Backend will be available at: http://localhost:4000"
echo ""
echo "Happy coding! 🦫"
