; This script shows various basic things you can achieve using Inno Setup Preprocessor (ISPP).
; To enable commented #define's, either remove the ';' or use ISCC with the /D switch.

#pragma option -v+
#pragma verboselevel 9

#define AppName "MobiControlDataAdapter"
#define AppVersion GetFileVersion(AddBackslash(SourcePath) + "MCDP.exe")
#define MyAppPublisher "SOTI Inc."
#define MyAppURL "https://www.soti.net/"
#define MyAppExeName "MCDP.exe"
#define MyAppIcon "D:\BI\BINEW\MCDP\Installer\Installer Files\images.ico"

[Setup]
AppId = {{7047A211-3359-424A-AEF0-9D9A2AC7C43B}
AppName={#AppName}
AppVersion={#AppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
DefaultDirName={pf}\SOTI\{#AppName}
DefaultGroupName={#AppName}
DisableDirPage=no
DisableProgramGroupPage=yes
UninstallDisplayIcon={#MyAppIcon}
LicenseFile={#file AddBackslash(SourcePath) + "license.txt"}
OutputDir=bin
OutputBaseFilename=MobiControlDataAdaptor
SetupIconFile={#MyAppIcon}
Compression=lzma2
SolidCompression=yes

; "ArchitecturesAllowed=x64" specifies that Setup cannot run on
; anything but x64.
ArchitecturesAllowed=x64
; "ArchitecturesInstallIn64BitMode=x64" requests that the install be
; done in "64-bit mode" on x64, meaning it should use the native
; 64-bit Program Files directory and the 64-bit view of the registry.
ArchitecturesInstallIn64BitMode=x64

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

;[Tasks]
;Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked

[Files]
Source: "MCDP.exe"; DestDir: "{app}"; Flags: ignoreversion
Source: "MCDP.exe.config"; DestDir: "{app}"; Flags: ignoreversion
Source: "Database.dll"; DestDir: "{app}"; Flags: ignoreversion
Source: "DataProcess.dll"; DestDir: "{app}"; Flags: ignoreversion
Source: "Newtonsoft.Json.dll"; DestDir: "{app}"; Flags: ignoreversion
Source: "Newtonsoft.Json.xml"; DestDir: "{app}"; Flags: ignoreversion
Source: "license.txt"; DestDir: "{app}"; Flags: ignoreversion
Source: "Readme.txt"; DestDir: "{app}"; Flags: ignoreversion

[Icons]
Name: "{group}\{#AppName}"; Filename: "{app}\{#MyAppExeName}"
;Name: "{commondesktop}\{#AppName}"; Filename: "{app}\{#MyAppExeName}"; Tasks: desktopicon

[Run]
Filename: "{app}\{#MyAppExeName}"; Description: "{cm:LaunchProgram,{#StringChange(AppName, '&', '&&')}}"; Flags: nowait postinstall skipifsilent

