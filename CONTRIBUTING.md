# Contributing to @faf/enterprise

Enterprise Edition of FAF — 33-slot monorepo scoring for Fortune 500 teams.

## Before You Start

- This is **Elastic License 2.0** (source-available, not MIT)
- Read the [LICENSE](LICENSE) before contributing
- For major changes, open a discussion first

## Setup

```bash
git clone https://github.com/Wolfe-Jam/faf-enterprise.git
cd faf-enterprise
npm install
npm run build    # clean + tsc (no tests in build)
npm test         # 788 tests, 45 skip without license
```

## Development Workflow

1. **Create a branch** from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   ```

2. **Make changes** — TypeScript strict mode, zero errors

3. **Test**:
   ```bash
   npm run typecheck    # Type checking only
   npm test             # Full suite
   npm run test:brake   # Quick critical tests
   ```

4. **Commit** (pre-commit hook runs WJTTC typecheck + brake tests):
   ```
   <type>: <what changed>
   ```
   Types: `feat`, `fix`, `docs`, `test`, `refactor`, `perf`, `chore`

5. **Push and create PR** against `main`

## Code Standards

- TypeScript strict mode (non-negotiable)
- No `any` types
- Zero build errors, always
- Sub-50ms for core operations
- WJTTC testing methodology (6 tiers)

## The 33-Slot System

Enterprise extends Community Edition (21 slots) with 12 monorepo slots:

| Edition | Slots | License |
|---------|-------|---------|
| Community (faf-cli) | 21 | MIT |
| Enterprise | 33 (21 base + 12 monorepo) | ELv2 |

Enterprise backend slots use: `api_type`, `runtime`, `connection`, `build` (different from faf-cli).

## Enterprise Sync Rule

Changes to core compiler logic (`faf-compiler.ts`, scoring) **must be ported** between faf-cli and faf-enterprise. The Enterprise compiler is independent (not an npm dep).

## Testing

```bash
npm run build         # clean + tsc
npm test              # Full suite (788 tests)
npm run typecheck     # Type check only
npm run test:brake    # Critical tests only (~4s)
npm run verify        # typecheck + tests + build
```

License-gated tests (monorepo 33-slot validation) skip without `FAF_LICENSE_KEY`.

## Pull Request Process

1. All tests pass
2. TypeScript strict — zero errors
3. Fill out PR template
4. One feature or fix per PR

## License

By contributing, you agree that your contributions will be licensed under the [Elastic License 2.0](LICENSE).

---

*Built with championship standards by Wolfe James ([ORCID: 0009-0007-0801-3841](https://orcid.org/0009-0007-0801-3841))*
