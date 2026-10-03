# Orbit

Control your coding agents (Claude Code, Codex, Cursor, Devin, Grok, Hermes, Pi, Antigravity) locally by default, with optional multi-device sync.

*English | [简体中文](README.zh-CN.md)*

![Orbit driving a Claude Code session with a live branch diff sidebar](website/public/assets/app-screenshot.jpg)

Every device runs a small engine that stores sessions on that device. A new installation starts in local-only mode without an account or a network connection.

## Install and run locally (Linux)

```bash
curl -fsSL https://orbit.sh/install.sh | sh
orbit status
```

The installer starts the daemon immediately and keeps it running across reboots. No sign-in or sync configuration is required. It also adds Orbit to your application launcher: a per-user `orbit.desktop` and icon under `~/.local/share` (or `$XDG_DATA_HOME`), rewritten each time the installer runs. Linux requires the system ALSA runtime (`libasound.so.2`), including for headless mode because it shares the desktop executable. The installer checks that the binary starts before activating it and reports missing runtime libraries.

The desktop sidebar browser also needs the [Linux browser runtime](docs/reference/linux-browser.md).

Day-to-day:

```bash
orbit status      # local/synced mode and engine status
orbit update      # update to the latest release
orbit daemon start|stop|restart|status
```

## Optional multi-device sync

Sign in only when you want to open your account's synced workspace. Authentication changes the profile selected by the next engine start, so stop the daemon before changing it:

```bash
orbit daemon stop
orbit login
orbit daemon start
```

You can then start an agent on one synced device and follow or drive it from another. An always-on machine such as a VPS can keep those agents working after you close your laptop.

Devices signed in to the same synced account are trusted with remote workspace access. A device controlling a workspace on another device can list, read, and write its files; enabling `Show ignored files` also makes gitignored files such as `.env` available remotely. `.git` is always excluded. Only sign in devices you trust with the full contents of your workspaces.

Signing in does not upload, move, or import existing local sessions. Local sessions and their attachments remain under the local profile and reappear when you return to local-only mode:

```bash
orbit daemon stop
orbit logout
orbit daemon start
```

`orbit login` and `orbit logout` refuse to modify credentials while an engine owns the data directory. The desktop app follows the same next-restart profile boundary.

On macOS: use the desktop release, or build `orbit` from source and run `orbit daemon install` to install the launchd service.

On Windows: run the `orbit-<version>-windows-x86_64-setup.exe` installer from the [latest release](https://github.com/soumyachk101/OrbitCode-Release/releases/latest). It installs for your user without administrator rights, adds Orbit to the Start menu, and appears in Settings → Apps for uninstalling. A portable ZIP is also published; keep `orbit-update.json` beside `orbit.exe` for in-app updates. See the [development notes](docs/reference/windows-development.md) for source builds.

## Updates

The desktop app checks for a new release when it starts, every hour while it runs, and when you come back to it after the machine slept. A new version downloads in the background; the sidebar then offers **Update ready — restart to apply**, and if you don't restart, it installs the next time you quit Orbit. Check by hand with **Orbit → Check for Updates…** on macOS, or **Check for updates** in the account menu (bottom of the sidebar) on Windows and Linux. Set `ORBIT_AUTO_UPDATE=0` to be notified without the background download.

Linux desktop installs from the release tarball's `install.sh` use the same `~/.orbit/app` layout as the curl installer, so they update in place too. A daemon installed as a service restarts into a newer installed version once no agent run or terminal is active; `orbit update` updates headless installs on demand.

## Sponsors

Thank you to [The Context Company](https://www.thecontextcompany.com/) for sponsoring Orbit.

---

Developing or curious how it works? Check out [ARCHITECTURE.md](ARCHITECTURE.md).

Licensed under the [MIT License](LICENSE).
