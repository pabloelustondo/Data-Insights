; This script shows various basic things you can achieve using Inno Setup Preprocessor (ISPP).
; To enable commented #define's, either remove the ';' or use ISCC with the /D switch.

#pragma option -v+
#pragma verboselevel 9

#define MyAppName "MobiControlDataAdapter"
#define MyAppVersion GetFileVersion(AddBackslash(SourcePath) + "MCDP.exe")
#define MyAppPublisher "SOTI Inc."
#define MyAppURL "https://www.soti.net/"
#define MyAppExeName "MCDP.exe"
#define MyAppExeNameOnly "MCDP"
#define MyAppIcon SourcePath + "\images.ico"

[Setup]
AppId = {{F268B5D3-CF35-4DD7-83D3-F12EC178D50E}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
DefaultDirName={reg:HKLM\SYSTEM\CurrentControlSet\services\MCDP,ImagePath}
DefaultGroupName={#MyAppName}
DisableDirPage=no
DisableProgramGroupPage=yes
UninstallDisplayIcon={#MyAppIcon}
LicenseFile={#file AddBackslash(SourcePath) + "license.txt"}
OutputDir=bin
OutputBaseFilename=MobiControlDataAdaptor
SetupIconFile={#MyAppIcon}
;Compression=lzma2
;SolidCompression=yes

; "ArchitecturesAllowed=x64" specifies that Setup cannot run on
; anything but x64.
;ArchitecturesAllowed=x64
; "ArchitecturesInstallIn64BitMode=x64" requests that the install be
; done in "64-bit mode" on x64, meaning it should use the native
; 64-bit Program Files directory and the 64-bit view of the registry.
;ArchitecturesInstallIn64BitMode=x64

;[Languages]
;Name: "english"; MessagesFile: "compiler:Default.isl"

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
Source: "SupportedDataTable.json"; DestDir: "{app}"; Flags: ignoreversion 
Source: "{src}\mcdp_access.key"; DestDir: "{app}"; Flags: external;

[Icons]
Name: "{group}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"
;Name: "{commondesktop}\{#AppName}"; Filename: "{app}\{#MyAppExeName}"; Tasks: desktopicon

[Run]
Filename: "sc.exe"; Parameters: "create MCDP start=delayed-auto binPath=""{app}\{#MyAppExeName}"" DisplayName= ""MobiControl Data Producer Service"""; Flags: runascurrentuser runhidden

[UninstallRun]
Filename: "sc.exe"; Parameters: "stop {#MyAppExeNameOnly}"; Flags: runascurrentuser
Filename: "sc.exe"; Parameters: "delete {#MyAppExeNameOnly}"; Flags: runascurrentuser

[CustomMessages]
MyAppOld=The Setup detected application version 
MyAppRequired=The installation of {#MyAppName} requires MyApp to be installed.%nInstall MyApp before installing this update.%n%n
MyAppTerminated=The setup of update will be terminated.

[code]
    var
    InstallLocation: String;

    function GetInstallString(): String;
    var
    InstPath: String;
    InstallString: String;
    begin
    InstPath := ExpandConstant('SYSTEM\CurrentControlSet\services\MCDP');
    InstallString := '';
    if not RegQueryStringValue(HKLM, InstPath, 'InstallLocation', InstallString) then
    RegQueryStringValue(HKCU, InstPath, 'InstallLocation', InstallString);
    Result := InstallString;
    InstallLocation := InstallString;
    end;

   //Pre checkup
    function InitializeSetup(): Boolean;
     var
        V: Integer;
        sUnInstallString: String;
        Version: String;
     begin
     if RegKeyExists(HKEY_LOCAL_MACHINE, 'SYSTEM\CurrentControlSet\services\MobiControl Management Service')  then
     begin
       //MsgBox('Installation validated', mbInformation, MB_OK);
        if (FileExists(ExpandConstant('{src}\mcdp_access.key'))) then
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

     //upgrade case check out
     if RegKeyExists(HKEY_LOCAL_MACHINE,'SYSTEM\CurrentControlSet\Services\MCDP') then 
     begin
       RegQueryStringValue(HKEY_LOCAL_MACHINE,'SYSTEM\CurrentControlSet\services\MCDP', 'Version', Version);
       //if Version =< ExpandConstant('{#MyAppVersion}') then 
       //begin 
         // Result := True;
         // GetInstallString();
       //end
       MsgBox(Version, mbInformation, MB_OK);
     end
     else 
     begin
       RegWriteStringValue(HKEY_LOCAL_MACHINE, 'SYSTEM\CurrentControlSet\services\MCDP', 'Version', '{#MyAppVersion}');
     end;
    end;

