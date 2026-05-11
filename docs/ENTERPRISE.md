# 🏢 FAF ENTERPRISE EDITION

**Championship-Grade AI Context for Monorepos**

---

## What Is FAF Enterprise?

FAF Enterprise Edition extends the open-source FAF format with **monorepo support (33 slots)** and team collaboration features designed for enterprise-scale engineering organizations.

### The Split

| Edition | Slots | License | For | Price |
|---------|-------|---------|-----|-------|
| **Community** | 21 | MIT | Solos, indies, startups | Free forever |
| **Enterprise** | 33 | Commercial | Teams, agencies, enterprises | $XX/seat/month |

---

## Why Enterprise?

### The Problem

When your codebase scales to a monorepo with 50+ packages:
- 21 slots can't capture monorepo-specific context
- No support for Turborepo, Nx, Lerna, Rush metadata
- Missing workspace orchestration context
- No team collaboration features

### The Solution

FAF Enterprise adds **12 monorepo-specific slots** (Mk3.3 Compiler Engine):

```yaml
# Enterprise-Only Monorepo Slots (12)

Infrastructure (5):
- stack.monorepo_tool       # turborepo | nx | lerna | rush | pnpm | yarn
- stack.package_manager     # pnpm | yarn | npm | bun
- stack.workspaces          # Array of workspace paths
- monorepo.packages_count   # Number of packages
- monorepo.build_orchestrator  # turbo.json | nx.json | null

Application Layers (4):
- stack.admin               # Separate admin UI
- stack.cache              # Redis | Memcached | Upstash
- stack.search             # Algolia | Meilisearch | Elasticsearch
- stack.storage            # S3 | R2 | GCS | Cloudflare

Operations (3):
- monorepo.versioning_strategy  # changesets | independent | fixed
- monorepo.shared_configs       # Base configs array
- monorepo.remote_cache         # Vercel | Nx Cloud | none
```

**Total:** 21 base slots + 12 monorepo slots = **33 slots**

---

## Who Needs Enterprise?

### ✅ You Need Enterprise If:
- Managing Turborepo, Nx, Lerna, Rush, pnpm, or Yarn workspaces
- 10+ packages in your monorepo
- Multi-team engineering organization (50+ engineers)
- E-commerce platforms (Shopify-scale)
- Microservices architectures
- Design system libraries
- Agencies managing multiple client codebases

### ❌ Community Edition Is Fine If:
- Single-app projects
- Simple full-stack apps (1-3 packages)
- Indie SaaS
- Side projects
- Open source projects
- Experimenting/learning

---

## Features

### Mk3.3 Compiler Engine ✅

33-slot scoring system with monorepo intelligence:

```bash
# Community Edition (faf-cli)
$ faf score project.faf
Score: 85% (18/21 slots) 🥉 BRONZE

# Enterprise Edition (@faf/enterprise)
$ faf score project.faf
Score: 88% (29/33 slots) 🥉 BRONZE
Monorepo: Turborepo with 12 packages detected
```

### Monorepo Auto-Detection ✅

Detects 6 monorepo tools automatically:
- **Turborepo** - turbo.json, `monorepo_tool: turborepo`
- **Nx** - nx.json, `monorepo_tool: nx`
- **Lerna** - lerna.json, `monorepo_tool: lerna`
- **Rush** - rush.json, `monorepo_tool: rush`
- **pnpm** - pnpm-workspace.yaml, `package_manager: pnpm`
- **Yarn** - package.json with workspaces, `package_manager: yarn`

### Test Fixtures ✅

7 comprehensive monorepo examples in `tests/fixtures/monorepo/`:
- minimal.faf (Turborepo, 2 packages)
- nx-microservices.faf (Nx, 10 packages)
- lerna-library.faf (Lerna, 6 packages)
- pnpm-backend.faf (pnpm, 5 packages)
- yarn-fullstack.faf (Yarn, 6 packages, 100% score)
- rush-enterprise.faf (Rush, 87 packages, 100% score)
- keywords-only.faf (auto-detection)

### WJTTC Test Suite ✅

Championship-grade testing across 9 tiers:
- 25 comprehensive monorepo tests
- Covers all 6 monorepo tools
- Validates slot calculations
- Tests auto-detection logic
- Ensures backward compatibility

---

## Roadmap

### v1.0 (Launch) - READY ✅
- ✅ Mk3.3 compiler (33 slots)
- ✅ Monorepo detection (6 tools)
- ✅ WJTTC test suite
- ✅ Test fixtures
- 🔲 License validation
- 🔲 Enterprise landing page

### v1.1 (Team Features)
- 🔲 Team workspace management
- 🔲 Shared .faf templates
- 🔲 Multi-repo analytics dashboard
- 🔲 Slack/Teams integration

### v1.2 (Security & Compliance)
- 🔲 SSO/SAML authentication
- 🔲 Audit logging
- 🔲 RBAC (role-based access)
- 🔲 SOC2 compliance

### v2.0 (AI-Powered)
- 🔲 Auto-sync across monorepo packages
- 🔲 Dependency graph visualization
- 🔲 Context recommendations
- 🔲 Team knowledge base

---

## Pricing

### Starter
**$15/seat/month**
- Up to 10 seats
- 33 slots (monorepo support)
- Email support
- Community Slack

### Business
**$25/seat/month**
- Unlimited seats
- Team features (v1.1+)
- Priority support
- SSO/SAML (v1.2+)

### Enterprise
**Custom pricing**
- On-premise deployment
- White-label options
- Dedicated support
- SLA guarantee
- Custom integrations

**Annual billing:** 20% discount
**Volume discounts:** 50+ seats

---

## ROI Calculator

### Without FAF Enterprise

```
Context drift: 91% of developer time
Engineer salary: $150K/year
Team size: 20 engineers
Productivity loss: 0.91 × $150K × 20 = $2.73M/year
```

### With FAF Enterprise

```
License cost: $25/seat × 20 seats × 12 months = $6,000/year
Context drift: ~0% (eliminated)
Productivity reclaimed: $2.73M/year
ROI: 45,500% in first year
```

**Break-even:** 1 day

---

## Installation

### 1. Activate License

```bash
faf enterprise activate <license-key>
```

### 2. Verify Installation

```bash
faf enterprise status
# ✅ Enterprise Edition activated
# License: Starter (10 seats)
# Expiry: 2027-02-16
# Features: Mk3.3 (33 slots), Monorepo support
```

### 3. Score Your Monorepo

```bash
cd /path/to/your/monorepo
faf score

# Score: 88% (29/33 slots) 🥉 BRONZE
# Type: Turborepo monorepo
# Packages: 12
# Workspaces: apps/*, packages/*
```

---

## Support

### Enterprise Support Channels

- **Email:** enterprise@faf.one
- **Slack:** #enterprise (dedicated channel)
- **GitHub:** Private issues repo
- **SLA:** 4-hour response time (Business hours)
- **Priority:** Critical issues < 1 hour

### Documentation

- **Enterprise Docs:** https://enterprise.faf.one
- **Migration Guide:** [MIGRATION.md](./MIGRATION.md)
- **API Reference:** https://enterprise.faf.one/api
- **Case Studies:** https://faf.one/enterprise/case-studies

---

## FAQ

### How does licensing work?

Seat-based licensing. Each developer using FAF Enterprise needs a seat.

### Can I try before buying?

Yes! 14-day free trial: https://faf.one/enterprise/trial

### What happens if my license expires?

Graceful degradation to 21-slot scoring (Community Edition behavior).

### Can I upgrade from Community to Enterprise?

Yes! Your existing .faf files work in Enterprise Edition with no changes.

### Do I need to modify my .faf files?

No. Enterprise Edition automatically detects monorepos and applies 33 slots.

### Is the source code available?

Enterprise Edition is source-available (not open source). Code is provided
for auditing and customization, but not redistribution.

### Can I self-host?

Yes, on Enterprise tier with custom pricing.

---

## Migration from Community Edition

See [MIGRATION.md](./MIGRATION.md) for detailed upgrade instructions.

**TL;DR:**
```bash
# 1. Install Enterprise
npm install -g @faf/enterprise

# 2. Activate license
faf enterprise activate <key>

# 3. Score your monorepo
faf score
# Now using 33 slots automatically!
```

---

## Case Studies

### E-Commerce Platform (Shopfront)

- **Before:** 21 slots, couldn't capture monorepo metadata
- **After:** 33 slots, full Turborepo context
- **Result:** 91% reduction in onboarding time
- **Scale:** 6 workspaces, 50+ components
- **Read more:** https://faf.one/case-studies/shopfront

### FinTech Microservices (PaymentCo)

- **Before:** Manual documentation, constant drift
- **After:** Nx workspace with 33-slot FAF
- **Result:** Zero context re-explanation between teams
- **Scale:** 10 microservices, 12 engineers
- **Read more:** https://faf.one/case-studies/paymentco

---

## Contact

**Sales:** sales@faf.one
**Support:** enterprise@faf.one
**Website:** https://faf.one/enterprise

**Schedule a demo:** https://cal.com/faf/enterprise-demo

---

*FAF Enterprise Edition v1.0*
*When your monorepo has 87 packages, persistent AI context is non-negotiable.*

🏢 **Championship-Grade AI Context for Teams** 🏎️
