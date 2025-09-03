# Quick Start Guide

Get the Capy Project running in 5 minutes or less! 🦫

## 🚀 Super Quick Setup

### Option 1: Automated Setup (Recommended)

**Windows:**

```batch
cd capy_project
.\requirements\setup.bat
npm run dev
```

**macOS/Linux:**

```bash
cd capy_project
chmod +x requirements/setup.sh
./requirements/setup.sh
npm run dev
```

### Option 2: Manual Setup

```bash
# Install all dependencies
npm run setup

# Start development servers
npm run dev
```

## 🌐 Access Your App

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:4000

## 📋 Prerequisites

- Node.js 18+ ([Download here](https://nodejs.org/))
- npm (comes with Node.js)

## 🆘 Need Help?

- **Setup issues**: Check `requirements/TROUBLESHOOTING.md`
- **Configuration**: See `requirements/ENVIRONMENT.md`
- **Dependencies**: View `requirements/DEPENDENCIES.md`

## ⚡ Common Commands

```bash
# Development
npm run dev              # Start both client and server
npm run dev:client       # Start only frontend
npm run dev:server       # Start only backend

# Building
npm run build           # Build for production
npm run atlas           # Rebuild game assets

# Maintenance
npm run clean           # Clean node_modules
npm run install:all     # Reinstall all dependencies
npm run lint            # Check code quality
```

## 🎮 What You'll See

Once running, you'll have:

- A React frontend with a virtual capybara pet
- Real-time communication via Socket.IO
- Express backend serving game assets
- Hot reload for instant development feedback

## 🐛 Quick Troubleshooting

| Problem            | Quick Fix                              |
| ------------------ | -------------------------------------- |
| Port in use        | Change ports in config or kill process |
| Module not found   | `npm run clean && npm run install:all` |
| Assets not loading | `npm run atlas`                        |
| Old Node.js        | Update to Node.js 18+                  |

That's it! You're ready to start developing! 🎉
