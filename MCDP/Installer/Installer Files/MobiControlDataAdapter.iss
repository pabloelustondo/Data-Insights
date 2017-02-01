; This script shows various basic things you can achieve using Inno Setup Preprocessor (ISPP).
; To enable commented #define's, either remove the ';' or use ISCC with the /D switch.

#pragma option -v+
#pragma verboselevel 9

#define AppName "MobiControlDataAdapter"
#define AppVersion GetFileVersion(AddBackslash(SourcePath) + "MCDP.exe")
#define MyAppPublisher "SOTI Inc."
#define MyAppURL "https://www.soti.net/"
#define MyAppExeName "MCDP.exe"
#define MyAppIcon SourcePath + "\images.ico"

[Setup]
AppId = {{36A3C11A-C8CA-43DC-8546-6AD7FA5E0A4C}
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
Source: "dacpac\Deploy.bat"; DestDir: "{tmp}"; Flags: ignoreversion
Source: "dacpac\MobiControlDataAnalyticDB.dacpac"; DestDir: "{tmp}"; Flags: ignoreversion
Source: "{src}\Auto.key"; DestDir: "{app}"; Flags: external;

[Icons]
Name: "{group}\{#AppName}"; Filename: "{app}\{#MyAppExeName}"
;Name: "{commondesktop}\{#AppName}"; Filename: "{app}\{#MyAppExeName}"; Tasks: desktopicon

[Run]
;Filename: "{tmp}\Deploy.bat"
Filename: {sys}\sc.exe; Parameters: "create MCDP start=auto binPath=""{app}\{#MyAppExeName}"""; Description: "MobiControl Data Producer"; Flags: nowait runascurrentuser postinstall 
;Filename: "{cmd}"; Parameters: "sc create MCDP start=auto DisplayName= MCDP binPath= ""{app}\{#MyAppExeName}"""; Description: "MobiControl Data Producer"; Flags: nowait runascurrentuser postinstall


[UninstallRun]
Filename: {sys}\sc.exe; Parameters: "stop {#MyAppExeName}" ; Flags: runascurrentuser runhidden
Filename: {sys}\sc.exe; Parameters: "delete {#MyAppExeName}" ; Flags: runascurrentuser runhidden

[code]
   function InitializeSetup(): Boolean;
   begin
     if (FileExists(ExpandConstant('{pf}\SOTI\MobiControl\Database.config'))) then
     begin
       //MsgBox('Installation validated', mbInformation, MB_OK);
        if (FileExists(ExpandConstant('{src}\Auto.key'))) then
        begin
             Result := True;
        end
        else
        begin
            MsgBox('Please copy the key to the same location as installer.', mbCriticalError, MB_OK);
            Result := False;
        end;
     end
     else
     begin
       MsgBox('Require MobiControl.'+ #13#10 + 'Please install MobiControl before install MC Data Adaptor!', mbCriticalError, MB_OK);
       Result := False;
     end;
   end;