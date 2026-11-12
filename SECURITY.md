# Security Policy

## Supported versions

| Version | Supported |
| --- | --- |
| 1.x | ✅ |
| < 1.0 | ❌ |

The skin targets DeepSeek Harness `0.2.2-rc.1` and the `0.2.x` line declared in `engines.dsh` / `dsh.compatibility.dsh`.

## Reporting a vulnerability

Please do **not** open a public issue for a security problem.

Use GitHub's private vulnerability reporting:

<https://github.com/DawnCHL/dsh-islands-ui/security/advisories/new>

Include:

- affected package version and DSH version;
- operating system and window size;
- steps to reproduce, and the smallest HTML/CSS/JS snippet that shows the issue;
- impact: what an attacker could read, change or execute.

You should get an acknowledgement within a few days. If the report is valid, a fix and a patched npm version will be published, and the advisory will credit the reporter unless they prefer otherwise.

## Scope

Islands UI is a client-only style layer. By design it:

- does not add host tools, services or HTTP routes;
- does not read or write session, settings or credential data;
- does not make network requests;
- only injects a stylesheet and registers browser-side React components/slots.

Reports about the DeepSeek Harness itself, or about another plugin, should go to that project's security process instead. Reports about a malicious third-party theme or plugin that merely interacts with this skin are also out of scope, unless the issue is in Islands UI's own code.
