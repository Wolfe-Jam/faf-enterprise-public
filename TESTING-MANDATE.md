# FAF Enterprise Testing Mandate 🚀

**Rocket Science-Grade Quality Standards**

## Philosophy

> "When SpaceX launches rockets, tests aren't optional. When we ship code, they aren't either."

FAF Enterprise follows **WJTTC (WolfeJam Technical Testing Certification)** methodology - the same rigor applied to systems where failure isn't an option.

## The Mandate

### 1. No Code Ships Without Tests

**ABSOLUTE RULES:**
- ❌ No merge without tests
- ❌ No build without passing tests
- ❌ No deploy without 100% test pass rate
- ❌ No exceptions, no shortcuts

**ENFORCEMENT:**
- Build fails if tests fail
- Pre-commit hooks block untested code
- Pre-publish checks require tests
- Manual override: PROHIBITED (except emergency with --no-verify)

### 2. WJTTC Test Tiers (Mandatory)

Every feature MUST have tests across all three tiers:

#### 🔴 Brake Tests (Must Never Fail)
**Purpose:** Critical paths that prevent catastrophic failure

**Requirements:**
- System initializes without errors
- Core operations complete successfully
- Data integrity maintained
- No crashes under normal operation

**Rocket Science Parallel:** "Engines must ignite. Absolutely. No exceptions."

#### ⚙️ Engine Tests (Core Functionality)
**Purpose:** Verify every feature works correctly

**Requirements:**
- All inputs produce correct outputs
- Edge cases handled properly
- Error handling works
- Integration points verified

**Rocket Science Parallel:** "Every system performs as designed. Period."

#### 🏎️ Aero Tests (Performance)
**Purpose:** Championship speed maintained

**Requirements:**
- Performance targets met (<500ms for standard operations)
- No performance regression
- Resource usage acceptable
- Scalability verified

**Rocket Science Parallel:** "Speed matters. Precision matters. Both, always."

### 3. Test Coverage Requirements

**Minimum Coverage by Tier:**
```
🔴 Brake:   100% coverage (no exceptions)
⚙️ Engine:  95% coverage minimum
🏎️ Aero:   Performance benchmarks for all critical paths
```

### 4. Enforcement Mechanisms

1. **TypeScript Strict Mode** - Catches errors at compile time
2. **Build Scripts** - Tests run before build
3. **Pre-Commit Hooks** - Tests run before commit
4. **Pre-Publish Check** - Tests run before package
5. **Code Review** - PRs without tests: REJECTED

## Adding New Features

### Mandatory Process

1. **Write Tests FIRST**
   - Define success criteria
   - Write Brake tests (must never fail)
   - Write Engine tests (functionality)
   - Write Aero tests (performance)

2. **Implement Feature**
   - Make tests pass
   - Zero TypeScript errors
   - Meet performance targets

3. **Document Tests**
   - Create WJTTC-[FEATURE].md if complex
   - Explain tiers in test file comments

4. **Verify**
   - All tests passing
   - Coverage ≥95%
   - Performance targets met

5. **Commit**
   - Pre-commit hook enforces tests
   - Build includes test run
   - No bypass allowed

## The SpaceX Standard

> "When a rocket fails, people die. When our code fails, enterprises fail."

**We hold ourselves to rocket science standards:**
- ✅ Test everything
- ✅ Document everything
- ✅ Measure everything
- ✅ Never compromise
- ✅ Championship or nothing

## Quick Reference

### Commands
```bash
# Build (runs typecheck + tests + compile)
npm run build

# Build without tests (development only)
npm run build:skip-tests

# Run tests only
npm test

# Run tests with WJTTC certification
npm run test:wjttc

# Full verification
npm run verify

# Install pre-commit hook
cp .githooks/pre-commit .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

### Emergency Override
```bash
# ONLY for production emergencies
git commit --no-verify -m "emergency: production down"
```

**⚠️ WARNING:**
- Use ONLY for production emergencies
- Must be followed by proper fix + tests
- Document reason in commit message

---

*"Test like lives depend on it. Code like it does."* - FAF Enterprise

**Status:** 🚀 Rocket Science Grade
**Tests:** 833 total (788 passing, 44 skipped*, 0 failing)
**Coverage:** Brake 100% | Engine 95%+ | Aero benchmarked
**Enforcement:** 4-layer (build, pre-commit, pre-publish, TypeScript)

**\*44 skipped:** Enterprise license-gated monorepo tests (33-slot validation, Turborepo/Nx/Lerna/Rush/pnpm/Yarn detection). Skipped in CI/CD without license - expected behavior. Run locally with: `export FAF_LICENSE_KEY="<test-license>"`
