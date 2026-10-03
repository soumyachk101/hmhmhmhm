# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.2.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

Please report security vulnerabilities privately — do not open a public issue.

- **GitHub Security Advisory:** Use the "Security" tab on GitHub to privately report a vulnerability
- **Email:** soumya.chk101@gmail.com (security-only, monitored weekly)

We will acknowledge your report within 48 hours and provide a detailed response within 7 days, including a timeline for a fix.

## Security Best Practices for Contributors

- Never commit secrets, tokens, or credentials (even in fixtures or test data)
- All credential handling goes through the redaction layer in `crates/harness/src/redact.rs`
- Network calls use HTTPS and validate certificates
- Process spawning sanitizes all inputs
- OAuth tokens are stored in the system keychain, never in plaintext

## Dependency Security

We monitor dependencies for known vulnerabilities via CI. See `.github/workflows/` for the audit pipeline.
