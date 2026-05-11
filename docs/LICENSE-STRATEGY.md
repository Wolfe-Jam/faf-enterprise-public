# 📜 FAF License Strategy

**Model:** GitLab / Elasticsearch / HashiCorp
**Date:** 2026-02-16

---

## Our Model: Dual Licensing (Free + Enterprise)

### Community Edition (faf-cli)
```
License:     MIT
Repository:  github.com/Wolfe-Jam/faf-cli (PUBLIC)
Features:    21 slots, single-project support
Price:       FREE FOREVER
Target:      Solo devs, indies, startups, 95% of developers
```

### Enterprise Edition (@faf/enterprise)
```
License:     Elastic License 2.0
Repository:  github.com/Wolfe-Jam/faf-enterprise (PRIVATE)
Features:    33 slots, monorepo support, team features
Price:       $15-25/seat/month
Target:      Fortune 500, tech unicorns, agencies, 50+ engineer teams
```

---

## Why Elastic License 2.0?

### Used By (Proven Track Record)

| Company | Product | Revenue | License |
|---------|---------|---------|---------|
| **Elastic** | Elasticsearch, Kibana | $1B+ | ELv2 |
| **Cockroach Labs** | CockroachDB | $100M+ | ELv2 variant |
| **MongoDB** | MongoDB | $1B+ | SSPL (similar) |
| **Redis** | Redis | $100M+ | RSALv2 (similar) |

### What It Does

✅ **Source-available** - Customers can audit code
✅ **Free for internal use** - Unlimited within org
✅ **Modification rights** - Adapt for your needs
✅ **Integration rights** - Include in products
✅ **Prevents cloud re-selling** - AWS can't compete

❌ **No managed services** - Can't host for others
❌ **No license bypass** - Can't remove validation
❌ **No reselling** - Can't sell to third parties

### Why Not Other Licenses?

**BSL (Business Source License):**
- ❌ Converts to open source after 4 years
- ❌ Gives away future value
- ✅ Good for VC-backed companies with exit timeline

**AGPL (Affero GPL):**
- ❌ Too restrictive (forces derivative works to open)
- ❌ Scares enterprises away
- ✅ Good for SaaS-only products

**Proprietary (no source):**
- ❌ No audit rights
- ❌ Security teams hate it
- ✅ Maximum control

**ELv2 is the sweet spot:**
- Source-available (trust + security audits)
- Commercial-friendly (enterprises can use)
- Protects business model (prevents re-selling)

---

## Companies We're Like

### 1. GitLab (Most Similar)

**Their Split:**
- **Community:** MIT, self-hosted, basic features
- **Enterprise:** Proprietary, advanced features (SSO, audit logs, geo-replication)

**Revenue:** $500M+ ARR
**Why they're us:** Developer infrastructure with clear feature split

**Their Tagline:** "Everyone can contribute"
**Our Tagline:** "When your monorepo has 87 packages, persistent AI context is non-negotiable."

---

### 2. Elasticsearch (License Model)

**Their Split:**
- **Open Source:** Apache 2.0 (basic search)
- **Enterprise:** ELv2 (security, ML, alerting)

**Revenue:** $1B+ ARR
**Why they're us:** Infrastructure with source-available enterprise tier

**License Switch:** Apache 2.0 → ELv2 (2021) to prevent AWS competition

---

### 3. HashiCorp (Pre-2023)

**Their Split:**
- **Community:** MPL 2.0 (Terraform, Vault, Consul)
- **Enterprise:** Commercial (team management, governance)

**Revenue:** $500M+ ARR
**Why they're us:** Infrastructure tooling with enterprise features

**Note:** They switched to BSL in 2023 (controversial), but their original model matches ours

---

### 4. Sentry

**Their Split:**
- **Self-hosted:** BSL 1.1 (becomes Apache 2.0 after 4 years)
- **Cloud:** SaaS pricing

**Revenue:** $100M+ ARR
**Why they're us:** Developer tool with good-faith licensing

---

### 5. PostHog

**Their Split:**
- **Open Source:** MIT (analytics platform)
- **Cloud:** Hosted + enterprise features

**Revenue:** $50M+ ARR
**Why they're us:** MIT core + enterprise tier

---

## License Comparison Matrix

| License | Source | Commercial Use | Managed Service | Becomes Open | Used By |
|---------|--------|----------------|-----------------|--------------|---------|
| **MIT** | Open | ✅ Free | ✅ Allowed | Already open | faf-cli (Community) |
| **ELv2** | Available | ✅ Allowed | ❌ Restricted | Never | **faf-enterprise** |
| **BSL** | Available | ✅ Allowed | ❌ Restricted | After 4 years | Sentry, MariaDB |
| **AGPL** | Open | ✅ Free | ⚠️ Must open | Already open | Plausible |
| **SSPL** | Available | ✅ Allowed | ❌ Restricted | Never | MongoDB |
| **Proprietary** | Closed | 💰 Licensed | ❌ Restricted | Never | Oracle |

---

## Feature Split (Community vs Enterprise)

### Community Edition (MIT)

**Features (21 slots):**
- ✅ Project metadata (name, goal, language)
- ✅ Frontend detection (React, Vue, Svelte)
- ✅ Backend detection (Node, Python, Go)
- ✅ Universal context (hosting, CI/CD)
- ✅ Human context (who, what, why, where, when, how)

**Use Cases:**
- Single apps
- Simple full-stack projects
- Indie SaaS
- Side projects
- Open source

**Pricing:** FREE FOREVER

---

### Enterprise Edition (ELv2)

**Features (33 slots = 21 base + 12 monorepo):**
- ✅ Everything in Community
- ✅ **Monorepo slots (12):**
  - Infrastructure (5): monorepo_tool, package_manager, workspaces, packages_count, build_orchestrator
  - Application Layers (4): admin, cache, search, storage
  - Operations (3): versioning_strategy, shared_configs, remote_cache
- ✅ Workspace-scoped AI context (Mk3.4+)
- ✅ Team features (v1.1+)
- ✅ SSO/SAML (v1.2+)
- ✅ Priority support

**Use Cases:**
- Turborepo, Nx, Lerna, Rush workspaces
- 10+ packages
- Multi-team engineering orgs
- E-commerce platforms (Shopify-scale)
- Microservices architectures

**Pricing:** $15-25/seat/month

---

## Legal Protection

### What ELv2 Protects Against

**1. Cloud Provider Competition:**
```
Scenario: AWS launches "FAF Enterprise as a Service"
Protection: ELv2 Section 2 - No managed services
Result: AWS can't compete without licensing
```

**2. License Key Bypass:**
```
Scenario: Customer removes license validation
Protection: ELv2 Section 2 - No circumventing license keys
Result: License terminates automatically
```

**3. Re-selling:**
```
Scenario: Agency buys 10 seats, resells to 100 clients
Protection: ELv2 - Non-transferable licenses
Result: Violation, license terminates
```

---

## Customer Rights

### What Customers CAN Do

✅ **Internal Use:**
- Deploy on own infrastructure
- Use across entire organization
- Unlimited seats if licensed

✅ **Modification:**
- Adapt for internal needs
- Fix bugs
- Add custom features (for own use)

✅ **Audit:**
- Security reviews
- Compliance checks
- Code review for due diligence

✅ **Integration:**
- Include in their products
- Bundle with their offerings
- (As long as they're not re-selling FAF itself)

---

### What Customers CANNOT Do

❌ **Managed Service:**
- Host FAF for other companies
- Provide "FAF as a Service"
- Re-sell licenses

❌ **License Bypass:**
- Remove license key validation
- Circumvent seat limits
- Share license keys

❌ **Re-distribution:**
- Sell to third parties
- Open source the enterprise code
- Remove copyright notices

---

## Enforcement

### License Validation

```typescript
// src/enterprise/license-validator.ts
export async function validateLicense(key: string): Promise<boolean> {
  // 1. Check format
  if (!isValidKeyFormat(key)) return false;

  // 2. Verify signature
  if (!verifySignature(key)) return false;

  // 3. Check expiry
  if (isExpired(key)) return false;

  // 4. Validate seat count
  if (exceedsSeatLimit(key)) return false;

  // 5. Phone home (optional, for analytics)
  await reportUsage(key);

  return true;
}

// On startup
if (!await validateLicense(process.env.FAF_LICENSE_KEY)) {
  console.error('⚠️  Invalid or missing enterprise license');
  console.error('   Falling back to 21-slot Community Edition');
  console.error('   Get a license: https://faf.one/enterprise');
  process.exit(1);
}
```

### Graceful Degradation

**If license invalid:**
1. Warn user
2. Fall back to 21-slot scoring (Community Edition behavior)
3. Disable enterprise features
4. Continue running (no hard break)

**Philosophy:** Don't brick software, just limit features.

---

## FAQ

### "Can customers see the source code?"

**Yes.** ELv2 is source-available. Customers can:
- Review code for security
- Audit for compliance
- Fix bugs (for own use)
- Understand how it works

**But they cannot:**
- Open source it
- Re-sell it
- Provide it as a service

---

### "What if a customer violates the license?"

**ELv2 Section 6 - Termination:**
1. We notify them of violation
2. They have 30 days to cure
3. If cured, license reinstated
4. If not cured, license terminates
5. Repeat violation = automatic termination

**We prefer:** Work with customers, not litigate.

---

### "Can customers modify the enterprise code?"

**Yes**, for their own use.

**No**, they can't redistribute modifications.

**Example:**
- ✅ Customer adds custom export format for internal use
- ❌ Customer sells "FAF Enterprise Plus" to others

---

### "What about open source contributions?"

**Community Edition (MIT):**
- Anyone can contribute
- PRs welcome
- Apache CLA required

**Enterprise Edition (ELv2):**
- Private repo
- No public contributions
- Customer feature requests via support channel

---

### "Can we switch licenses later?"

**Community → Enterprise:** Always possible (upgrade)
**Enterprise → Different License:** Requires new version release

**Best practice:** Stick with ELv2 for consistency.

---

## Migration Path (If Needed)

### From Current License → ELv2

**Already done:** ✅ Committed to faf-enterprise repo

**Steps:**
1. ✅ Replace LICENSE file
2. ✅ Update README with license info
3. ✅ Add license validation code (TODO)
4. ✅ Update package.json
5. ✅ Notify (no one yet, this is v1.0)

---

### Future License Options

**If ELv2 doesn't work:**

**Option 1: BSL 1.1** (converts to Apache 2.0 after 4 years)
- Good for: VC-backed companies with exit timeline
- Trade-off: Gives away future value

**Option 2: Fair Source** (free for <X users)
- Good for: Startups wanting goodwill
- Trade-off: Hard to enforce

**Option 3: Full Proprietary** (no source access)
- Good for: Maximum control
- Trade-off: Enterprises hate it

**Recommendation:** Stick with ELv2 unless forced to change.

---

## Summary

### Our License Strategy

```
┌──────────────────────────────────────────────┐
│ Community Edition (faf-cli)                  │
│ License: MIT                                 │
│ Features: 21 slots                           │
│ Price: FREE FOREVER                          │
│ Target: 95% of developers                    │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│ Enterprise Edition (@faf/enterprise)         │
│ License: Elastic License 2.0                 │
│ Features: 33 slots + team features           │
│ Price: $15-25/seat/month                     │
│ Target: Fortune 500, tech unicorns           │
└──────────────────────────────────────────────┘
```

### We're Like

- **GitLab** (clear split, developer trust)
- **Elasticsearch** (ELv2, prevents AWS competition)
- **HashiCorp** (infrastructure, enterprise features)

### Our Advantage

- Free tier = maximum adoption
- Enterprise tier = real features (not artificial limits)
- Source-available = customer trust
- ELv2 = proven license (Elastic, CockroachDB)

---

*FAF License Strategy - Elastic License 2.0*
*Following industry best practices - Not reinventing the wheel*
*Date: 2026-02-16*
