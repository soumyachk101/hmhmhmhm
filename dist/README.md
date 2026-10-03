# Packaging

## Linux (implemented)

```sh
scripts/package-linux.sh            # release build (thin LTO, stripped)
PROFILE=debug scripts/package-linux.sh   # fast smoke package
```

Produces `target/package/orbit-<version>-linux-<arch>.tar.gz` containing:

- `orbit` — the binary (headed by default; `orbit headless` runs the engine alone)
- `orbit.desktop` — XDG desktop entry template (`Exec=orbit` for packagers;
  the installers rewrite `Exec`, `TryExec`, and `Icon` to absolute paths under
  `~/.orbit/app/current`, since `~/.local/bin` is often not on a desktop
  session's `PATH`)
- `orbit.png` — 1024×1024 Orbit app icon
- `install.sh` — installs into `~/.orbit/app/<version>` behind a `current`
  symlink (the curl installer's layout, which the in-app updater manages),
  links `~/.local/bin/orbit` to it, and writes the desktop entry and icon under
  `$XDG_DATA_HOME` (default `~/.local/share`). The curl installer does the same
  from the extracted tarball; `scripts/test-linux-desktop-entry.sh` checks both

The release profile in the root `Cargo.toml` sets `lto = "thin"` and
`strip = "symbols"` for distribution builds.

## macOS

```sh
scripts/package-macos.sh    # → target/package/orbit-<version>-macos-<arch>.dmg
```

Builds the release binary, assembles `Orbit.app` (Info.plist + icns), ad-hoc
signs it (set `CODESIGN_IDENTITY` for a real Developer ID), and wraps it in a
dmg. The auto-update tarball retains an internal `Orbit.app` path so older
installed builds can update into Orbit. CI runs this on tags
(`.github/workflows/release.yml`). The manual steps it automates, for reference
(run on a macOS host — gpui needs Metal; no cross-build from Linux):

1. Build the universal (or per-arch) binary:
   ```sh
   cargo build --release -p orbit --target aarch64-apple-darwin
   cargo build --release -p orbit --target x86_64-apple-darwin
   lipo -create -output orbit \
     target/aarch64-apple-darwin/release/orbit \
     target/x86_64-apple-darwin/release/orbit
   ```
2. Assemble the bundle:
   ```sh
   mkdir -p Orbit.app/Contents/{MacOS,Resources}
   cp orbit Orbit.app/Contents/MacOS/orbit
   sed "s/__VERSION__/$(grep -m1 '^version' Cargo.toml | sed 's/.*"\(.*\)".*/\1/')/" \
     dist/macos/Info.plist > Orbit.app/Contents/Info.plist
   ```
3. Icon: generate `orbit.icns` from `dist/macos/icon-1024.png` (the macOS-shaped
   variant of the artwork — squircle mask, margins, and shadow pre-baked, since
   `sips` can't apply an alpha mask) and place it at
   `Orbit.app/Contents/Resources/orbit.icns`:
   ```sh
   mkdir orbit.iconset && sips -z 256 256 dist/macos/icon-1024.png --out orbit.iconset/icon_256x256.png
   iconutil -c icns orbit.iconset -o Orbit.app/Contents/Resources/orbit.icns
   ```
4. Sign + notarize (required for distribution):
   ```sh
   codesign --deep --force --options runtime --sign "Developer ID Application: …" Orbit.app
   xcrun notarytool submit Orbit.zip --keychain-profile … --wait
   xcrun stapler staple Orbit.app
   ```
5. Ship as a `.dmg` (`hdiutil create -volname Orbit -srcfolder Orbit.app -ov -format UDZO Orbit.dmg`).

## Windows

```powershell
./scripts/package-windows.ps1 -ReleasesUrl https://github.com/soumyachk101/Orbit-Code/releases/latest/download
```

Produces, under `target/package/`:

- `orbit-<version>-windows-<arch>-setup.exe` — the per-user installer built
  from `dist/windows/orbit.iss` with Inno Setup 6
- `orbit-<version>-windows-<arch>.zip` — the portable package
- `orbit-<version>-windows-<arch>.exe` — the bare executable the in-app
  updater downloads

The installer and the zip both carry `orbit-update.json`, the marker that lets
the app update itself in place. CI runs `scripts/test-windows-installer.ps1`
against the setup on every Windows build.
