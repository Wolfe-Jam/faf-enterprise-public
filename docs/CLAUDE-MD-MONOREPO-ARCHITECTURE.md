# 🏗️ CLAUDE.md Monorepo Architecture

**Date:** 2026-02-16
**Question:** Does Claude need one CLAUDE.md in a monorepo, or multiple? Do we need a conductor pattern?

---

## The Problem

In a monorepo with 87 packages, how should CLAUDE.md work?

```
shopfront/                    # Turborepo monorepo
├── CLAUDE.md                 # ← Describes everything? Gets massive?
├── project.faf               # Root .faf (33 slots)
├── apps/
│   ├── web/
│   │   ├── CLAUDE.md?        # ← Per-workspace context?
│   │   └── project.faf?      # ← Per-workspace .faf?
│   ├── admin/
│   │   ├── CLAUDE.md?
│   │   └── project.faf?
│   └── api/
│       ├── CLAUDE.md?
│       └── project.faf?
└── packages/
    └── ui/
        ├── CLAUDE.md?
        └── project.faf?
```

**Key Questions:**
1. Does Claude Code read CLAUDE.md from subdirectories?
2. Should bi-sync support multiple .faf → multiple CLAUDE.md?
3. Is a conductor pattern needed (like Gemini's `agents_manifest`)?

---

## Current State Analysis

### Claude Code Behavior

**Reality:**
- Claude Code looks for `CLAUDE.md` in project root
- Reads it for persistent context across sessions
- No known support for subdirectory CLAUDE.md files

**Bi-sync Current Behavior:**
- 1:1 mapping: `project.faf ↔ CLAUDE.md`
- Syncs in 18ms (8ms average)
- Generates CLAUDE.md from .faf content

### Gemini CLI Approach (For Comparison)

**What Gemini does:**
```
.gemini/
├── context.yaml         # Points to project.faf
└── project.faf -> ../project.faf  # Symlink
```

**NOT a conductor pattern** - just a config file pointing to the source of truth.

---

## The Four Options

### Option A: Single Root CLAUDE.md (Monolithic)

```
shopfront/
├── CLAUDE.md              # ONE file, describes everything
└── project.faf            # ONE .faf
```

**Pros:**
- ✅ Simple - works with current Claude Code
- ✅ Matches current bi-sync (1:1 mapping)
- ✅ No tooling changes needed

**Cons:**
- ❌ Gets massive (87 packages = 1000+ lines?)
- ❌ Hard to maintain
- ❌ Loses workspace granularity

**Example:**
```markdown
# CLAUDE.md

## Monorepo: shopfront

### Workspace: apps/web
Next.js storefront...

### Workspace: apps/admin
React admin panel...

[...85 more workspaces...]
```

---

### Option B: Multiple CLAUDE.md (One per Workspace)

```
shopfront/
├── CLAUDE.md              # Root overview
├── apps/
│   ├── web/
│   │   ├── CLAUDE.md      # Web-specific
│   │   └── project.faf    # Web-specific
│   └── api/
│       ├── CLAUDE.md      # API-specific
│       └── project.faf    # API-specific
```

**Pros:**
- ✅ Granular context per workspace
- ✅ Each workspace is self-contained
- ✅ Scales to 87+ packages

**Cons:**
- ❌ **Claude Code doesn't read subdirectory CLAUDE.md** (likely)
- ❌ Maintenance burden (88 files)
- ❌ Bi-sync needs major refactor
- ❌ Which CLAUDE.md does Claude read when working in `apps/web/`?

**Blocker:** Likely doesn't work with Claude Code's current implementation.

---

### Option C: Conductor Pattern (Like Nx/Turborepo)

```
shopfront/
├── CLAUDE.md              # Conductor/orchestrator
├── .claude/
│   ├── manifest.yaml      # List of workspace contexts
│   ├── web.md             # Web context
│   ├── api.md             # API context
│   └── ui.md              # UI context
└── project.faf            # Root .faf with workspaces
```

**CLAUDE.md (Conductor):**
```markdown
# CLAUDE.md - Monorepo Conductor

## Workspaces

This monorepo contains 6 workspaces:

- **apps/web** - See `.claude/web.md`
- **apps/api** - See `.claude/api.md`
- **packages/ui** - See `.claude/ui.md`

[workspace details loaded on demand]
```

**Pros:**
- ✅ Scalable (87 packages)
- ✅ Organized (dedicated .claude/ directory)
- ✅ On-demand loading (Claude can read specific workspace context)

**Cons:**
- ❌ Requires Claude Code enhancement (read from .claude/ directory)
- ❌ Complex tooling (conductor logic)
- ❌ Not needed for most monorepos (<10 packages)

**Verdict:** Good for v2.0, over-engineering for v1.0.

---

### Option D: Single CLAUDE.md with Workspace Sections ✅ **RECOMMENDED**

```
shopfront/
├── CLAUDE.md              # Single file, structured sections
└── project.faf            # Root .faf with workspaces array
```

**project.faf:**
```yaml
workspaces:
  - path: apps/web
    type: nextjs
    description: "Customer storefront"
    main_deps: [react, next, tailwindcss]

  - path: apps/api
    type: fastify
    description: "GraphQL + REST API"
    main_deps: [fastify, prisma]

  - path: packages/ui
    type: library
    description: "Shared UI components"
    main_deps: [react, shadcn-ui]
```

**Generated CLAUDE.md:**
```markdown
# CLAUDE.md - shopfront Monorepo

## Monorepo Overview
- Tool: Turborepo
- Packages: 6
- Type: Full-stack SaaS

---

## Workspaces

### apps/web (Next.js)
**Customer storefront**

- **Type:** nextjs
- **Path:** apps/web/
- **Main Dependencies:** react, next, tailwindcss
- **Description:** Customer-facing storefront with product catalog and checkout

### apps/api (Fastify)
**GraphQL + REST API**

- **Type:** fastify
- **Path:** apps/api/
- **Main Dependencies:** fastify, prisma
- **Description:** Backend API serving both GraphQL and REST endpoints

### packages/ui (Library)
**Shared UI components**

- **Type:** library
- **Path:** packages/ui/
- **Main Dependencies:** react, shadcn-ui
- **Description:** Reusable React components used across apps

---

## Monorepo Infrastructure
- Build orchestrator: turbo.json
- Package manager: pnpm
- Versioning: changesets
- Remote cache: Vercel
```

**Pros:**
- ✅ **Works with current Claude Code** (single root CLAUDE.md)
- ✅ **Structured workspace sections** (easy to navigate)
- ✅ **Generated from project.faf** (bi-sync compatible)
- ✅ **Scales to 87 packages** (with good structure)
- ✅ **No tooling changes needed** (v1.0 ready)

**Cons:**
- ⚠️ File can get large (but structured, not monolithic)
- ⚠️ Not as granular as Option B/C (but good enough)

---

## Decision: Option D ✅

**For FAF Enterprise v1.0, we adopt Option D:**

### Implementation Plan

**1. Enhance Bi-Sync (Mk3.31)**

When `project.faf` contains a `workspaces:` array, bi-sync generates workspace sections in CLAUDE.md:

```typescript
// In bi-sync logic
if (projectFaf.workspaces && projectFaf.workspaces.length > 0) {
  // Generate workspace sections
  const workspaceSections = projectFaf.workspaces.map(ws => `
### ${ws.path} (${ws.type})
**${ws.description}**

- **Type:** ${ws.type}
- **Path:** ${ws.path}
- **Main Dependencies:** ${ws.main_deps.join(', ')}
  `).join('\n\n');

  claudeMd += `\n## Workspaces\n\n${workspaceSections}`;
}
```

**2. Project.faf Enhancement (Mk3.31)**

Already designed in `MONOREPO-PACKAGE-JSON-ARCHITECTURE.md`:

```yaml
# project.faf
workspaces:
  - path: apps/web
    package_json: apps/web/package.json
    type: nextjs                          # TSA detected
    main_deps: [react, next, tailwindcss] # TSA found
    description: "Customer storefront"
```

**3. Size Management**

For large monorepos (50+ packages), use collapsible sections:

```markdown
## Workspaces (87 total)

### Core Applications (3)
- apps/web - Next.js storefront
- apps/admin - React admin panel
- apps/api - Fastify API

### Libraries (12)
[Show/hide 12 libraries]

### Infrastructure (72)
[Show/hide 72 infrastructure packages]
```

---

## Why NOT a Conductor Pattern (Yet)

**Reasons to skip conductor for v1.0:**

1. **Claude Code doesn't support it** (would need enhancement)
2. **Most monorepos have <10 packages** (87 is edge case)
3. **Option D scales well enough** (structured sections)
4. **Adds complexity without clear ROI** for v1.0

**When conductor WOULD make sense:**

- **Future Feature (Mk3.4+):** "Claude Code Workspace Mode"
- **Use Case:** Claude is working on a specific workspace (e.g., `apps/web`)
- **Behavior:** Loads `.claude/web.md` automatically when in `apps/web/` directory
- **Requires:** Claude Code enhancement to support subdirectory context

---

## Comparison: FAF vs Gemini

| Aspect | Gemini Integration | Claude Integration (FAF) |
|--------|-------------------|-------------------------|
| **Config** | `.gemini/context.yaml` | `CLAUDE.md` (bi-sync from .faf) |
| **Source** | Points to `project.faf` | Generated from `project.faf` |
| **Monorepo** | Single context | Single CLAUDE.md with workspace sections |
| **Conductor** | No | No (v1.0), Maybe (v2.0) |
| **Approach** | Reference model | Generated model |

**Key Insight:** Gemini just *references* the .faf file. Claude *generates* CLAUDE.md from .faf.

---

## Example: 87-Package Monorepo

**shopfront/project.faf (root):**
```yaml
project:
  name: shopfront
  type: turborepo

stack:
  monorepo_tool: turborepo
  package_manager: pnpm
  workspaces: [apps/*, packages/*]

monorepo:
  packages_count: 87
  build_orchestrator: turbo.json
  versioning_strategy: changesets
  remote_cache: vercel

# Mk3.31: Workspace metadata (auto-detected by TSA)
workspaces:
  - path: apps/web
    type: nextjs
    main_deps: [react, next]
    description: "Customer storefront"

  # ... 86 more workspaces ...
```

**Generated CLAUDE.md (structured):**
```markdown
# CLAUDE.md - shopfront Monorepo

## Overview
- **Type:** Turborepo monorepo
- **Packages:** 87
- **Tool:** Turborepo + pnpm
- **Scale:** Enterprise (Fortune 500)

---

## Quick Navigation

### Core Apps (3)
- [apps/web](#appsweb) - Next.js storefront
- [apps/admin](#appsadmin) - React admin
- [apps/api](#appsapi) - Fastify API

### Shared Packages (12)
- [packages/ui](#packagesui) - Component library
- [packages/db](#packagesdb) - Prisma schema
- ...

### Infrastructure (72)
[Collapsed - expand for full list]

---

## Workspaces Detail

### apps/web
**Customer storefront**
- Type: nextjs
- Path: apps/web/
- Dependencies: react, next, tailwindcss

[...workspace details...]

---

## Monorepo Infrastructure
- Build: turbo.json
- Cache: Vercel Remote Cache
- Versioning: Changesets
- CI/CD: GitHub Actions
```

**Result:**
- ✅ Single CLAUDE.md (works with Claude Code)
- ✅ Structured (easy to navigate)
- ✅ Scales to 87 packages
- ✅ Generated from project.faf (bi-sync)

---

## Implementation Checklist

**For Mk3.31 (Next Release - Bi-sync Enhancement):**

- [ ] Detect `workspaces:` array in project.faf
- [ ] Generate workspace sections in CLAUDE.md
- [ ] Add navigation links (TOC)
- [ ] Collapse large workspace lists (50+ packages)
- [ ] Test with 87-package monorepo

**For Mk3.4+ (Future - Conductor Pattern - Optional):**

- [ ] Design `.claude/` directory structure
- [ ] Implement workspace context loader
- [ ] Add CLI command: `faf claude workspace <name>`
- [ ] Coordinate with Claude Code team for subdirectory support

Note: Mk4 is reserved and unavailable.

---

## Recommendation

**✅ Adopt Option D for Mk3.3:**

1. **One CLAUDE.md at root** (works with Claude Code today)
2. **Structured workspace sections** (scales to 87 packages)
3. **Generated from project.faf** (bi-sync compatible)
4. **No conductor complexity** (future Mk3.4+ if needed)

**Future (Mk3.4+):**
- Consider conductor pattern if Claude Code adds subdirectory support
- Add workspace-scoped context loading
- Enable "Claude Code Workspace Mode"

---

## Version Alignment

**Mk3.3** = 33-slot monorepo edition (current)
**Mk3.31** = Mk3.3 + bi-sync workspace sections (next)
**Mk3.4+** = Future enhancements (conductor pattern if needed)

Staying on 3.3x line keeps version aligned with slot count (33 slots).
Note: Mk4 is reserved and unavailable for this project.

---

**DECISION: Single CLAUDE.md with Workspace Sections**
**STATUS: Approved for Mk3.3 / Mk3.31**
**COMPLEXITY: Simple (no conductor needed)**

*This keeps it simple while we're still at the foundation stage.* 🏎️
