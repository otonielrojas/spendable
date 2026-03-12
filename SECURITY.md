# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| Latest (`master`) | ✅ |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

If you discover a security vulnerability, please report it privately:

1. Go to the [Security tab](https://github.com/otonielrojas/spendable/security) on GitHub and use **"Report a vulnerability"**
2. Or email directly (contact via GitHub profile)

Please include:
- A description of the vulnerability and its potential impact
- Steps to reproduce or a proof-of-concept (if possible)
- Any suggested remediation

You will receive an acknowledgement within **48 hours** and a resolution timeline within **7 days**.

## Scope

Since Spendable is currently a client-side-only app (no backend, no user accounts, all data stored in your own browser's localStorage):

- **In scope:** XSS, dependency vulnerabilities, data leakage from the client
- **Out of scope:** Social engineering, physical attacks, issues in third-party services

## Disclosure Policy

Once a fix is deployed, the vulnerability will be disclosed in the [GitHub Security Advisories](https://github.com/otonielrojas/spendable/security/advisories) with credit to the reporter (unless they prefer to remain anonymous).
