# @faf/enterprise Releases Feed

**Automated release data for integrations and dashboards**

## What is this?

`releases.json` contains structured release data for @faf/enterprise that can be consumed by:

- Internal dashboards
- Integration tools
- Developer tools

## JSON Structure

```json
[
  {
    "version": "v1.0.0",
    "name": "Enterprise Edition Launch",
    "date": "2026-02-19",
    "timestamp": "2026-02-19T00:00:00.000Z",
    "prerelease": false,
    "changelog": "- 33-slot monorepo scoring",
    "urls": {
      "github": "https://github.com/Wolfe-Jam/faf-enterprise/releases/tag/v1.0.0",
      "npm": "https://www.npmjs.com/package/@faf/enterprise/v/1.0.0"
    },
    "install": {
      "npm": "npm install @faf/enterprise@1.0.0"
    }
  }
]
```

**Newest releases first** - Array is prepended on each release.

## How to Use

### Direct URL (GitHub Raw)
```
https://raw.githubusercontent.com/Wolfe-Jam/faf-enterprise/main/website/releases.json
```

### JavaScript Fetch
```javascript
fetch('https://raw.githubusercontent.com/Wolfe-Jam/faf-enterprise/main/website/releases.json')
  .then(res => res.json())
  .then(releases => {
    const latest = releases[0];
    console.log(`Latest: ${latest.version} - ${latest.name}`);
  });
```

## Automation

This file is updated automatically by:
`.github/workflows/release.yml`

**Workflow:**
1. GitHub Release published
2. releases.json prepended with new release
3. Committed and pushed by `github-actions[bot]`

## Git History

Each release creates a git commit with an audit trail.

---

**Championship-grade release distribution.**
