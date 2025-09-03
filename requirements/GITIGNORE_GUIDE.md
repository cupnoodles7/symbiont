# Git Ignore Guide for Capy Project

This guide explains what files should and shouldn't be tracked in the Capy Project repository.

## ✅ Files That SHOULD Be Tracked

### Source Code

- `client/src/` - All React source files
- `server/index.js` - Server source code
- `buildAtlasJson.js` - Asset processing script

### Configuration Files

- `package.json` files (root, client, server)
- `vite.config.js` - Vite configuration
- `eslint.config.js` - ESLint configuration
- `.nvmrc` - Node.js version specification

### Game Assets (Source)

- `frames/` - Original animation frames (source material)
- `assets/capy_ref_512.jpeg` - Reference images
- `assets/capy_side_ref_512.jpeg` - Reference images

### Documentation

- `README.md` - Main project documentation
- `requirements/` folder - All setup and configuration docs

### Generated Assets (Decision Required)

- `assets/capy_atlas.png` - Generated sprite sheet ⚠️
- `assets/capy_atlas.webp` - Generated sprite sheet ⚠️
- `assets/capy_atlas.json` - Generated atlas mapping ⚠️
- `frames_resized/` - Processed frames ⚠️

## ❌ Files That SHOULD NOT Be Tracked

### Dependencies

- `node_modules/` - All dependency folders
- `package-lock.json` - Lock files (controversial, see note below)

### Build Artifacts

- `client/dist/` - Production build output
- Any compiled or bundled files

### Development Files

- `.env` files - Environment variables (may contain secrets)
- Log files (`*.log`)
- Coverage reports
- Cache files (`.eslintcache`, `.npm`, etc.)

### IDE/Editor Files

- `.vscode/` (except specific config files)
- `.idea/` - JetBrains IDE files
- `*.swp`, `*.swo` - Vim temporary files

### OS Files

- `.DS_Store` - macOS system files
- `Thumbs.db` - Windows system files
- `desktop.ini` - Windows system files

## 🤔 Special Considerations

### Generated Game Assets

**Current Status**: ⚠️ Commented out in .gitignore (will be tracked)

**Arguments for tracking:**

- Ensures consistency across environments
- Users can run the game without processing frames
- Atlas files are essential for the game to work

**Arguments against tracking:**

- Can be regenerated from source frames
- Larger repository size
- Potential for merge conflicts

**Recommendation**: Keep tracking them since they're essential for the game to run and the frames are relatively small.

### Package Lock Files

**Current Status**: ❌ Ignored

**Reasoning:**

- This project uses multiple package.json files (root, client, server)
- Lock files can cause conflicts in multi-package setups
- Dependencies are specified with version ranges in package.json

**Alternative Approach**: If you want reproducible builds, you could:

- Track only root `package-lock.json`
- Use `npm ci` in production
- Document specific versions in requirements

### Frames Directories

**Current Status**:

- `frames/` - ✅ Tracked (source material)
- `frames_resized/` - ⚠️ Commented out (currently tracked)

**Recommendation**:

- Keep tracking `frames/` as source material
- Consider ignoring `frames_resized/` since it can be regenerated

## 📋 Current .gitignore Analysis

The root `.gitignore` file includes:

✅ **Comprehensive coverage of:**

- Node.js dependencies and caches
- Build artifacts and temporary files
- IDE and editor files
- OS-specific files
- Environment variables
- Log files and coverage reports

⚠️ **Decisions needed for:**

- Generated game assets (currently tracked)
- Processed frames (currently tracked)
- Package lock files (currently ignored)

## 🔧 Recommended Actions

### 1. Decision on Generated Assets

Choose one approach:

**Option A: Track generated assets (current)**

```bash
# Keep current setup - generated assets are tracked
# Pro: Game works immediately after clone
# Con: Larger repo, potential conflicts
```

**Option B: Ignore generated assets**

```bash
# Uncomment these lines in .gitignore:
assets/capy_atlas.json
assets/capy_atlas.png
assets/capy_atlas.webp
frames_resized/

# Pro: Smaller repo, no generated file conflicts
# Con: Requires running npm run atlas after clone
```

### 2. Update Setup Instructions

If you choose Option B, update setup scripts to always run:

```bash
npm run atlas
```

### 3. Consider Package Lock Strategy

For more reproducible builds, you might want to:

- Track root `package-lock.json` only
- Update setup scripts to handle this properly

## 🎯 Best Practices

1. **Keep source files**: Always track original, hand-created content
2. **Ignore generated files**: Unless they're critical for immediate functionality
3. **Document decisions**: Make it clear what's tracked and why
4. **Test clean clones**: Regularly test that fresh clones work properly
5. **Review regularly**: Update .gitignore as the project evolves

## 🚨 Files to Never Track

- API keys or secrets
- Personal configuration files
- Large binary files (unless essential)
- Temporary or cache files
- OS-specific configuration
- IDE workspace files
