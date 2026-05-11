# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of @faf/enterprise seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### Please Do Not

- Open a public GitHub issue for security vulnerabilities
- Disclose the vulnerability publicly before we have had a chance to address it
- Exploit the vulnerability beyond what is necessary to demonstrate it

### Please Do

**Report security issues via email to: team@faf.one**

Include the following information:

- Type of issue (e.g., command injection, path traversal, arbitrary file access)
- Full paths of affected command(s)
- Version of @faf/enterprise (`faf --version`)
- Operating system and Node.js version
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact assessment

### What to Expect

1. **Acknowledgment within 24 hours** - Confirmation of receipt
2. **Initial assessment within 72 hours** - Our evaluation
3. **Regular updates** - Progress reports as we develop fixes
4. **Coordinated disclosure** - Work together on disclosure timing
5. **Credit** - Acknowledgment in security advisory (unless you prefer anonymity)

### Our Commitment

- Respond promptly to your report
- Keep you informed of progress
- Treat your report confidentially
- Credit you for responsible disclosure (if desired)
- Issue a fix as quickly as possible

## Security Best Practices

When using @faf/enterprise:

### For Users

- Install only from official sources:
  ```bash
  npm install @faf/enterprise  # Official npm registry
  ```
- Verify package integrity when possible
- Keep @faf/enterprise updated to latest version
- Review file paths when using file operations
- Be cautious with untrusted .faf files
- Use appropriate file permissions for sensitive projects
- Store license keys securely (environment variables or `.env` files)

### For Contributors

- Follow secure coding practices
- Never commit sensitive data (API keys, tokens, credentials, license keys)
- Validate all user inputs
- Sanitize file paths
- Use environment variables for configuration
- Run security audits before submitting PRs:
  ```bash
  npm audit --omit=dev
  npm run build
  npm test
  ```

## Known Security Considerations

### File System Access

@faf/enterprise requires filesystem access for its core functionality:

**What @faf/enterprise accesses**:
- Project root directory (for .faf files)
- Files specified in commands
- User's home directory for global config and license cache (optional)

**Security measures**:
- Path validation to prevent directory traversal
- Read-only operations by default (except explicit write commands)
- No arbitrary code execution
- User consent required for modifications

### License Validation

@faf/enterprise uses JWT-based license validation:
- RSA-SHA256 signature verification
- License keys are validated locally (no phone-home)
- Grace period handling for expired licenses
- License data never transmitted externally

### Command Injection

@faf/enterprise does NOT:
- Execute shell commands from .faf files
- Run arbitrary code from user input
- Eval or interpret code from file contents

All operations are pure data processing.

### YAML Parsing

@faf/enterprise uses safe YAML parsing:
- Disables dangerous YAML features
- No custom tag evaluation
- No arbitrary object instantiation
- Strict schema validation

### Input Validation

All user inputs are validated with path traversal protection and scoped file access.

## Vulnerability Response Process

Our typical timeline:

1. **Day 0**: Report received
2. **Day 1**: Acknowledgment sent
3. **Day 3**: Initial assessment completed
4. **Day 7-30**: Fix developed and tested
5. **Day 30**: Coordinated disclosure
6. **Day 90**: Public disclosure if fix is delayed

Critical vulnerabilities receive immediate attention.

## Security Updates

- Security updates released as soon as fixes are available
- Critical vulnerabilities marked in release notes
- All security updates documented in CHANGELOG.md

## Dependencies

@faf/enterprise maintains minimal dependencies:

**Current dependencies** (see package.json for versions):
- @anthropic-ai/sdk (AI integration)
- commander (CLI framework)
- inquirer (interactive prompts)
- yaml (safe YAML parsing)

**Security practices**:
- Regular dependency audits (`npm audit --omit=dev`)
- Automated security updates via Dependabot
- Review all dependency updates for security implications
- No deprecated or unmaintained dependencies

## Common Vulnerabilities - Status

| Vulnerability Type | Status | Notes |
|-------------------|--------|-------|
| Command Injection | Protected | No shell command execution |
| Path Traversal | Protected | Path validation on all operations |
| Arbitrary File Access | Protected | Scoped to project directory |
| Code Injection | Protected | No code evaluation |
| YAML Bombs | Protected | Safe parsing, size limits |
| Dependency Vulnerabilities | Monitored | Automated scanning |

## Contact

- **Security issues**: team@faf.one
- **General questions**: [GitHub Discussions](https://github.com/Wolfe-Jam/faf-enterprise/discussions)
- **Project maintainer**: Wolfe James ([ORCID: 0009-0007-0801-3841](https://orcid.org/0009-0007-0801-3841))

## Audit History

- **v1.0.0**: Initial security review completed
- **Continuous**: Automated npm audit checks

---

**Last updated**: February 2026

Thank you for helping keep @faf/enterprise and its users safe.

**Championship security standards.**
