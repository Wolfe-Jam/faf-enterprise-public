# 🔄 Migrating to FAF Enterprise Edition

**Upgrade from Community (21 slots) to Enterprise (33 slots)**

---

## Before You Start

### Prerequisites
- Active Enterprise license key
- Node.js 18+ or 20+
- Existing monorepo (Turborepo, Nx, Lerna, Rush, pnpm, Yarn)
- (Optional) Existing project.faf from Community Edition

### What Changes?
- ✅ 21 slots → 33 slots automatically
- ✅ Monorepo support activated
- ✅ Existing .faf files work without modification
- ✅ Backward compatible with Community Edition
- ✅ No breaking changes to format

---

## Migration Steps

### Step 1: Uninstall Community Edition

```bash
# If you have faf-cli installed globally
npm uninstall -g faf-cli

# Verify removal
faf --version  # Should error: command not found
```

### Step 2: Install Enterprise Edition

```bash
# Install from private registry (license holders only)
npm install -g @faf/enterprise

# OR: Install from tarball (provided with license)
npm install -g faf-enterprise-1.0.0.tgz

# Verify installation
faf --version
# FAF Enterprise Edition v1.0.0
```

### Step 3: Activate License

```bash
# Activate with license key
faf enterprise activate <your-license-key>

# ✅ License activated successfully
# Edition: FAF Enterprise
# Tier: Business
# Seats: 25
# Expires: 2027-02-16
```

### Step 4: Verify Enterprise Features

```bash
# Check enterprise status
faf enterprise status

# ✅ FAF Enterprise Edition
# License: Active
# Features:
#   - Mk3.3 Compiler (33 slots)
#   - Monorepo support (Turborepo, Nx, Lerna, Rush, pnpm, Yarn)
#   - Priority support
```

### Step 5: Test Your Monorepo

```bash
cd /path/to/your/monorepo

# Score with Enterprise Edition (33 slots)
faf score

# Expected output:
# Score: 88% (29/33 slots) 🥉 BRONZE
# Type: Turborepo monorepo
# Packages: 12 detected
# Monorepo slots: 12 available (7 filled)
```

---

## Updating Existing .faf Files

### No Changes Required

Your existing `project.faf` files work immediately with Enterprise Edition:

```yaml
# This Community Edition .faf
faf_version: 4.0.0
project:
  name: my-app
  goal: Simple app
  main_language: typescript

# Automatically gets 21-slot scoring in Enterprise
# (because it's not a monorepo)
```

### Adding Monorepo Metadata

To unlock 33-slot scoring, add monorepo fields:

```yaml
# Enhanced for Enterprise Edition
faf_version: 4.0.0
project:
  name: my-monorepo
  goal: E-commerce platform
  main_language: typescript
  type: turborepo  # Triggers 33 slots

stack:
  monorepo_tool: turborepo
  package_manager: pnpm
  workspaces:
    - apps/web
    - apps/api
    - packages/ui
  frontend: nextjs
  backend: fastify

monorepo:
  packages_count: 6
  build_orchestrator: turbo.json
  versioning_strategy: changesets
  shared_configs:
    - tsconfig.base.json
    - turbo.json
  remote_cache: vercel

# Now scores with 33 slots!
```

### Using `faf init` for Monorepos

```bash
# Enterprise Edition auto-detects monorepos
cd /path/to/turborepo
faf init

# ✅ Detected: Turborepo monorepo
# ✅ Workspaces found: 6
# ✅ Generated 33-slot project.faf
```

---

## Team Migration

### Centralized License (Recommended)

```bash
# Set license key as environment variable
export FAF_LICENSE_KEY="<your-enterprise-key>"

# Add to team's .bashrc/.zshrc
echo 'export FAF_LICENSE_KEY="<key>"' >> ~/.zshrc

# Team members install
npm install -g @faf/enterprise

# Auto-activates from environment variable
faf enterprise status
# ✅ License active (via FAF_LICENSE_KEY)
```

### Individual Activation

```bash
# Each team member activates individually
faf enterprise activate <shared-license-key>

# Check seat usage
faf enterprise seats
# Seats used: 12/25
# Available: 13
```

### CI/CD Integration

```yaml
# GitHub Actions
name: FAF Enterprise CI
on: [push]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Install FAF Enterprise
        run: npm install -g @faf/enterprise

      - name: Activate License
        env:
          FAF_LICENSE_KEY: ${{ secrets.FAF_LICENSE_KEY }}
        run: faf enterprise activate $FAF_LICENSE_KEY

      - name: Score Monorepo
        run: faf score
```

---

## Rollback to Community Edition

If you need to rollback:

```bash
# 1. Deactivate Enterprise license
faf enterprise deactivate

# 2. Uninstall Enterprise
npm uninstall -g @faf/enterprise

# 3. Reinstall Community Edition
npm install -g faf-cli

# 4. Verify
faf --version
# FAF CLI v4.4.1 (Community Edition)

# Your .faf files still work (with 21-slot scoring)
```

**Note:** Monorepo-specific fields (33 slots) will be ignored by Community Edition.

---

## Troubleshooting

### License Activation Failed

```bash
# Error: Invalid license key
faf enterprise activate <key>

# Solutions:
# 1. Check license key format (no extra spaces)
# 2. Verify license hasn't expired
# 3. Contact: enterprise@faf.one
```

### Enterprise Features Not Working

```bash
# Check enterprise status
faf enterprise status

# If license is inactive:
faf enterprise activate <key>

# If still issues:
faf enterprise diagnose
# Runs diagnostics and provides troubleshooting steps
```

### Scoring Still Shows 21 Slots

```bash
# Verify monorepo detected
faf score --verbose

# If not detected:
# 1. Add `type: monorepo` to project.faf
# 2. OR add `stack.monorepo_tool: turborepo`
# 3. OR add `stack.workspaces: [...]`

# Force monorepo type
faf score --type monorepo
```

### License Expiry

```bash
# Check license expiry
faf enterprise status
# License expires: 2027-02-16

# Renew license:
# 1. Contact sales@faf.one
# 2. Receive new license key
# 3. Reactivate:
faf enterprise activate <new-key>
```

---

## Support

### During Migration

**Enterprise Support:**
- Email: enterprise@faf.one
- Slack: #enterprise-migration
- Response time: < 4 hours (business hours)

### After Migration

**Ongoing Support:**
- Documentation: https://enterprise.faf.one
- API Reference: https://enterprise.faf.one/api
- GitHub Issues: Private enterprise repo
- Priority support: enterprise@faf.one

---

## Checklist

Use this checklist for team migration:

### Pre-Migration
- [ ] Enterprise license key received
- [ ] Team notified of upgrade
- [ ] License key added to secrets (CI/CD)
- [ ] Backup existing .faf files (optional)

### Migration
- [ ] Uninstall Community Edition
- [ ] Install Enterprise Edition
- [ ] Activate license
- [ ] Verify 33-slot scoring
- [ ] Test all monorepo packages
- [ ] Update CI/CD pipelines

### Post-Migration
- [ ] Team members activated
- [ ] Documentation updated
- [ ] Monorepo metadata added to .faf
- [ ] Slack channel joined (#enterprise)
- [ ] First enterprise support ticket tested

---

## FAQ

**Q: Do I need to modify my .faf files?**
A: No, existing files work without changes. Add monorepo fields to unlock 33 slots.

**Q: Can I use both editions?**
A: Not simultaneously. Choose Community (21 slots) OR Enterprise (33 slots).

**Q: What happens when license expires?**
A: Graceful fallback to 21-slot scoring (like Community Edition).

**Q: Can I transfer my license?**
A: No, licenses are non-transferable. Contact sales for team changes.

**Q: Is there a migration tool?**
A: Not needed. Enterprise Edition is backward compatible.

---

## Next Steps

After migration:
1. **Optimize your .faf:** Add all 12 monorepo slots
2. **Team onboarding:** Share enterprise docs with team
3. **Integrate CI/CD:** Add FAF scoring to pipelines
4. **Explore v1.1 features:** Team workspaces (coming soon)

**Need help?** enterprise@faf.one

---

*FAF Enterprise Edition - Migration Guide*
*Upgrade to 33 slots in 5 minutes* 🚀
