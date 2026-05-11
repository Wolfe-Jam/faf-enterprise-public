# 🔐 Enterprise License Integration

**Status:** ✅ **COMPLETE** (2026-02-16)

---

## What We Built

Complete enterprise licensing system with JWT-based validation, CLI activation, and compiler integration.

### Components

| Component | Path | Purpose |
|-----------|------|---------|
| **License Validator** | `src/enterprise/license-validator.ts` | JWT validation, signature verification, expiry checking |
| **Enterprise CLI** | `src/commands/enterprise.ts` | `faf enterprise` commands (activate, status, info) |
| **Compiler Integration** | `src/compiler/faf-compiler.ts` | License check before 33-slot scoring |
| **Test License Generator** | `scripts/generate-test-license.ts` | Generate test licenses for development |

---

## How It Works

### 1. License Format (JWT)

**Structure:** `header.payload.signature` (base64url encoded)

**Payload:**
```json
{
  "customer": "Company Name",
  "email": "contact@company.com",
  "tier": "starter" | "business" | "enterprise",
  "seats": 10,
  "issuedAt": 1771268674,    // Unix timestamp
  "expiresAt": 1802804674,   // Unix timestamp
  "features": {
    "monorepo": true,
    "teamFeatures": true,
    "sso": false,
    "prioritySupport": true
  },
  "version": "1.0.0",
  "licenseId": "FAF-2026-XXXX"
}
```

**Signature:** RSA-SHA256 (2048-bit key)

---

### 2. License Sources (Priority Order)

1. **faf-enterprise.license file** (recommended)
   - Created by `faf enterprise activate <key>`
   - Located in project root

2. **FAF_LICENSE_KEY environment variable**
   - Set in shell: `export FAF_LICENSE_KEY="<jwt>"`
   - Good for CI/CD pipelines

3. **FAF_LICENSE_FILE path**
   - Custom file location: `export FAF_LICENSE_FILE="/path/to/license"`

---

### 3. CLI Commands

#### Check License Status
```bash
faf enterprise
faf enterprise status
```

**Output (no license):**
```
🏢 FAF Enterprise Edition - License Status

❌ No valid license found

Reasons:
   No license found. Set FAF_LICENSE_KEY or create faf-enterprise.license file.

How to activate:
   1. faf enterprise activate <license-key>
   2. Set FAF_LICENSE_KEY environment variable
   3. Create faf-enterprise.license file

Get a license: https://faf.one/enterprise
```

**Output (valid license):**
```
🏢 FAF Enterprise Edition - License Status

✅ Enterprise Edition Activated

License Details:
   Customer:  Test Company
   Email:     test@example.com
   Tier:      enterprise
   Seats:     10
   Expires:   2/16/2027 (365 days)

Features:
   Monorepo Support:    ✅
   Team Features:       ✅
   SSO/SAML:            ❌
   Priority Support:    ✅
```

#### Activate License
```bash
faf enterprise activate <license-key>
```

**Creates:** `faf-enterprise.license` in current directory

#### Detailed Information
```bash
faf enterprise info
```

Shows:
- Customer information
- Subscription details
- Feature breakdown
- Support contacts

---

### 4. Compiler Integration

**Location:** `src/compiler/faf-compiler.ts` → `buildIR()` function

**Flow:**
```typescript
1. Detect project type (e.g., "turborepo")
2. Check if type is monorepo (33 slots)
3. If monorepo:
   a. Validate license (synchronous check)
   b. If VALID: Proceed with 33-slot scoring ✅
   c. If INVALID: Fall back to "library" (9 slots) ⚠️
4. Generate score based on allowed slots
```

**Monorepo Types (Require License):**
- `monorepo`
- `turborepo`
- `nx`
- `lerna`
- `pnpm-workspace`
- `yarn-workspace`

**Fallback Type (No License):**
- `library` (9 slots: project + human)

---

### 5. Validation Logic

**Checks Performed:**
1. **Format:** JWT with 3 parts (header.payload.signature)
2. **Signature:** RSA-SHA256 verification (if public key provided)
3. **Expiry:** Current time < expiresAt + gracePeriod (7 days default)
4. **Parsing:** Valid JSON payload

**Grace Period:**
- Default: 7 days after expiry
- Configurable in `LicenseValidator` constructor
- Allows time for renewal without service interruption

---

## Testing

### Generate Test License

```bash
npx ts-node scripts/generate-test-license.ts
```

**Output:**
- License key (JWT)
- Public key (for signature verification)
- Customer details
- Usage instructions

### Test With License (33 slots)

```bash
export FAF_LICENSE_KEY="<generated-jwt>"
node dist/cli.js score tests/fixtures/monorepo/yarn-fullstack.faf
```

**Expected:** `Filled: 33/33 slots` ✅

### Test Without License (Fallback)

```bash
unset FAF_LICENSE_KEY
node dist/cli.js score tests/fixtures/monorepo/yarn-fullstack.faf
```

**Expected:** `Filled: 9/9 slots` (library fallback) ✅

---

## Validation Options (4 Approaches)

### Option 1: License File (Offline) ✅ **IMPLEMENTED**

**How it works:**
- License stored locally as JWT
- No network required
- Signature verification (if public key embedded)

**Pros:**
- ✅ Works offline
- ✅ Fast (no network latency)
- ✅ Simple for customers
- ✅ Good for air-gapped environments

**Cons:**
- ❌ Can be copied/shared (mitigated by signature)
- ❌ No automatic revocation

**Used by:** GitLab, Elasticsearch, HashiCorp

**Recommended for:** FAF Enterprise v1.0

---

### Option 2: Phone Home (Online)

**How it works:**
- CLI calls license server on every run
- Server validates license in real-time

**Pros:**
- ✅ Real-time revocation
- ✅ Usage analytics
- ✅ Harder to pirate

**Cons:**
- ❌ Requires internet
- ❌ Latency on every command
- ❌ Privacy concerns

**Used by:** Adobe, Microsoft

---

### Option 3: Hybrid (Offline + Periodic Check)

**How it works:**
- License file validates locally
- Periodic (weekly) phone-home check
- Non-blocking telemetry

**Pros:**
- ✅ Works offline most of the time
- ✅ Can revoke licenses eventually
- ✅ Usage analytics (opt-in)

**Cons:**
- ❌ More complex
- ❌ Can work offline during grace period

**Used by:** JetBrains, Atlassian

**Recommended for:** FAF Enterprise v1.1+ (Phase 2)

---

### Option 4: Environment Variable

**How it works:**
- License key in `FAF_LICENSE_KEY`
- No file creation needed

**Pros:**
- ✅ CI/CD friendly
- ✅ No file system access needed

**Cons:**
- ❌ Less discoverable
- ❌ Can leak in logs

**Used by:** Many CLI tools

**Recommended for:** Secondary option (already implemented)

---

## Current Implementation

**Phase 1: Offline Validation** ✅ **COMPLETE**

- JWT-based license keys
- Local file or environment variable
- Optional signature verification
- Grace period (7 days)
- No telemetry

**Phase 2: Optional Telemetry** (Future)

- Non-blocking usage reporting
- `telemetry.faf.one/usage`
- Disabled by default
- Opt-in via config

---

## Security Notes

### Private Key Management

**For Production:**
1. Generate RSA key pair securely
2. **NEVER** commit private key to git
3. Store private key in secure vault (1Password, AWS Secrets Manager)
4. Embed public key in compiler for signature verification

### Test License

The `scripts/generate-test-license.ts` generates:
- New RSA key pair each time
- Test licenses valid for 1 year
- Not suitable for production

**Production license generation:**
- Use single permanent key pair
- Store private key securely
- Automate license issuance (server-side)

---

## Next Steps

### Before v1.0 Release

- [ ] Generate production RSA key pair
- [ ] Embed public key in compiler
- [ ] Create license generation server/tool
- [ ] Test with real monorepo projects
- [ ] Document customer activation flow
- [ ] Add to README and ENTERPRISE.md

### Phase 2 (v1.1+)

- [ ] Optional telemetry (non-blocking)
- [ ] License renewal reminders (30 days before expiry)
- [ ] Team seat usage tracking
- [ ] License transfer workflow

---

## Files Created

| File | Purpose | Status |
|------|---------|--------|
| `src/enterprise/license-validator.ts` | Core validation logic | ✅ Complete |
| `src/commands/enterprise.ts` | CLI commands | ✅ Complete |
| `src/compiler/faf-compiler.ts` | Integration (lines 1-30) | ✅ Complete |
| `scripts/generate-test-license.ts` | Test license generator | ✅ Complete |
| `docs/LICENSE-STRATEGY.md` | Strategy overview | ✅ Complete |
| `docs/LICENSE-INTEGRATION.md` | This file | ✅ Complete |

---

## Verification

**Test Results:**

✅ License validator compiles
✅ Enterprise CLI commands work
✅ Status shows "no license" correctly
✅ Test license generates successfully
✅ Status shows "valid license" with FAF_LICENSE_KEY
✅ Monorepo scoring: 33/33 slots WITH license
✅ Monorepo scoring: 9/9 slots WITHOUT license
✅ Signature verification works
✅ Expiry checking works
✅ Grace period works

---

## Example Usage

### Customer Workflow

```bash
# 1. Receive license key from sales
export LICENSE_KEY="eyJhbGci..."

# 2. Activate
faf enterprise activate $LICENSE_KEY

# 3. Verify
faf enterprise status

# 4. Use monorepo features
faf score  # Now scores 33 slots for monorepos

# 5. Check license anytime
faf enterprise info
```

### CI/CD Workflow

```yaml
# .github/workflows/build.yml
env:
  FAF_LICENSE_KEY: ${{ secrets.FAF_LICENSE_KEY }}

steps:
  - run: faf score  # Uses license from env var
```

---

*License Integration Complete - 2026-02-16*
*FAF Enterprise Edition v1.0.0*
*Championship-Grade Licensing* 🏎️
