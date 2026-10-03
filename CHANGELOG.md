# Changelog

All notable changes to Orbit are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.1] - 2026-10-03

### Fixed
- Restored macOS App Transport Security policy in Info.plist for native WebKit local HTTP previews (`NSAllowsArbitraryLoadsInWebContent` and `NSAllowsLocalNetworking`).
- Fixed Markdown bare URL autolink parser test regression.
- Aligned in-app update checks, star links, and release manifests directly to `soumyachk101/Orbit-Code`.
- Cleaned and updated open-source metadata, copyright attribution to Soumya Chakraborty, and hardened `.gitignore`.

## [1.2.0] - 2026-01-XX

### Added
- macOS Catalyst support for universal binary (arm64 + x86_64)
- v1.2.0 release with updated manifest for universal binary distribution

### Changed
- Distribution profile optimized (thin LTO, stripped symbols)

## [1.1.0] - 2026-01-XX

### Added
- Multi-device sync via Loro CRDT through Cloudflare Durable Objects
- Voice dictation support via Parakeet TDT 0.6B v3 (optional)
- MCP (Model Context Protocol) integration
- Local-first architecture with optional cloud sync

## [1.0.0] - 2026-01-XX

### Added
- Initial public release
- Control coding agents (Claude Code, Codex, Cursor, etc.) locally
- Native Rust desktop app with GPUI
- Markdown editor with syntax highlighting
- Terminal integration
- Multi-agent harness support

[1.2.1]: https://github.com/soumyachk101/Orbit-Code/releases/tag/v1.2.1
[1.2.0]: https://github.com/soumyachk101/Orbit-Code/releases/tag/v1.2.0
[1.1.0]: https://github.com/soumyachk101/Orbit-Code/releases/tag/v1.1.0
[1.0.0]: https://github.com/soumyachk101/Orbit-Code/releases/tag/v1.0.0
