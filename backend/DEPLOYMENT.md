# Backend Deployment Guide

This backend has been configured to ignore TypeScript and ESLint errors during deployment builds while maintaining code quality during development.

## Build Commands

### For Deployment (Ignores TS/ESLint errors):
```bash
npm run build          # Standard build - ignores TS errors
npm run build:prod     # Production build with NODE_ENV=production
npm run build:force    # Force build with skipLibCheck
```

### For Development (With full checking):
```bash
npm run build:check    # Build with full TypeScript checking
npm run dev            # Development server with nodemon
npm run start:ts       # Start with ts-node (development)
```

### For Production Server:
```bash
npm run start          # Start compiled JavaScript from dist/
```

## What's Been Configured:

### 1. **Package.json Changes:**
- `build` command now uses `--noEmitOnError false` to continue building despite TS errors
- `start` command now runs compiled JavaScript from `dist/server.js`
- Added `build:check` for development builds with full checking
- Added `build:prod` and `build:force` for deployment flexibility

### 2. **TypeScript Configuration:**
- `tsconfig.json` - Lenient config for builds (strict: false)
- `tsconfig.dev.json` - Strict config for development
- Output directory set to `./dist`
- Disabled strict mode, unused variable checks, and implicit any errors

### 3. **ESLint Configuration:**
- `eslint.config.js` - Lenient rules that won't fail builds
- Changed errors to warnings for common issues
- Allows console statements and common Node.js patterns
- Disabled unsafe TypeScript rules

### 4. **Updated .gitignore:**
- Added `dist/` directory to ignore compiled output
- Added build artifacts and IDE files

## Deployment Process:

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Start production server:**
   ```bash
   npm run start
   ```

3. **Alternative deployment commands:**
   ```bash
   # If standard build fails
   npm run build:force
   
   # For production environment
   NODE_ENV=production npm run build:prod
   ```

## File Structure After Build:
```
backend/
├── src files (.ts)
├── dist/           # Compiled JavaScript output
│   ├── server.js
│   ├── controllers/
│   ├── routes/
│   └── ...
└── ...
```

## Environment Variables:

Create a `.env` file with your environment variables:
```env
NODE_ENV=production
PORT=5000
# Add your other environment variables
```

## Notes:
- TypeScript and ESLint still work in development (`npm run dev`)
- Use `npm run build:check` to test with full type checking
- All error suppression only applies to build process, not development
- Production server runs compiled JavaScript from `dist/` directory 