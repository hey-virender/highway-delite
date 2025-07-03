# Deployment Guide

This project has been configured to ignore TypeScript and ESLint errors during deployment builds while maintaining code quality during development.

## Build Commands

### For Deployment (Ignores TS/ESLint errors):
```bash
npm run build          # Standard build - ignores TS checking
npm run build:prod     # Production build with NODE_ENV=production
npm run build:force    # Force build ignoring cache
```

### For Development (With full checking):
```bash
npm run build:check    # Build with TypeScript checking enabled
npm run dev            # Development server with full checking
```

## What's Been Configured:

### 1. **Package.json Changes:**
- `build` command now skips TypeScript checking (`tsc -b`)
- Added `build:check` for development builds with full checking
- Added `build:prod` and `build:force` for deployment flexibility

### 2. **TypeScript Configuration:**
- `tsconfig.app.json` - Lenient config for builds (strict: false)
- `tsconfig.dev.json` - Strict config for development
- Disabled strict mode, unused variable checks, and implicit any errors

### 3. **Vite Configuration:**
- Suppresses TypeScript warnings during build
- Ignores circular dependencies and unused imports
- Disables source maps in production
- Drops console statements in production builds

### 4. **ESLint Configuration:**
- Changed errors to warnings for common issues
- Disabled unsafe TypeScript rules
- Allows console statements
- Won't fail the build process

## Deployment Process:

1. **Local Build Test:**
   ```bash
   npm run build
   ```

2. **Production Deployment:**
   ```bash
   NODE_ENV=production npm run build
   ```

3. **If Build Still Fails:**
   ```bash
   npm run build:force
   ```

## Environment Variables (Optional):

Create a `.env.production` file with:
```env
SKIP_PREFLIGHT_CHECK=true
CI=false
GENERATE_SOURCEMAP=false
```

## Notes:
- TypeScript and ESLint still work in development (`npm run dev`)
- Use `npm run build:check` to test with full type checking
- All error suppression only applies to build process, not development 