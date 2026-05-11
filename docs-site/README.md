# 📚 FAF Enterprise Documentation Site

## Current Status: 🚧 Generated, Not Deployed

This directory contains **auto-generated documentation** from the FAF Enterprise source code. The documentation generation works perfectly, but deployment to docs.faf.one is not yet configured.

## What Works ✅

- **Documentation Generation** - Command reference automatically generated from `src/commands/index.ts`
- **Content Structure** - Pages, components, and theme config are in place
- **CI/CD Integration** - `scripts/generate-docs.ts` runs on every push

## What's Generated

```
docs-site/
├── pages/
│   ├── index.mdx          # Main landing page
│   ├── commands/
│   │   ├── index.mdx      # Commands overview
│   │   └── *.mdx          # Individual command pages (19 total)
│   └── concepts/
│       ├── index.mdx      # Concepts overview
│       └── *.mdx          # Individual concept pages (9 total)
├── components/            # React components (if needed)
├── public/
│   ├── screenshots/       # Documentation screenshots
│   └── examples/          # Code examples
└── theme.config.tsx       # Nextra theme configuration
```

## What's Needed for Deployment 🚧

### 1. Nextra Configuration

Create `package.json`:

```json
{
  "name": "faf-enterprise-docs",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "^14.0.0",
    "nextra": "^2.13.0",
    "nextra-theme-docs": "^2.13.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}
```

Create `next.config.js`:

```javascript
const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx'
});

module.exports = withNextra();
```

### 2. Vercel Configuration

1. Create project at [vercel.com](https://vercel.com)
2. Connect to GitHub repository
3. Set root directory to `docs-site/`
4. Add GitHub secrets to repository:
   - `VERCEL_TOKEN` - From vercel.com/account/tokens
   - `VERCEL_ORG_ID` - From project settings
   - `VERCEL_PROJECT_ID` - From project settings

### 3. Enable Deployment Workflow

Uncomment the deployment steps in `.github/workflows/docs-deploy.yml`:
- Setup docs site
- Build documentation site
- Deploy to Vercel
- Performance validation (Lighthouse)
- Security validation

## Local Development (Once Configured)

```bash
cd docs-site
npm install
npm run dev       # Start dev server at localhost:3000
npm run build     # Build for production
```

## Regenerate Documentation

From repository root:

```bash
npm run docs:generate
```

This runs `scripts/generate-docs.ts` which:
1. Reads `FAF_INDEX` from `src/commands/index.ts`
2. Generates MDX pages for each command and concept
3. Creates index pages and navigation
4. Outputs to `docs-site/pages/`

## Documentation Quality

**Generated Pages:** 31 total
- Commands: 19 pages
- Concepts: 9 pages
- Index pages: 3 pages

**Auto-updated on:**
- Changes to `src/commands/**`
- Changes to `src/utils/championship-style.ts`
- Changes to `scripts/generate-docs.ts`

---

## For Future Developer

The documentation system is **valuable and working**. All that's missing is the Nextra/Vercel deployment infrastructure. The content generation is solid - just needs the frontend framework configured.

**Why this matters:**
- Developers need command reference
- Customers need feature documentation
- Enterprise buyers expect professional docs
- Auto-generation keeps docs in sync with code

**Priority:** Medium (documentation works, just not deployed yet)

---

*Last updated: 2026-02-16*
*Status: Generation ✅ | Deployment 🚧*
