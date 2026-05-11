# 🏗️ Monorepo Architecture: package.json vs project.faf

**Deep Intel:** The relationship between package.json files and project.faf in monorepos.

---

## The Fundamental Question

**In a monorepo with multiple package.json files, how should FAF work?**

### Current Reality (Single App)

```
my-app/
├── package.json          ← TSA reads this
├── project.faf           ← FAF writes this
└── src/
```

**Mapping:** 1 package.json → 1 project.faf → 1 project

---

## Monorepo Reality

### How package.json Works in Monorepos

#### Turborepo Example
```
shopfront/                         # Monorepo root
├── package.json                   # Root manifest (workspaces config)
├── turbo.json                     # Build orchestration
├── apps/
│   ├── web/
│   │   └── package.json          # Next.js app
│   ├── admin/
│   │   └── package.json          # React admin
│   └── api/
│       └── package.json          # Fastify API
└── packages/
    ├── ui/
    │   └── package.json          # Shared components
    ├── db/
    │   └── package.json          # Prisma schema
    └── config/
        └── package.json          # Shared configs
```

**package.json count:** 7 files
- 1 root (workspaces config)
- 6 workspace packages

**Current FAF behavior:**
- TSA reads root package.json ONLY
- Detects ONE project type
- Creates ONE project.faf
- **Misses:** 6 workspace package.jsons

---

## The Three Options

### Option A: Single Root .faf (Current Approach)

```
shopfront/
├── project.faf              # ← Single monorepo-level .faf
├── package.json             # Root
├── apps/
│   ├── web/package.json
│   └── api/package.json
└── packages/
    └── ui/package.json
```

**Pros:**
- ✅ Simple: 1 .faf file
- ✅ Describes overall architecture
- ✅ Easy to maintain

**Cons:**
- ❌ Can't capture per-workspace details
- ❌ TSA only reads root package.json
- ❌ Loses granular context

**Current Mk3.3 Implementation:**
```yaml
# project.faf (root only)
faf_version: 4.0.0
project:
  name: shopfront
  type: turborepo

stack:
  monorepo_tool: turborepo
  workspaces:
    - apps/web
    - apps/api
    - packages/ui

monorepo:
  packages_count: 6
  # ...12 monorepo slots
```

**Problem:** Doesn't read apps/web/package.json, apps/api/package.json, etc.

---

### Option B: Multi-.faf (One per Workspace)

```
shopfront/
├── project.faf              # Monorepo-level
├── apps/
│   ├── web/
│   │   ├── package.json
│   │   └── project.faf      # Web-specific
│   └── api/
│       ├── package.json
│       └── project.faf      # API-specific
└── packages/
    └── ui/
        ├── package.json
        └── project.faf      # UI-specific
```

**Pros:**
- ✅ Granular: Each workspace has context
- ✅ TSA can read workspace package.json
- ✅ Enables workspace-specific AI context

**Cons:**
- ❌ Maintenance burden (7 .faf files)
- ❌ Duplication (monorepo metadata in each)
- ❌ Which .faf does `faf score` read?

**Example:**
```yaml
# apps/web/project.faf
faf_version: 4.0.0
project:
  name: shopfront-web
  type: nextjs
  parent_monorepo: shopfront

stack:
  frontend: nextjs
  css_framework: tailwindcss

# Monorepo reference
monorepo:
  root: ../../
  workspace: apps/web
```

**Problem:** Over-engineering for simple monorepos.

---

### Option C: Single .faf with Multi-package.json References

```
shopfront/
├── project.faf              # ← References all package.jsons
├── package.json (root)
├── apps/
│   ├── web/package.json     # ← Read by TSA
│   └── api/package.json     # ← Read by TSA
└── packages/
    └── ui/package.json      # ← Read by TSA
```

**New .faf Format:**
```yaml
# project.faf
faf_version: 4.0.0
project:
  name: shopfront
  type: turborepo

stack:
  monorepo_tool: turborepo
  package_manager: pnpm

# NEW: Multi-package.json references
workspaces:
  - path: apps/web
    package_json: apps/web/package.json
    type: nextjs                    # ← TSA detects from package.json
    description: "Customer storefront"

  - path: apps/admin
    package_json: apps/admin/package.json
    type: react                     # ← TSA detects
    description: "Admin dashboard"

  - path: apps/api
    package_json: apps/api/package.json
    type: fastify                   # ← TSA detects
    description: "GraphQL + REST API"

  - path: packages/ui
    package_json: packages/ui/package.json
    type: library                   # ← TSA detects
    description: "Shared UI components"

  - path: packages/db
    package_json: packages/db/package.json
    type: library
    description: "Prisma schema"

  - path: packages/config
    package_json: packages/config/package.json
    type: library
    description: "Shared configs"

monorepo:
  packages_count: 6
  build_orchestrator: turbo.json
  # ...other monorepo slots
```

**Pros:**
- ✅ Single .faf file (maintainable)
- ✅ References all package.jsons
- ✅ TSA can analyze each workspace
- ✅ Captures granular + monorepo context

**Cons:**
- ❌ Requires TSA enhancement
- ❌ New .faf format (breaking change?)
- ❌ Complexity in `faf init`

---

## TSA (Type/Stack Analysis) Enhancement

### Current TSA Behavior

**Location:** `src/utils/file-utils.ts:detectProjectType()`

**Process:**
```typescript
export async function detectProjectType(projectDir: string): Promise<string> {
  // 1. Read ONE package.json
  const packageJsonPath = path.join(projectDir, "package.json");

  // 2. Run TSA on dependencies
  const tsa = new DependencyTSA(projectDir);
  const report = await tsa.inspect();

  // 3. Detect ONE type
  if (coreDeps.includes('next')) {
    return 'nextjs';
  }
  // ...

  // 4. Return ONE type
  return 'node-api';
}
```

**Problem:** Only reads root package.json in monorepos.

---

### Enhanced TSA for Monorepos

**New Function:** `detectMonorepoStructure()`

```typescript
interface WorkspaceInfo {
  path: string;
  packageJson: string;
  type: string;              // Detected by TSA
  dependencies: string[];
  description?: string;
}

interface MonorepoStructure {
  root: string;
  tool: 'turborepo' | 'nx' | 'lerna' | 'rush' | 'pnpm' | 'yarn';
  workspaces: WorkspaceInfo[];
  packageCount: number;
}

export async function detectMonorepoStructure(
  projectDir: string
): Promise<MonorepoStructure | null> {
  // 1. Check if it's a monorepo
  const rootPkg = await readPackageJson(path.join(projectDir, 'package.json'));

  if (!rootPkg.workspaces && !await fileExists('pnpm-workspace.yaml')) {
    return null; // Not a monorepo
  }

  // 2. Detect monorepo tool
  const tool = await detectMonorepoTool(projectDir);

  // 3. Find all workspace package.jsons
  const workspacePaths = await findWorkspaces(projectDir, tool);

  // 4. Run TSA on each workspace
  const workspaces: WorkspaceInfo[] = [];

  for (const wsPath of workspacePaths) {
    const pkgJsonPath = path.join(projectDir, wsPath, 'package.json');

    if (await fileExists(pkgJsonPath)) {
      // Run TSA on THIS workspace
      const type = await detectProjectType(path.join(projectDir, wsPath));
      const pkg = await readPackageJson(pkgJsonPath);

      workspaces.push({
        path: wsPath,
        packageJson: path.join(wsPath, 'package.json'),
        type: type,
        dependencies: Object.keys(pkg.dependencies || {}),
        description: pkg.description
      });
    }
  }

  return {
    root: projectDir,
    tool: tool,
    workspaces: workspaces,
    packageCount: workspaces.length
  };
}
```

---

## Implementation Strategy

### Phase 1: Read Multi-package.json (Mk3.4)

**Goal:** TSA reads all workspace package.jsons

**Changes:**
1. Add `detectMonorepoStructure()` to file-utils.ts
2. Enhance `faf init` to discover workspaces
3. Generate `workspaces:` section in project.faf

**Backward Compatible:** Yes (new optional field)

---

### Phase 2: Auto-fill Workspace Metadata (Mk3.5)

**Goal:** TSA auto-detects each workspace type

**Changes:**
1. Run TSA on each workspace
2. Auto-populate `type:` for each workspace
3. Cache results for performance

**Example Generated .faf:**
```yaml
workspaces:
  - path: apps/web
    type: nextjs              # ← Auto-detected by TSA
    dependencies: [react, next, tailwindcss]

  - path: apps/api
    type: fastify             # ← Auto-detected by TSA
    dependencies: [fastify, prisma]
```

---

### Phase 3: Workspace-Scoped AI Context (Mk4.0)

**Goal:** AI can navigate to specific workspace context

**Use Case:**
```
Developer: "Update the API authentication"
AI reads: shopfront/project.faf → workspaces → apps/api
AI navigates: shopfront/apps/api/
AI context: Fastify, TypeScript, Prisma (from TSA)
```

**This enables:** Per-workspace code generation with monorepo awareness.

---

## Slot Calculation Impact

### Current: Monorepo gets 33 slots (all at root)

```
Root project.faf:
  - project: 3 slots
  - frontend: 4 slots
  - backend: 5 slots
  - universal: 3 slots
  - human: 6 slots
  - monorepo: 12 slots

Total: 33 slots
```

### With Multi-package.json: Still 33 slots (root), but enriched

```
Root project.faf:
  - Same 33 slots
  - PLUS: workspaces[] array with per-package metadata

This doesn't increase slots, it increases CONTEXT RICHNESS.
```

**Key Insight:** Monorepo slots describe the ARCHITECTURE, workspace metadata describes the PACKAGES.

---

## Recommended Approach

### ✅ Option C + TSA Enhancement (Phased)

**Mk3.4 (Next):**
- Add `workspaces:` section to .faf
- TSA reads all workspace package.jsons
- Auto-populate workspace metadata

**Mk3.5 (Future):**
- Per-workspace type detection
- Dependency analysis per workspace
- Cache for performance

**Mk4.0 (Advanced):**
- Workspace-scoped AI context
- Navigate between workspaces intelligently
- Cross-workspace dependency mapping

---

## Real-World Example

### Shopfront Monorepo (6 packages)

**Before (Mk3.3):**
```yaml
# project.faf
faf_version: 4.0.0
project:
  name: shopfront
  type: turborepo

stack:
  monorepo_tool: turborepo
  workspaces:
    - apps/web
    - apps/admin
    - apps/api
    - packages/ui
    - packages/db
    - packages/config

monorepo:
  packages_count: 6
```

**Problem:** TSA only read root package.json. No per-workspace context.

---

**After (Mk3.4 + Enhanced TSA):**
```yaml
# project.faf
faf_version: 4.0.0
project:
  name: shopfront
  type: turborepo

stack:
  monorepo_tool: turborepo

# Enhanced with TSA workspace analysis
workspaces:
  - path: apps/web
    package_json: apps/web/package.json
    type: nextjs                          # ← TSA detected
    main_deps: [react, next, tailwindcss] # ← TSA found CORE deps
    description: "Customer storefront"

  - path: apps/admin
    package_json: apps/admin/package.json
    type: react                           # ← TSA detected
    main_deps: [react, react-admin]
    description: "Admin panel"

  - path: apps/api
    package_json: apps/api/package.json
    type: fastify                         # ← TSA detected
    main_deps: [fastify, prisma]
    description: "GraphQL + REST backend"

  - path: packages/ui
    package_json: packages/ui/package.json
    type: library                         # ← TSA detected
    main_deps: [react, shadcn-ui]
    description: "Shared components"

  - path: packages/db
    package_json: packages/db/package.json
    type: library
    main_deps: [prisma]
    description: "Database schema"

  - path: packages/config
    package_json: packages/config/package.json
    type: library
    main_deps: [eslint, prettier, tsconfig]
    description: "Shared tooling configs"

monorepo:
  packages_count: 6
  build_orchestrator: turbo.json
  versioning_strategy: changesets
  remote_cache: vercel
```

**Result:**
- ✅ TSA analyzed 6 workspace package.jsons
- ✅ Auto-detected types (nextjs, react, fastify, library)
- ✅ CORE dependencies identified per workspace
- ✅ Single .faf file with rich monorepo context

**AI Benefit:**
- AI knows apps/web is Next.js (not just "monorepo")
- AI knows apps/api is Fastify with Prisma (not just "backend")
- AI can navigate to correct workspace for context

---

## The Deep Intel

**Your Question Reveals:**

The current 1:1 mapping (1 package.json → 1 project.faf) breaks in monorepos because:

1. **Structural Mismatch:**
   - Monorepos have N package.jsons
   - Current FAF assumes 1

2. **TSA Limitation:**
   - TSA reads ONE package.json
   - Monorepos need ALL package.jsons analyzed

3. **Context Loss:**
   - Root .faf describes monorepo
   - But loses per-workspace details

**The Solution:**

Enhance TSA to read multiple package.jsons and populate a single project.faf with workspace metadata.

- ✅ Maintains 1 .faf file (simple)
- ✅ Captures all package.json context (complete)
- ✅ Enables workspace-scoped AI (powerful)

---

## Next Steps

### For Mk3.4 (Enterprise Edition v1.1)

1. **Enhance TSA:**
   - Add `detectMonorepoStructure()`
   - Read all workspace package.jsons
   - Detect type per workspace

2. **Extend .faf Format:**
   - Add `workspaces:` array
   - Auto-populate from TSA analysis

3. **Update `faf init`:**
   - Detect monorepo
   - Run TSA on all workspaces
   - Generate enriched .faf

4. **Documentation:**
   - Monorepo .faf examples
   - TSA workspace analysis guide
   - Migration from Mk3.3 to Mk3.4

---

## Questions to Answer

1. **Should `workspaces:` be optional or required for monorepos?**
   - Recommendation: Optional (backward compatible)

2. **Should TSA run on workspaces automatically or on-demand?**
   - Recommendation: Automatic during `faf init`, cached

3. **How to handle performance with 87 packages?**
   - Recommendation: Parallel TSA + caching

4. **Should workspace .faf files be supported (Option B)?**
   - Recommendation: No, too complex for v1.1. Maybe v2.0.

---

*Analysis: Monorepo package.json Architecture*
*Date: 2026-02-16*
*For: FAF Enterprise Edition Mk3.4+*
