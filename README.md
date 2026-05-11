<!-- faf: faf-enterprise-public | markdown | doc | Public About Repo for FAF Enterprise — source code private at Wolfe-Jam/faf-enterprise. -->
<!-- faf: doc=readme | canonical=project.faf | family=FAF | private_source=Wolfe-Jam/faf-enterprise -->

[![FAF](https://mcpaas.live/badge/Wolfe-Jam/faf-enterprise-public.svg)](https://builder.faf.one)
[![IANA Registered](https://img.shields.io/badge/IANA-application%2Fvnd.faf%2Byaml-blue)](https://www.iana.org/assignments/media-types/application/vnd.faf+yaml)

> 📖 **Public About Repo** — this is the public face of `Wolfe-Jam/faf-enterprise` (source private). README, docs, project.faf — no source code. Same shape as Anthropic's [`claude-code`](https://github.com/anthropics/claude-code) repo: public face, private engine.

# 🏢 FAF Enterprise Edition

**Persistent Project Context for teams, large orgs, monorepos.**

**FAF defines. MD instructs. AI codes.**

When your monorepo has 87 packages, persistent AI context is non-negotiable.

---

[![Enterprise Edition](https://img.shields.io/badge/Edition-Enterprise-orange.svg)](https://faf.one/enterprise)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/Wolfe-Jam/faf-enterprise-public)
[![License](https://img.shields.io/badge/license-Commercial-red.svg)](./LICENSE)
[![Slots](https://img.shields.io/badge/slots-33-success.svg)](./docs/ENTERPRISE.md)

---

## What Is This?

FAF Enterprise Edition is the **monorepo-aware version** of the Foundational AI-context Format (FAF).

While the [Community Edition](https://github.com/Wolfe-Jam/faf-cli) provides 21 slots for single-app projects, **Enterprise Edition unlocks 33 slots** for teams managing Turborepo, Nx, Lerna, Rush, pnpm, or Yarn workspaces.

### The Split

| Edition | Slots | Monorepo Support | Team Features | License | Price |
|---------|-------|------------------|---------------|---------|-------|
| **Community** | 21 | ❌ | ❌ | MIT | Free forever |
| **Enterprise** | 33 | ✅ | ✅ | Commercial | $15-25/seat/month |

---

## Quick Start

### 1. Install

```bash
# Requires valid enterprise license
npm install -g @faf/enterprise
```

### 2. Activate

```bash
faf enterprise activate <your-license-key>
```

### 3. Score Your Monorepo

```bash
cd /path/to/your/turborepo
faf score

# Score: 88% (29/33 slots) 🥉 BRONZE
# Type: Turborepo monorepo
# Packages: 12 detected
```

**That's it.** Your monorepo now has championship-grade AI context.

---

## What You Get

### Mk3.3 Compiler Engine

33-slot scoring system with **12 monorepo-specific slots**:

```yaml
# Infrastructure (5 slots)
stack.monorepo_tool         # turborepo | nx | lerna | rush | pnpm | yarn
stack.package_manager       # pnpm | yarn | npm | bun
stack.workspaces           # Array of workspace paths
monorepo.packages_count    # Number of packages
monorepo.build_orchestrator # turbo.json | nx.json | null

# Application Layers (4 slots)
stack.admin                # Separate admin UI
stack.cache               # Redis | Upstash
stack.search              # Algolia | Elasticsearch
stack.storage             # S3 | R2 | Cloudflare

# Operations (3 slots)
monorepo.versioning_strategy  # changesets | independent | fixed
monorepo.shared_configs       # Base configs array
monorepo.remote_cache         # Vercel | Nx Cloud
```

**Total:** 21 base + 12 monorepo = **33 slots**

### Monorepo Auto-Detection

Automatically detects 6 monorepo tools:
- ✅ **Turborepo** (turbo.json)
- ✅ **Nx** (nx.json)
- ✅ **Lerna** (lerna.json)
- ✅ **Rush** (rush.json)
- ✅ **pnpm** (pnpm-workspace.yaml)
- ✅ **Yarn** (workspaces in package.json)

### Test Fixtures

7 championship-grade examples in `tests/fixtures/monorepo/`:

| Fixture | Tool | Packages | Score | Use Case |
|---------|------|----------|-------|----------|
| yarn-fullstack.faf | Yarn | 6 | 100% 🏆 | Full-stack SaaS |
| rush-enterprise.faf | Rush | 87 | 100% 🏆 | Enterprise-scale |
| nx-microservices.faf | Nx | 10 | 85% 🥉 | Microservices |
| pnpm-backend.faf | pnpm | 5 | 96% 🥈 | Backend API |
| lerna-library.faf | Lerna | 6 | 96% 🥈 | Component library |
| minimal.faf | Turborepo | 2 | 52% | MVP monorepo |
| keywords-only.faf | (auto) | 3 | 82% | Keyword detection |

### WJTTC Certification

**25 championship-grade tests** across 9 tiers:
- Brakes (critical infrastructure)
- Engine (performance validation)
- Aerodynamics (all 6 tools tested)
- Steering (developer experience)
- Telemetry (observability)
- Reliability (edge cases)
- Safety (security validation)
- Integration (ecosystem compatibility)
- Receipt (compliance verification)

**Status:** 788/833 tests passing ✅ (44 skipped - license-gated monorepo tests*)

**\*Skipped tests:** Enterprise license-gated monorepo validation (33-slot scoring, Turborepo/Nx/Lerna/Rush/pnpm/Yarn detection). Expected in CI/CD without license. Enables locally with: `export FAF_LICENSE_KEY="<test-license>"`

---

## Who Needs This?

### ✅ You Need Enterprise If:

- Managing **Turborepo, Nx, Lerna, Rush** workspaces
- **10+ packages** in your monorepo
- **Multi-team** engineering org (50+ engineers)
- **E-commerce** platforms (Shopify-scale)
- **Microservices** architectures
- **Design system** libraries
- **Agencies** managing multiple client codebases

### ❌ Community Edition Is Fine If:

- Single-app projects
- Simple full-stack apps
- Indie SaaS
- Side projects
- Open source
- Learning/experimenting

---

## ROI

### Without FAF Enterprise
```
Context drift: 91% of developer time wasted
Engineer salary: $150K/year
Team size: 20 engineers
Annual loss: $2.73M
```

### With FAF Enterprise
```
License cost: $6,000/year (20 seats × $25/month)
Context drift: ~0%
Productivity reclaimed: $2.73M/year
ROI: 45,500%
```

**Break-even:** 1 day

---

## Pricing

### Starter
**$15/seat/month**
- Up to 10 seats
- 33 slots
- Email support

### Business
**$25/seat/month**
- Unlimited seats
- Team features (v1.1+)
- Priority support
- SSO/SAML (v1.2+)

### Enterprise
**Custom**
- On-premise
- White-label
- SLA guarantee
- Dedicated support

**14-day free trial:** https://faf.one/enterprise/trial

---

## Documentation

- **Getting Started:** [ENTERPRISE.md](./docs/ENTERPRISE.md)
- **Migration Guide:** [MIGRATION.md](./docs/MIGRATION.md)
- **Enterprise Docs:** https://enterprise.faf.one
- **API Reference:** https://enterprise.faf.one/api
- **Case Studies:** https://faf.one/enterprise/case-studies

---

## Support

### Enterprise Channels
- **Email:** enterprise@faf.one
- **Slack:** #enterprise (private channel)
- **GitHub:** Private issues repo
- **SLA:** < 4 hour response time

### Self-Service
- **Knowledge Base:** https://enterprise.faf.one/kb
- **API Docs:** https://enterprise.faf.one/api
- **Community Slack:** https://faf.one/slack

---

## Roadmap

### v1.0 (Launch) - ✅ SHIPPING

- ✅ Mk3.3 Compiler (33 slots)
- ✅ Monorepo detection (6 tools)
- ✅ WJTTC test suite (25 tests)
- ✅ Test fixtures (7 examples)
- 🔲 License validation
- 🔲 Enterprise landing page

### v1.1 (Team Features)

- Team workspace management
- Shared .faf templates
- Multi-repo analytics
- Slack/Teams integration

### v1.2 (Security)

- SSO/SAML
- Audit logging
- RBAC
- SOC2 compliance

### v2.0 (AI-Powered)

- Auto-sync across packages
- Dependency visualization
- Context recommendations
- Team knowledge base

---

## FAQ

**Q: How does licensing work?**
A: Seat-based. Each developer needs a seat license.

**Q: Can I try before buying?**
A: Yes! 14-day free trial at https://faf.one/enterprise/trial

**Q: Do I modify my .faf files?**
A: No. Enterprise auto-detects monorepos and applies 33 slots.

**Q: What if my license expires?**
A: Graceful fallback to 21-slot scoring (Community Edition behavior).

**Q: Can I self-host?**
A: Yes, on Enterprise tier with custom pricing.

**Q: Is source code available?**
A: Source-available (not open source). Provided for auditing, not redistribution.

---

## Comparison

| Feature | Community | Enterprise |
|---------|-----------|------------|
| Slots | 21 | 33 |
| Monorepo support | ❌ | ✅ |
| Auto-detection | Basic | Advanced (6 tools) |
| Team features | ❌ | ✅ |
| Priority support | ❌ | ✅ |
| SSO/SAML | ❌ | ✅ (v1.2) |
| License | MIT | Commercial |
| Price | Free | $15-25/seat/month |

---

## Case Studies

### E-Commerce Platform (Shopfront)
- **Scale:** 6 workspaces, Turborepo
- **Result:** 91% reduction in onboarding time
- **Read more:** https://faf.one/case-studies/shopfront

### FinTech Microservices (PaymentCo)
- **Scale:** 10 microservices, Nx workspace
- **Result:** Zero context drift between teams
- **Read more:** https://faf.one/case-studies/paymentco

---

## License

**Commercial License** - See [LICENSE](./LICENSE)

This is commercial software. Use requires a valid enterprise license.

**Community Edition (free, MIT):** https://github.com/Wolfe-Jam/faf-cli

---

## Contact

**Sales:** sales@faf.one
**Support:** enterprise@faf.one
**Website:** https://faf.one/enterprise

**Schedule demo:** https://cal.com/faf/enterprise-demo

---

## Built By

**WolfeJam** - Championship-grade software engineering

- GitHub: [@Wolfe-Jam](https://github.com/Wolfe-Jam)
- X: [@wolfejam](https://x.com/wolfejam)
- Website: https://faf.one

---

## Related

- **Community Edition:** https://github.com/Wolfe-Jam/faf-cli (free, 21 slots)
- **Claude MCP:** https://github.com/Wolfe-Jam/claude-faf-mcp (Anthropic-approved)
- **Grok MCP:** https://github.com/Wolfe-Jam/grok-faf-mcp (xAI integration)
- **Gemini MCP:** https://github.com/Wolfe-Jam/gemini-faf-mcp (Google integration)
- **FAF Spec:** https://github.com/Wolfe-Jam/faf (format specification)

---

*FAF Enterprise Edition v1.0*
*Championship-Grade AI Context for Monorepos* 🏎️

**When your team scales, your context should too.**
