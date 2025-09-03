# Troubleshooting Guide

This guide helps you resolve common issues when setting up and running the Capy Project.

## Installation Issues

### 1. Node.js Version Problems

**Error**: "Node.js version is too old" or module compatibility issues

**Solutions**:

- Install Node.js 18.0.0 or higher from [nodejs.org](https://nodejs.org/)
- If using nvm (Node Version Manager):
  ```bash
  nvm install 18.20.0
  nvm use 18.20.0
  ```
- Verify installation: `node --version`

### 2. npm Installation Failures

**Error**: Permission denied or EACCES errors

**Solutions**:

- **Windows**: Run Command Prompt as Administrator
- **macOS/Linux**: Use nvm instead of sudo, or configure npm properly:
  ```bash
  npm config set prefix ~/.npm-global
  export PATH=~/.npm-global/bin:$PATH
  ```

**Error**: Network timeouts or connection issues

**Solutions**:

- Clear npm cache: `npm cache clean --force`
- Try different registry: `npm config set registry https://registry.npmjs.org/`
- Check firewall/proxy settings

### 3. Module Not Found Errors

**Error**: "Cannot find module 'xyz'"

**Solutions**:

- Delete `node_modules` and `package-lock.json`, then reinstall:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```
- Ensure you're in the correct directory (client/ or server/)
- Check if the module is listed in package.json

## Runtime Issues

### 4. Port Already in Use

**Error**: "EADDRINUSE: address already in use :::4000" or ":::5173"

**Solutions**:

- **Find and kill the process**:

  ```bash
  # Windows
  netstat -ano | findstr :4000
  taskkill /PID <PID> /F

  # macOS/Linux
  lsof -i :4000
  kill -9 <PID>
  ```

- **Change the port**:

  ```bash
  # For server (Windows)
  set PORT=3001 && npm start

  # For server (macOS/Linux)
  PORT=3001 npm start

  # For client - edit vite.config.js and add:
  server: { port: 3000 }
  ```

### 5. CORS Errors

**Error**: "Access to fetch at 'localhost:4000' from origin 'localhost:5173' has been blocked by CORS policy"

**Solutions**:

- Ensure the server is running (`cd server && npm start`)
- Check that CORS is properly configured in `server/index.js`
- Verify the client is connecting to the correct server URL

### 6. WebSocket Connection Failures

**Error**: Socket.IO connection errors or timeouts

**Solutions**:

- Ensure both client and server are running
- Check network connectivity
- Verify server URL in client code
- Check browser console for specific error messages

### 7. Atlas JSON Missing

**Error**: Game assets not loading or animation errors

**Solutions**:

- Run the atlas generation script: `node buildAtlasJson.js`
- Ensure `frames_resized/` directory exists with animation frames
- Check that `assets/capy_atlas.json` was created
- Verify file permissions

## Development Issues

### 8. Hot Reload Not Working

**Problem**: Changes not reflecting in the browser

**Solutions**:

- Ensure you're editing files in the correct directory
- Check if Vite dev server is running (`npm run dev` in client/)
- Clear browser cache (Ctrl+F5 or Cmd+Shift+R)
- Restart the development server

### 9. ESLint Errors

**Error**: Linting errors preventing build

**Solutions**:

- Fix the specific errors shown
- Temporarily disable ESLint: `npm run dev -- --no-lint`
- Update ESLint configuration in `client/eslint.config.js`

### 10. Build Failures

**Error**: Production build fails

**Solutions**:

- Check for console errors in development mode first
- Ensure all imports use correct paths (case-sensitive)
- Fix any TypeScript errors if using TypeScript
- Clear cache and rebuild: `npm run clean && npm install && npm run build`

## Performance Issues

### 11. Slow Development Server

**Problem**: Vite dev server is slow to start or reload

**Solutions**:

- Close unnecessary applications to free up memory
- Exclude `node_modules` from antivirus scanning
- Use SSD storage for better I/O performance
- Increase Node.js memory limit: `node --max-old-space-size=4096`

### 12. Memory Issues

**Error**: "JavaScript heap out of memory"

**Solutions**:

- Increase Node.js memory limit:
  ```bash
  export NODE_OPTIONS="--max-old-space-size=4096"
  ```
- Close unused applications
- Restart the development servers

## Environment-Specific Issues

### Windows-Specific Issues

1. **PowerShell Execution Policy**:

   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

2. **Path separator issues**: Use forward slashes in import paths

3. **Long path names**: Enable long path support in Windows 10/11

### macOS-Specific Issues

1. **Xcode Command Line Tools**: Install if compilation fails:

   ```bash
   xcode-select --install
   ```

2. **Permission issues**: Don't use sudo with npm, use nvm instead

### Linux-Specific Issues

1. **Missing build tools**: Install build essentials:

   ```bash
   # Ubuntu/Debian
   sudo apt-get install build-essential

   # CentOS/RHEL
   sudo yum groupinstall "Development Tools"
   ```

## Getting Additional Help

If you're still experiencing issues:

1. **Check the logs**: Look for specific error messages in the console
2. **Verify environment**: Ensure all prerequisites are correctly installed
3. **Clean installation**: Try setting up the project in a fresh directory
4. **Update dependencies**: Check if newer versions are available
5. **Community help**: Search for similar issues on GitHub, Stack Overflow

## Debugging Tips

1. **Enable verbose logging**: Add `DEBUG=*` environment variable
2. **Check network tab**: Use browser dev tools to inspect requests
3. **Use console.log**: Add debug statements to track code execution
4. **Check file permissions**: Ensure files are readable/writable
5. **Test in incognito mode**: Rule out browser extension interference
