# 🏎️ CLAUDE.md - @faf/enterprise Persistent Context & Intelligence

## PROJECT STATE: GOOD 🚀
**Current Position:** Enterprise license validation complete, 100% Trophy status
**Tyre Compound:** ULTRASOFT C5 (Maximum Performance)

---

## 🎨 CORE CONTEXT

### Project Identity
- **Name:** @faf/enterprise
- **Version:** 1.0.0
- **License:** Elastic License 2.0 (source-available, commercial)
- **Stack:** CLI/TypeScript/Node.js/npm (private)
- **Quality:** F1-INSPIRED (Championship Performance)
- **Status:** 🏆 100/100 - Trophy - Championship - GOLD CODE

### Mission Statement
> "When your monorepo has 87 packages, persistent AI context is non-negotiable."

**Target Market:** Fortune 500, tech unicorns, agencies, 50+ engineer teams

**Value Proposition:** 33-slot monorepo scoring (21 base + 12 monorepo) captures complexity that Community Edition (21 slots) cannot. Eliminates AI context-drift in large-scale codebases.

---

## 🏗️ TECHNICAL ARCHITECTURE

### The 33-Slot System (Mk3.3)

**Community Edition (faf-cli):**
- License: MIT (open source)
- Slots: 21 (project + frontend + backend + universal + human)
- Price: FREE FOREVER
- Target: Solo devs, indies, startups (95% of developers)

**Enterprise Edition (@faf/enterprise):**
- License: Elastic License 2.0 (source-available)
- Slots: 33 (21 base + 12 monorepo)
- Price: $15-25/seat/month
- Target: Fortune 500, tech unicorns (5% of developers, 95% of revenue)

### Monorepo Slots (12 Additional)

**Infrastructure (5 slots):**
- `stack.monorepo_tool` - turborepo | nx | lerna | rush | pnpm | yarn
- `stack.package_manager` - pnpm | yarn | npm | bun
- `stack.workspaces` - Array of workspace paths
- `monorepo.packages_count` - Number of packages
- `monorepo.build_orchestrator` - turbo.json | nx.json | null

**Application Layers (4 slots):**
- `stack.admin` - Separate admin UI
- `stack.cache` - Redis | Memcached | Upstash
- `stack.search` - Algolia | Meilisearch | Elasticsearch
- `stack.storage` - S3 | R2 | GCS | Cloudflare

**Operations (3 slots):**
- `monorepo.versioning_strategy` - changesets | independent | fixed
- `monorepo.shared_configs` - Base configs array
- `monorepo.remote_cache` - Vercel | Nx Cloud | none

---

## 🔐 LICENSE VALIDATION SYSTEM

### Components

| Component | Path | Purpose |
|-----------|------|---------|
| **License Validator** | `src/enterprise/license-validator.ts` | JWT validation with RSA-SHA256 signatures |
| **Enterprise CLI** | `src/commands/enterprise.ts` | CLI commands (activate/status/info) |
| **Compiler Integration** | `src/compiler/faf-compiler.ts` | License check before 33-slot scoring |
| **Test Generator** | `scripts/generate-test-license.ts` | Generate test licenses for development |

### License Flow

```
1. User activates: faf enterprise activate <jwt-key>
2. License stored in: faf-enterprise.license (or FAF_LICENSE_KEY env var)
3. Compiler checks license before monorepo scoring:
   ✅ Valid license → 33-slot scoring
   ❌ No license → Falls back to library (9 slots)
```

### License Format (JWT)

**Structure:** `header.payload.signature` (base64url)

**Payload:**
```json
{
  "customer": "Company Name",
  "tier": "enterprise",
  "seats": 10,
  "expiresAt": 1802804674,
  "features": {
    "monorepo": true,
    "teamFeatures": true,
    "sso": false,
    "prioritySupport": true
  },
  "licenseId": "FAF-2026-XXXX"
}
```

**Signature:** RSA-SHA256 (2048-bit key)

---

## 🛠️ DEVELOPMENT COMMANDS

### Build & Test
```bash
npm install          # Install dependencies
npm run build        # Compile TypeScript
npm test             # Run test suite (833 tests, 44 skip without license)
npm run clean        # Clean build artifacts
```

### Enterprise Commands
```bash
node dist/cli.js enterprise status           # Check license status
node dist/cli.js enterprise activate <key>   # Activate license
node dist/cli.js enterprise info             # Detailed info
```

### Testing License Validation
```bash
# Generate test license
npx ts-node scripts/generate-test-license.ts

# Test with license (33 slots)
export FAF_LICENSE_KEY="<jwt>"
node dist/cli.js score tests/fixtures/monorepo/yarn-fullstack.faf
# Expected: 33/33 slots ✅

# Test without license (fallback)
unset FAF_LICENSE_KEY
node dist/cli.js score tests/fixtures/monorepo/yarn-fullstack.faf
# Expected: 9/9 slots (library fallback) ✅
```

### FAF Scoring
```bash
node dist/cli.js score           # Score current project
node dist/cli.js bi-sync         # Sync .faf ↔ CLAUDE.md
node dist/cli.js status          # Quick health check
```

---

## 📁 KEY FILES & THEIR PURPOSE

### Core Infrastructure
| File | Purpose | Critical? |
|------|---------|-----------|
| `package.json` | Package manifest, version 1.0.0 | ✅ |
| `tsconfig.json` | TypeScript strict mode config | ✅ |
| `LICENSE` | Elastic License 2.0 + FAF terms | ✅ |
| `project.faf` | AI context (100% score) | ✅ |

### Enterprise System
| File | Purpose | Critical? |
|------|---------|-----------|
| `src/enterprise/license-validator.ts` | JWT validation, signature verification | ✅ |
| `src/commands/enterprise.ts` | CLI activation commands | ✅ |
| `src/compiler/faf-compiler.ts` | Mk3.3 compiler with license check | ✅ |
| `scripts/generate-test-license.ts` | Test license generator | 🔧 Dev |

### Documentation
| File | Purpose | Critical? |
|------|---------|-----------|
| `README.md` | Public-facing overview | ✅ |
| `CLAUDE.md` | AI context (this file) | ✅ |
| `docs/ENTERPRISE.md` | Enterprise guide (8.1 KB) | ✅ |
| `docs/LICENSE-STRATEGY.md` | License comparison (19.2 KB) | 📖 |
| `docs/LICENSE-INTEGRATION.md` | Integration docs (12 KB) | 📖 |
| `docs/MIGRATION.md` | Community → Enterprise migration | 📖 |
| `docs/BRAND-MESSAGING.md` | Sales messaging (9.7 KB) | 📖 |

### Test Fixtures
| File | Purpose | Slots |
|------|---------|-------|
| `tests/fixtures/monorepo/minimal.faf` | Minimal monorepo | 13/25 (52%) |
| `tests/fixtures/monorepo/yarn-fullstack.faf` | Full-stack monorepo | 33/33 (100%) 🏆 |
| `tests/fixtures/monorepo/rush-enterprise.faf` | Enterprise scale (87 packages) | 33/33 (100%) 🏆 |

---

## 🧪 TESTING STRATEGY

### Test Coverage
- **Total Tests:** 833 total (788 passing, 44 skipped*, 0 failing)
- **Categories:** Edge cases, file confusion, symlinks, performance, monorepo validation
- **Build:** Zero errors, strict TypeScript
- **Coverage:** Critical paths (license validation, compiler, CLI, monorepo detection)

**\*44 skipped:** Enterprise license-gated monorepo tests (33-slot validation, Turborepo/Nx/Lerna/Rush/pnpm/Yarn detection). Skipped in CI/CD without license - expected behavior.

### Quality Gates
✅ All TypeScript must pass strict mode
✅ Zero build errors
✅ Test coverage required for new features
✅ License validation must be tested end-to-end

---

## 📋 CURRENT SESSION CONTEXT

### What We Just Built (2026-02-16)

**License Validation System - COMPLETE ✅**

1. **License Validator** (`src/enterprise/license-validator.ts`)
   - JWT-based validation with RSA-SHA256 signatures
   - 3 license sources (file, env var, custom path)
   - Grace period handling (7 days)
   - Synchronous + async validation

2. **Enterprise CLI** (`src/commands/enterprise.ts`)
   - `faf enterprise` - Check status
   - `faf enterprise activate <key>` - Activate license
   - `faf enterprise info` - Detailed information

3. **Compiler Integration** (`src/compiler/faf-compiler.ts`)
   - License check in `buildIR()` function
   - Monorepo detection (turborepo, nx, lerna, etc.)
   - Graceful fallback to library (9 slots) without license

4. **Test License Generator** (`scripts/generate-test-license.ts`)
   - Generates RSA key pairs
   - Creates valid test licenses
   - Outputs activation commands

### Commits (Today)
```
ea71f12 docs: update project.faf to reflect Enterprise Edition
e31983c feat: implement enterprise license validation system
```

### Repository Status
- **FAF Score:** 🏆 100/100 (Trophy)
- **Git:** Clean working tree
- **Build:** ✅ Passing
- **Tests:** ✅ 20/20

---

## 🎯 NEXT STEPS

### Before v1.0 Release
- [ ] Generate production RSA key pair (keep private key secure)
- [ ] Embed public key in compiler for signature verification
- [ ] Create license generation server/tool
- [ ] Test with real monorepo projects
- [ ] Update ENTERPRISE.md with activation flow
- [ ] Add to README and documentation

### Phase 2 (Mk3.31)
- [ ] Bi-sync workspace sections (generate from project.faf workspaces array)
- [ ] Multi-package.json TSA analysis
- [ ] Workspace navigation in CLAUDE.md

### Phase 3 (Mk3.4+)
- [ ] Optional telemetry (non-blocking, opt-in)
- [ ] License renewal reminders (30 days before expiry)
- [ ] Team seat usage tracking
- [ ] License transfer workflow
- [ ] Conductor pattern (if Claude Code adds subdirectory support)

Note: Mk4 is reserved and unavailable for Enterprise Edition.

---

## 🔗 RELATED REPOSITORIES

| Repository | Purpose | License |
|------------|---------|---------|
| **faf-cli** | Community Edition (21 slots) | MIT (open source) |
| **faf-enterprise** | Enterprise Edition (33 slots) | ELv2 (this repo) |
| **claude-faf-mcp** | Anthropic MCP server | MIT |
| **PLANET-FAF** | Strategy & intel docs | Private |

---

## 💡 AI ASSISTANT NOTES

### When Working on This Project

1. **License System:**
   - Never break license validation
   - Test both WITH and WITHOUT license scenarios
   - Maintain graceful fallback to Community Edition

2. **Code Quality:**
   - TypeScript strict mode non-negotiable
   - Zero build errors always
   - Test coverage for new features

3. **Enterprise Focus:**
   - This is for Fortune 500 companies
   - 87-package monorepos are the target
   - Professional, boring, trusted

4. **Monorepo Slots:**
   - 33 slots total (21 base + 12 monorepo)
   - Only enabled with valid license
   - Falls back to library (9 slots) without license

5. **Architecture Pattern:**
   - GitLab-inspired (CE/EE split)
   - Elasticsearch license model (ELv2)
   - HashiCorp feature tier pattern

---

## CONTEXT CHUNKS (v3.0)

> Summaries of context chunks from `project.faf` v3.0. Full data lives in the .faf.

| Chunk | Summary |
|-------|---------|
| **architecture** | Modular-monolith. CLI → parser → chunk-registry → resolver → output. 6 components. |
| **testing** | WJTTC methodology. 7 test suites (T1-T7). 182 v3 tests, 994+ total, 0 failures. |
| **skills** | Parse any .faf (v1-v3), classify chunks, resolve chains, detect manifests/git, score DNA. |
| **interop** | 4 MCP servers (claude/grok/gemini/rust), 3 compilers (Rust/WASM/Zig), IANA-registered YAML + FAFb binary. |
| **agents** | 3 agents (code/review/ops). Conductor pattern. 6 generation targets (Frontier 4 + cursorrules + json). |
| **git** | GitHub provider. Wolfe-Jam/faf-enterprise. Main branch. Manifest versioning. |
| **manifest** | package.json. @faf/enterprise v1.0.0. Elastic-2.0. TypeScript. Private. |

## AGENTS

> Defined in `project.faf` agents chunk. Instructions in `AGENTS.md`.

| Agent | Role | Reads |
|-------|------|-------|
| **code-agent** | Writes code changes | architecture, skills, dependencies, testing |
| **review-agent** | Reviews PRs for policy | compliance, security, ai_policy, rules |
| **ops-agent** | Deployment & incidents | runbook, sla, git, dependencies |

---

**STATUS: BI-SYNC ACTIVE 🔗 - Synchronized with .faf v3.0 context!**

*Last Sync: 2026-03-18*
*Format: FAF v3.0 IFF Container (7 context chunks)*
*Sync Engine: F1-Inspired Software Engineering*
*🏎️⚡️_championship_sync*
