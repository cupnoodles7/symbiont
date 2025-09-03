# Environment Configuration

This document describes how to configure the development and production environments for the Capy Project.

## Environment Variables

### Server Configuration

The server can be configured using the following environment variables:

| Variable   | Default       | Description                               |
| ---------- | ------------- | ----------------------------------------- |
| `PORT`     | `4000`        | Port number for the Express server        |
| `NODE_ENV` | `development` | Environment mode (development/production) |

**Example usage:**

```bash
# Windows
set PORT=3001
set NODE_ENV=production

# macOS/Linux
export PORT=3001
export NODE_ENV=production
```

### Client Configuration

The client (Vite) can be configured through:

- `vite.config.js` file
- Environment variables prefixed with `VITE_`

**Example `vite.config.js` configuration:**

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true, // Allow external connections
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
```

## Development Environment

### Prerequisites Checklist

- [ ] Node.js 18.0.0+ installed
- [ ] npm 8.0.0+ installed
- [ ] Git installed (optional but recommended)
- [ ] Code editor (VS Code recommended)

### Quick Setup Commands

```bash
# Clone and setup
git clone <repository-url>
cd capy_project

# Automated setup
npm run setup

# Manual setup
npm run install:all
npm run atlas
```

### Development Workflow

1. **Start development servers:**

   ```bash
   npm run dev
   ```

2. **Access the application:**

   - Frontend: http://localhost:5173
   - Backend: http://localhost:4000

3. **Available development commands:**
   ```bash
   npm run dev:client     # Start only frontend
   npm run dev:server     # Start only backend
   npm run lint          # Run ESLint
   npm run build         # Build for production
   ```

## Production Environment

### Server Deployment

1. **Install dependencies:**

   ```bash
   npm run install:server
   ```

2. **Build client assets:**

   ```bash
   npm run build
   ```

3. **Configure environment:**

   ```bash
   export NODE_ENV=production
   export PORT=80
   ```

4. **Start the server:**
   ```bash
   cd server
   npm start
   ```

### Static Asset Serving

The server serves static assets from the `assets/` directory at the `/assets` route.

**Production considerations:**

- Use a CDN for asset delivery
- Enable gzip compression
- Set appropriate cache headers
- Consider using a reverse proxy (nginx, Apache)

### Environment-Specific Configurations

#### Development

- Hot module replacement enabled
- Detailed error messages
- Source maps included
- CORS enabled for localhost

#### Production

- Minified assets
- Error logging to files
- Security headers enabled
- Performance optimizations

## Docker Configuration (Optional)

### Dockerfile Example

```dockerfile
# Multi-stage build for production
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Install dependencies
RUN npm run install:all

# Copy source code
COPY . .

# Build client
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app
COPY --from=builder /app/server ./server
COPY --from=builder /app/assets ./assets
COPY --from=builder /app/client/dist ./client/dist

WORKDIR /app/server
EXPOSE 4000

CMD ["npm", "start"]
```

### Docker Compose Example

```yaml
version: "3.8"

services:
  capy-project:
    build: .
    ports:
      - "4000:4000"
    environment:
      - NODE_ENV=production
      - PORT=4000
    volumes:
      - ./assets:/app/assets:ro
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - capy-project
    restart: unless-stopped
```

## IDE Configuration

### VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  }
}
```

### Recommended VS Code Extensions

- ES7+ React/Redux/React-Native snippets
- ESLint
- Prettier - Code formatter
- Auto Rename Tag
- Bracket Pair Colorizer
- GitLens
- Thunder Client (for API testing)

## Security Considerations

### Development

- Keep dependencies updated
- Use HTTPS in production
- Validate all user inputs
- Implement proper error handling

### Production

- Use environment variables for secrets
- Enable security headers
- Implement rate limiting
- Regular security audits: `npm audit`

## Performance Optimization

### Development

- Use React DevTools for component profiling
- Monitor bundle size with Vite's build analyzer
- Optimize images and assets

### Production

- Enable gzip compression
- Use a CDN for static assets
- Implement caching strategies
- Monitor application performance

## Monitoring and Logging

### Development

- Console logging for debugging
- React DevTools for component inspection
- Network tab for API monitoring

### Production

- Structured logging with log levels
- Error tracking (Sentry, etc.)
- Performance monitoring
- Health check endpoints
