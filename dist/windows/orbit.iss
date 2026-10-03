; Orbit for Windows — per-user installer (Inno Setup 6).
;
; Built by scripts/package-windows.ps1, which passes the version, the package
; architecture, and the staged portable directory:
;   ISCC.exe /DAppVersion=1.1.1 /DArch=x86_64 /DPackageDir=<stage> /DOutputDir=<out> orbit.iss
;
; Installs into %LOCALAPPDATA%\Programs\Orbit without elevation, like VS
; Code's user setup: the directory stays writable by its user, so the in-app
; updater (crates/update/src/windows.rs) can replace orbit.exe in place. The
; staged directory already carries orbit-update.json, which marks the install
; as update-managed. Re-running a newer installer upgrades in place; user data
; lives in %LOCALAPPDATA%\Orbit and is never touched here.

#ifndef AppVersion
  #error AppVersion must be defined (/DAppVersion=x.y.z)
#endif
#ifndef Arch
  #error Arch must be defined (/DArch=x86_64 or /DArch=aarch64)
#endif
#ifndef PackageDir
  #error PackageDir must be defined (/DPackageDir=<staged package directory>)
#endif
#ifndef OutputDir
  #define OutputDir "."
#endif

#if Arch == "aarch64"
  #define ArchAllowed "arm64"
#else
  #define ArchAllowed "x64compatible"
#endif

[Setup]
; Identifies the installation across upgrades;
; crates/update/src/windows.rs refreshes DisplayVersion under this key after
; in-app updates.
AppId={{AD5DEC34-E254-467B-8F24-8127EBAF4DA6}
AppName=Orbit
AppVersion={#AppVersion}
AppVerName=Orbit {#AppVersion}
AppPublisher=Orbit
AppPublisherURL=https://orbit.sh
AppSupportURL=https://github.com/soumyachk101/Orbit-Code/issues
AppUpdatesURL=https://github.com/soumyachk101/Orbit-Code/releases
VersionInfoVersion={#AppVersion}
PrivilegesRequired=lowest
DefaultDirName={autopf}\Orbit
DisableProgramGroupPage=yes
DisableDirPage=auto
DisableReadyPage=yes
ArchitecturesAllowed={#ArchAllowed}
ArchitecturesInstallIn64BitMode={#ArchAllowed}
MinVersion=10.0
OutputDir={#OutputDir}
OutputBaseFilename=orbit-{#AppVersion}-windows-{#Arch}-setup
SetupIconFile=orbit.ico
UninstallDisplayIcon={app}\orbit.exe
UninstallDisplayName=Orbit
WizardStyle=modern
Compression=lzma2/max
SolidCompression=yes
; A running Orbit is closed through the Restart Manager before its files are
; replaced; the updated app starts again from the finish page.
CloseApplications=yes
RestartApplications=no

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked

[Files]
Source: "{#PackageDir}\orbit.exe"; DestDir: "{app}"; Flags: ignoreversion
Source: "{#PackageDir}\orbit-update.json"; DestDir: "{app}"; Flags: ignoreversion
Source: "{#PackageDir}\LICENSE"; DestDir: "{app}"; Flags: ignoreversion
Source: "{#PackageDir}\THIRD_PARTY_NOTICES.md"; DestDir: "{app}"; Flags: ignoreversion
Source: "{#PackageDir}\licenses\*"; DestDir: "{app}\licenses"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{autoprograms}\Orbit"; Filename: "{app}\orbit.exe"
Name: "{autodesktop}\Orbit"; Filename: "{app}\orbit.exe"; Tasks: desktopicon

[Registry]
; orbit:// conversation links — the scheme macOS registers in Info.plist and
; Linux in orbit.desktop.
Root: HKCU; Subkey: "Software\Classes\orbit"; ValueType: string; ValueName: ""; ValueData: "URL:Orbit"; Flags: uninsdeletekey
Root: HKCU; Subkey: "Software\Classes\orbit"; ValueType: string; ValueName: "URL Protocol"; ValueData: ""
Root: HKCU; Subkey: "Software\Classes\orbit\DefaultIcon"; ValueType: string; ValueName: ""; ValueData: """{app}\orbit.exe"",0"
Root: HKCU; Subkey: "Software\Classes\orbit\shell\open\command"; ValueType: string; ValueName: ""; ValueData: """{app}\orbit.exe"" ""%1"""

[Run]
Filename: "{app}\orbit.exe"; Description: "{cm:LaunchProgram,Orbit}"; Flags: nowait postinstall skipifsilent

[UninstallDelete]
; Leftovers of in-app updates (crates/update/src/windows.rs).
Type: files; Name: "{app}\orbit.exe.old"
Type: files; Name: "{app}\.orbit-update-incoming.exe"
Type: filesandordirs; Name: "{app}\.orbit-update-*"
