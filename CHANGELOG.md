# Changelog

All notable changes to this extension are documented here.
Format follows Keep a Changelog. Dates are UTC.

## [0.1.0] - 2026-10-18

Beta release. Solidity only. Other languages are gated off.

### Added

- LSP client: activate on solidity, stdio spawn, restart on config change.
- Settings: serverPath, serverVersion, autoDownload, trace, language toggles.
- Server binary auto download from GitHub releases with progress.
- Solidity TextMate grammar and auto closing pairs.
- Diagnostics, hover, completion, and definition passthrough.
- Extension host integration tests and fixture workspace.

### Notes

- Cairo, Noir, and Move stay off until the server reports support.
- Lint and format remain separate future modules.
