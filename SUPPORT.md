# Getting Support

Thank you for using @faf/enterprise. This document explains how to get help with the Enterprise Edition of FAF.

## Documentation

Before seeking help, check our documentation:

- **README.md** - Installation, commands, quick start
- **docs/ENTERPRISE.md** - Enterprise-specific guide
- **faf.one** - Official website with guides
- **CHANGELOG.md** - Version history and updates
- **Command help** - Run `faf help` or `faf <command> --help`

## Quick Help

Get help directly in terminal:

```bash
# General help
faf --help

# Command-specific help
faf init --help
faf score --help
faf enterprise --help

# Version info
faf --version

# Enterprise license status
faf enterprise status
```

## Common Issues

### Installation Problems

**Issue**: `command not found: faf`

**Solution**: Ensure install completed:
```bash
npm install @faf/enterprise
which faf  # Should show path to faf binary
```

**Issue**: Permission denied during install

**Solution**: Use correct permissions:
```bash
# macOS/Linux
sudo npm install -g @faf/enterprise

# Or use npm prefix to install without sudo
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH
npm install -g @faf/enterprise
```

**Issue**: Old version installed

**Solution**: Update to latest:
```bash
npm update @faf/enterprise
faf --version  # Verify updated
```

### License Issues

**Issue**: Enterprise features not available

**Solution**: Activate your license:
```bash
# Check current status
faf enterprise status

# Activate with key
faf enterprise activate <your-license-key>

# Or use environment variable
export FAF_LICENSE_KEY="<your-license-key>"
```

**Issue**: License expired

**Solution**: Contact team@faf.one for renewal. Enterprise licenses include a 7-day grace period after expiration.

### Command Issues

**Issue**: `faf init` not generating .faf file

**Solution**:
```bash
# Ensure you're in project root
pwd

# Check permissions
ls -la

# Try with verbose output
faf init --verbose
```

**Issue**: Low context scores (below 85%)

**Solution**:
```bash
# Check what's missing
faf status

# Run guided interview
faf go

# Check score again
faf score
```

### Sync Issues

**Issue**: `faf sync` not working

**Solution**:
```bash
# Verify .faf file exists and is valid
faf read project.faf

# Check CLAUDE.md location
ls CLAUDE.md

# Try bi-directional sync
faf bi-sync

# Check sync status
faf status --sync
```

## Getting Help

### GitHub Issues

For bugs and feature requests:

[github.com/Wolfe-Jam/faf-enterprise/issues](https://github.com/Wolfe-Jam/faf-enterprise/issues)

**For bugs, include**:
- @faf/enterprise version (`faf --version`)
- Operating system and version
- Node.js version (`node --version`)
- Command that failed
- Full error message
- Expected vs actual behavior
- License tier (enterprise/team)

### GitHub Discussions

For questions and community support:

[github.com/Wolfe-Jam/faf-enterprise/discussions](https://github.com/Wolfe-Jam/faf-enterprise/discussions)

**Use discussions for**:
- "How do I...?" questions
- Best practices for monorepo scoring
- Tips for 33-slot optimization
- Sharing your workflows
- General feedback

### Email Support

For private inquiries:

**team@faf.one**

Allow 1-3 business days for response.

**Use email for**:
- Security issues (see [SECURITY.md](SECURITY.md))
- License inquiries and renewals
- Partnership inquiries
- Private matters

**Do not use email for**:
- General questions (use discussions)
- Bug reports (use issues)
- Feature requests (use issues)

## Self-Help Resources

### Debug Mode

Enable verbose logging:
```bash
# Set debug mode
export DEBUG=faf:*

# Run command
faf score

# Or inline
DEBUG=faf:* faf score
```

### Check Installation Health

```bash
# Verify installation
npm list @faf/enterprise

# Check for updates
npm outdated @faf/enterprise

# Reinstall if needed
npm uninstall @faf/enterprise
npm install @faf/enterprise

# Verify working
faf --version
faf help
```

## Command Reference

### Core Commands

```bash
faf init          # Initialize .faf file
faf auto          # Auto-detect and populate
faf score         # Calculate AI readiness
faf status        # Project health check
faf go            # Guided interview to 100%
```

### Enterprise Commands

```bash
faf enterprise status     # License status
faf enterprise activate   # Activate license
faf enterprise info       # Detailed info
```

### Sync Commands

```bash
faf sync          # Sync files
faf bi-sync       # Bidirectional sync
```

## Version Support

- **Current version (1.x)**: Full support
- **Enterprise license holders**: Priority support

Always update to latest:
```bash
npm update @faf/enterprise
```

## Community Guidelines

When seeking help:

- Be respectful and patient
- Provide clear, detailed information
- Include version numbers and system info
- Share full error messages
- Follow up if you solve your issue
- Help others when you can

## Contributing

Want to help improve @faf/enterprise?

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## Related Projects

- **faf-cli** - Community Edition ([github.com/Wolfe-Jam/faf-cli](https://github.com/Wolfe-Jam/faf-cli))
- **claude-faf-mcp** - Claude Desktop integration ([github.com/Wolfe-Jam/claude-faf-mcp](https://github.com/Wolfe-Jam/claude-faf-mcp))

## Response Times

Expected response times:

- **Critical bugs**: 24-48 hours
- **Bug reports**: 2-5 business days
- **Feature requests**: Reviewed in planning cycles
- **License issues**: 24 hours (priority for enterprise customers)
- **Email**: 1-3 business days

## License

@faf/enterprise is licensed under the Elastic License 2.0. See [LICENSE](LICENSE) for details.

---

**Project created by Wolfe James**
ORCID: [0009-0007-0801-3841](https://orcid.org/0009-0007-0801-3841)

*Built with championship standards by the wolfejam.dev team*
