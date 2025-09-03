@echo off
REM Capy Project Setup Script for Windows
REM This script will install all dependencies and set up the project

echo 🦫 Setting up Capy Project...
echo ================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed!
    echo Please install Node.js 18.0.0 or higher from https://nodejs.org/
    pause
    exit /b 1
)

REM Check Node.js version (simplified check)
for /f "tokens=1 delims=." %%a in ('node -p "process.version.slice(1)"') do set NODE_MAJOR=%%a
if %NODE_MAJOR% LSS 18 (
    echo ❌ Node.js version is too old!
    echo Please upgrade to Node.js 18.0.0 or higher
    pause
    exit /b 1
)

echo ✅ Node.js version check passed

REM Check if npm is installed
npm --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm is not installed!
    echo Please install npm (usually comes with Node.js)
    pause
    exit /b 1
)

echo ✅ npm is available

REM Navigate to project root (assuming script is run from requirements/ folder)
cd /d "%~dp0\.."

echo.
echo 📦 Installing dependencies...
echo ================================

REM Install root dependencies (for concurrently)
echo Installing root dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install root dependencies
    pause
    exit /b 1
)

REM Install server dependencies
echo Installing server dependencies...
cd server
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install server dependencies
    pause
    exit /b 1
)
cd ..

REM Install client dependencies
echo Installing client dependencies...
cd client
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install client dependencies
    pause
    exit /b 1
)
cd ..

echo.
echo 🎮 Building game assets...
echo ================================

REM Build atlas JSON
call node buildAtlasJson.js
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to build atlas JSON
    pause
    exit /b 1
)

echo.
echo 🎉 Setup completed successfully!
echo ================================
echo.
echo To start the development servers:
echo   npm run dev
echo.
echo Or start them separately:
echo   Terminal 1: cd server ^&^& npm start
echo   Terminal 2: cd client ^&^& npm run dev
echo.
echo Frontend will be available at: http://localhost:5173
echo Backend will be available at: http://localhost:4000
echo.
echo Happy coding! 🦫
pause
