# Environment Configuration Guide

This project supports two environment configurations:

## 🟢 Local Development (localhost:5007)
Uses: `.env.development`

## 🔵 Production (api.portgig.com)
Uses: `.env.production`

---

## How to Switch Between Environments

### Method 1: Using NPM Scripts (Easiest) ⭐

Switch to **local** environment:
```bash
npm run env:local
npm run dev
```

Switch to **production** environment:
```bash
npm run env:prod
npm run dev
```

Or use the combined command to run production API in dev mode:
```bash
npm run dev:prod
```

### Method 2: Automatic
Next.js automatically loads the correct environment file based on the command:

- **Local Development**: `npm run dev` → loads `.env.development`
- **Production Build**: `npm run build` → loads `.env.production`

### Method 3: Manual Override
To test production API while in development mode:

1. Copy `.env.production` to `.env.local`:
   ```bash
   cp .env.production .env.local
   ```

2. Run dev server:
   ```bash
   npm run dev
   ```

3. When done, delete `.env.local` to go back to development mode:
   ```bash
   rm .env.local
   ```

> **Note**: `.env.local` takes precedence over all other env files and is gitignored.

---

## Environment Files Priority (Highest to Lowest)

1. `.env.local` (always overrides, gitignored)
2. `.env.development` or `.env.production` (based on NODE_ENV)
3. `.env` (fallback)

---

## Quick Reference

### Using NPM Scripts (Recommended)

**Local API (localhost:5007):**
```bash
npm run env:local
npm run dev
```

**Production API (api.portgig.com):**
```bash
npm run env:prod
npm run dev
# or combined:
npm run dev:prod
```

### Traditional Method

**Local API (localhost:5007):**
```bash
npm run dev
# Automatically uses .env.development
```

**Production API (api.portgig.com):**
```bash
# Option 1: Build for production
npm run build && npm start

# Option 2: Test in dev mode
cp .env.production .env.local
npm run dev
# Remember to delete .env.local when done
```

---

## Environment Variables

| Variable | Local | Production |
|----------|-------|------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:5007/api/v1` | `https://api.portgig.com/api/v1` |
| `NEXT_PUBLIC_BASE_URL` | `http://localhost:3000` | `https://portgig.com` |
| `NEXT_PUBLIC_GOOGLE_CALLBACK_URL` | `http://localhost:3000/auth/google/callback` | `https://portgig.com/auth/google/callback` |
| `NEXT_PUBLIC_LOGO_URL` | `http://localhost:5007/uploads/...` | `https://portgig.com/uploads/...` |

---

## Important Notes

⚠️ Always restart the dev server after changing environment files:
```bash
Ctrl+C  # Stop the server
npm run dev  # Start again
```

⚠️ The `.env.local` file is gitignored for security. Never commit it to version control.

⚠️ After switching environments, make sure your backend server matches:
- Local: Backend must be running on `localhost:5007`
- Production: Using `api.portgig.com`
