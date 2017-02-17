; This script shows various basic things you can achieve using Inno Setup Preprocessor (ISPP).
; To enable commented #define's, either remove the ';' or use ISCC with the /D switch.

#pragma option -v+
#pragma verboselevel 9

#define AppName "MobiControlDataAdapter"
#define AppVersion GetFileVersion(AddBackslash(SourcePath) + "MCDP.exe")
#define MyAppPublisher "SOTI Inc."
#define MyAppURL "https://www.soti.net/"
#define MyAppExeName "MCDP.exe"
#define MyAppExeNameOnly "MCDP"
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
Source: "dacpac\*"; DestDir: "{app}\dacpac"; Flags: ignoreversion recursesubdirs
Source: "{src}\mcdp_access.key"; DestDir: "{sys}"; Flags: external;
Source: "server.bat"; DestDir: "{app}"; Flags: ignoreversion deleteafterinstall

[CustomMessages]
CustomForm_Caption=Connect to Database Server
CustomForm_Description=Enter the information required to connect to the database server
CustomForm_lblServer_Caption0=Server name:
CustomForm_lblAuthType_Caption0=Log on credentials
CustomForm_lblUser_Caption0=User name:
CustomForm_lblPassword_Caption0=Password:
CustomForm_lblDatabase_Caption0=MobiControl Data Source:
CustomForm_lblVersion_Caption0=SQL Version:
CustomForm_chkSQLAuth_Caption0=Use SQL Server Authentication
CustomForm_chkWindowsAuth_Caption0=Use Windows Authentication

[Icons]
Name: "{group}\{#AppName}"; Filename: "{app}\{#MyAppExeName}"
;Name: "{commondesktop}\{#AppName}"; Filename: "{app}\{#MyAppExeName}"; Tasks: desktopicon

[Run]
Filename: "{app}\dacpac\Soti.MCDP.DacpacInstaller.exe"; Parameters: "-S {code:GetServer} -D {code:GetDatabase}_MCDP -U {code:GetUser} -P {code:GetPassword} -d ""{app}\dacpac\MobiControlDataAnalyticDB.dacpac"" -v  ""MobiControlDB={code:GetDatabase};""";  Flags: runascurrentuser
Filename: "sc.exe"; Parameters: "create MCDP start=delayed-auto binPath=""{app}\{#MyAppExeName}"" DisplayName= ""MobiControl Data Producer Service"""; Flags: runascurrentuser

[UninstallRun]
Filename: "sc.exe"; Parameters: "stop {#MyAppExeNameOnly}"; Flags: runascurrentuser
Filename: "sc.exe"; Parameters: "delete {#MyAppExeNameOnly}"; Flags: runascurrentuser

[code]
   //Pre checkup
   function InitializeSetup(): Boolean;
   begin
     if (FileExists(ExpandConstant('{pf}\SOTI\MobiControl\Database.config'))) then
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
   end;
  //pop up for database
const
  adCmdUnspecified = $FFFFFFFF;
  adCmdUnknown = $00000008;
  adCmdText = $00000001;
  adCmdTable = $00000002;
  adCmdStoredProc = $00000004;
  adCmdFile = $00000100;
  adCmdTableDirect = $00000200;
  adOptionUnspecified = $FFFFFFFF;
  adAsyncExecute = $00000010;
  adAsyncFetch = $00000020;
  adAsyncFetchNonBlocking = $00000040;
  adExecuteNoRecords = $00000080;
  adExecuteStream = $00000400;
  adExecuteRecord = $00000800;

var
  lblVersion: TLabel;
  lstVersion: TComboBox;
  lblServer: TLabel;
  lblAuthType: TLabel;
  lblUser: TLabel;
  lblPassword: TLabel;
  lblDatabase: TLabel;
  chkSQLAuth: TRadioButton;
  lstServer: TComboBox;
  chkWindowsAuth: TRadioButton;
  txtUsername: TEdit;
  txtPassword: TPasswordEdit;
  lstDatabase: TComboBox;
  bIsNextEnabled: Boolean;

 var
  Page: TWizardPage;

// Used to generate error code by sql script errors
procedure ExitProcess(exitCode:integer);
  external 'ExitProcess@kernel32.dll stdcall';

// enable/disable child text boxes & functions when text has been entered into Server textbox. Makes no sense to populate child items unless a value exists for server.
Procedure ServerOnChange (Sender: TObject);
begin                            
  lstDatabase.Items.Clear;
  lstDatabase.Text := '';
  bIsNextEnabled := False;
  WizardForm.NextButton.Enabled := bIsNextEnabled;
  if Length(lstServer.Text) > 0 then
  begin
    lblAuthType.Enabled := True;
    lblDatabase.Enabled := True;
    lstDatabase.Enabled := True;
    chkWindowsAuth.Enabled := True;
    chkSQLAuth.Enabled := True;
    txtUsername.Enabled := True;
    txtPassword.Enabled := True;
    lblUser.Enabled := True;
    lblPassword.Enabled := True;
  end
  else
  begin
    lblAuthType.Enabled := False;
    lblDatabase.Enabled := False;
    lstDatabase.Enabled := False; 
    chkWindowsAuth.Enabled := False;
    chkSQLAuth.Enabled := False;
    txtUsername.Enabled := False;
    txtPassword.Enabled := False;
    lblUser.Enabled := False;
    lblPassword.Enabled := False;
  end
end;

// enable/disable user/pass text boxes depending on selected auth type. A user/pass is only required for SQL Auth
procedure  AuthOnChange (Sender: TObject);
begin
  if chkSQLAuth.Checked then
  begin
    lblUser.Enabled := true;
    lblPassword.Enabled := true;
    txtUsername.Enabled := true;
    txtPassword.Enabled := true;
  end
  Else
  begin
    lblUser.Enabled := false;
    lblPassword.Enabled := false;
    txtUsername.Enabled := false;
    txtPassword.Enabled := false;
  end
end;

// Enable next button once a database name has been entered.
Procedure DatabaseOnChange (Sender: TObject);
begin
  if (Length(lstDatabase.Text) > 0) and (lstDatabase.Enabled) then
  begin
    bIsNextEnabled := True;
    WizardForm.NextButton.Enabled := bIsNextEnabled;  
  end
  else
  begin
    bIsNextEnabled := False;
    WizardForm.NextButton.Enabled := bIsNextEnabled;  
  end
end;

// Retrieve a list of databases server.
// This list is shown in the database server dropdown list
procedure RetrieveDatabaseServerList(Sender: TObject);
var
  Tmp: string;
  TmpServerName: string;
  TmpExactName: string;
  TmpResult: string;
  ResultCode: integer;
  SectionLine: Integer;
  Lines: TArrayOfString;
begin
  try
    lstServer.Items.Clear;

    Tmp := ExpandConstant('{tmp}');
    TmpServerName := Tmp + '\SQLSERVER_FILE.txt';
    TmpExactName := Tmp + '\SQLSERVERNAME.txt';
    //MsgBox(TmpExactName, mbError, MB_OK);

    try
    Exec('cmd.exe', '/c "sc query|findstr "DISPLAY_NAME"|findstr /C:"SQL Server (" > "' + TmpServerName + '""', '', SW_HIDE, ewWaitUntilTerminated, ResultCode);
    //MsgBox(TmpExactName, mbError, MB_OK);
    Exec('cmd.exe', '/c "(for /f " tokens=2 delims=()" %i in (' + TmpServerName + ') do @echo %computername%\%i) >> "' +  TmpExactName + '""', '', SW_HIDE, ewWaitUntilTerminated, ResultCode);
    //MsgBox(TmpExactName, mbError, MB_OK);
    if FileExists(TmpExactName) then
    begin
        LoadStringsFromFile(TmpExactName, Lines);

        for SectionLine := 0 to GetArrayLength(Lines) - 1 do 
        begin     
          lstServer.Items.Add(Lines[SectionLine]); 
        end  
    end 
    
    finally
       DeleteFile(TmpServerName);
       DeleteFile(TmpExactName);
    end;
    except
    MsgBox(GetExceptionMessage, mbError, MB_OK);
    end;
    
end;


// Retrieve a list of databases accessible on the server with the credentials specified.
// This list is shown in the database dropdown list
procedure RetrieveDatabaseList(Sender: TObject);
var  
  ADOCommand: Variant;
  ADORecordset: Variant;
  ADOConnection: Variant;       
begin
  lstDatabase.Items.Clear;
  try
    // create the ADO connection object
    ADOConnection := CreateOleObject('ADODB.Connection');
    // build a connection string; for more information, search for ADO
    // connection string on the Internet 
    ADOConnection.ConnectionString := 
      'Provider=SQLOLEDB;' +               // provider
      'Data Source=' + lstServer.Text + ';' +   // server name
      'Application Name=' + '{#SetupSetting("AppName")}' + ' DB List;'
    if chkWindowsAuth.Checked then
      ADOConnection.ConnectionString := ADOConnection.ConnectionString +
      'Integrated Security=SSPI;'         // Windows Auth
    else
      ADOConnection.ConnectionString := ADOConnection.ConnectionString +
      'User Id=' + txtUsername.Text + ';' +              // user name
      'Password=' + txtPassword.Text + ';';                   // password
    // open the connection by the assigned ConnectionString
    ADOConnection.Open;
    try
      // create the ADO command object
      ADOCommand := CreateOleObject('ADODB.Command');
      // assign the currently opened connection to ADO command object
      ADOCommand.ActiveConnection := ADOConnection;
      // assign text of a command to be issued against a provider
      ADOCommand.CommandText := 'SELECT name FROM master.dbo.sysdatabases WHERE HAS_DBACCESS(name) = 1 ORDER BY name';
      // this property setting means, that you're going to execute the 
      // CommandText text command; it does the same, like if you would
      // use only adCmdText flag in the Execute statement
      ADOCommand.CommandType := adCmdText;
      // this will execute the command and return dataset
      ADORecordset := ADOCommand.Execute;
      // get values from a dataset using 0 based indexed field access;
      // notice, that you can't directly concatenate constant strings 
      // with Variant data values
      while not ADORecordset.eof do 
      begin
       lstDatabase.Items.Add(ADORecordset.Fields(0));
       ADORecordset.MoveNext;
      end

    finally
      ADOConnection.Close;
    end;
  except
    MsgBox(GetExceptionMessage, mbError, MB_OK);
  end;
end;

// Execute files specified in [files] section (hardcoded) against the user defined server.database
procedure DeploySQL();
var
  ResultCode: integer; 
begin
  try
     //ExtractTemporaryFile('dacpac\Soti.MCDP.DacpacInstaller.exe');
    //Exec('{src}\dacpac\Soti.MCDP.DacpacInstaller.exe', '-S ' + lstServer.Text + ' -D ' + lstDatabase.Text + ' -U ' + txtUsername.Text + ' -P ' + txtPassword.Text + ' -d ' + '"MobiControlDataAnalyticDB.dacpac"' + ' -v ' + '"TestVar=FooBar;"', '', SW_HIDE, ewWaitUntilTerminated, ResultCode);
    //MsgBox(ExpandConstant('lstServer.Text'), mbError, MB_OK); 
  except
    MsgBox(GetExceptionMessage, mbError, MB_OK);
    ExitProcess(5);
  end;
end;

{ CustomForm_NextkButtonClick }
// try to connect to supplied db. Dont need to catch errors/close conn on error because a failed connection is never opened.
function CustomForm_NextButtonClick(Page: TWizardPage): Boolean;
var  
  ADOConnection: Variant;  
begin
  //try
    // create the ADO connection object
    ADOConnection := CreateOleObject('ADODB.Connection');
    // build a connection string; for more information, search for ADO
    // connection string on the Internet 
    ADOConnection.ConnectionString := 
      'Provider=SQLOLEDB;' +               // provider
      'Data Source=' + lstServer.Text + ';' +   // server name
      'Initial Catalog=' + lstDatabase.Text + ';' +   // server name
      'Application Name=' + '{#SetupSetting("AppName")}' + ' Execute SQL;' ;     
    if chkWindowsAuth.Checked then
      ADOConnection.ConnectionString := ADOConnection.ConnectionString +
      'Integrated Security=SSPI;'         // Windows Auth
    else
      ADOConnection.ConnectionString := ADOConnection.ConnectionString +
      'User Id=' + txtUsername.Text + ';' +              // user name
      'Password=' + txtPassword.Text + ';';              // password
    // open the connection by the assigned ConnectionString
    ADOConnection.Open;
    Result := True;
end;

{ CustomForm_CreatePage }

function CustomForm_CreatePage(PreviousPageId: Integer): Integer;
begin

  Page := CreateCustomPage(
    PreviousPageId,
    ExpandConstant('{cm:CustomForm_Caption}'),
    ExpandConstant('{cm:CustomForm_Description}')
  );

  { lblServer }
  lblServer := TLabel.Create(Page);
  with lblServer do
  begin
    Parent := Page.Surface;
    Caption := ExpandConstant('{cm:CustomForm_lblServer_Caption0}');
    Left := ScaleX(24);
    Top := ScaleY(32);
    Width := ScaleX(68);
    Height := ScaleY(13);
    Enabled := True;
  end;

  { lstServer }
  lstServer := TComboBox.Create(Page);
  with lstServer do
  begin
    Parent := Page.Surface;
    Left := ScaleX(112);
    Top := ScaleY(32);
    Width := ScaleX(273);
    Height := ScaleY(21);
    TabOrder := 1;
    Enabled := True;
    OnDropDown:= @RetrieveDatabaseServerList;
    OnChange := @ServerOnChange;
  end;

  { lblAuthType }
  lblAuthType := TLabel.Create(Page);
  with lblAuthType do
  begin
    Parent := Page.Surface;
    Caption := ExpandConstant('{cm:CustomForm_lblAuthType_Caption0}');
    Left := ScaleX(24);
    Top := ScaleY(72);
    Width := ScaleX(87);
    Height := ScaleY(13);
    Enabled := False;
  end;

  { chkWindowsAuth }
  chkWindowsAuth := TRadioButton.Create(Page);
  with chkWindowsAuth do
  begin
    Parent := Page.Surface;
    Caption := ExpandConstant('{cm:CustomForm_chkWindowsAuth_Caption0}');
    Left := ScaleX(32);
    Top := ScaleY(88);
    Width := ScaleX(177);
    Height := ScaleY(17);
    Checked := False;
    TabOrder := 2;
    TabStop := True;
    OnClick := @AuthOnChange;
    Enabled := False;
  end;

  { chkSQLAuth }
  chkSQLAuth := TRadioButton.Create(Page);
  with chkSQLAuth do
  begin
    Parent := Page.Surface;
    Caption := ExpandConstant('{cm:CustomForm_chkSQLAuth_Caption0}');
    Left := ScaleX(32);
    Top := ScaleY(108);
    Width := ScaleX(185);
    Height := ScaleY(17);
    Checked := True;
    TabOrder := 3;    
    OnClick := @AuthOnChange;
    Enabled := False;
  end;

  { lblUser }
  lblUser := TLabel.Create(Page);
  with lblUser do
  begin
    Parent := Page.Surface;
    Caption := ExpandConstant('{cm:CustomForm_lblUser_Caption0}');
    Left := ScaleX(56);
    Top := ScaleY(128);
    Width := ScaleX(58);
    Height := ScaleY(13);
    Enabled := False;
  end;

  { lblPassword }
  lblPassword := TLabel.Create(Page);
  with lblPassword do
  begin
    Parent := Page.Surface;
    Caption := ExpandConstant('{cm:CustomForm_lblPassword_Caption0}');
    Left := ScaleX(56);
    Top := ScaleY(152);
    Width := ScaleX(53);
    Height := ScaleY(13);
    Enabled := False;
  end;

  { txtUsername }
  txtUsername := TEdit.Create(Page);
  with txtUsername do
  begin
    Parent := Page.Surface;
    Left := ScaleX(160);
    Top := ScaleY(128);
    Width := ScaleX(201);
    Height := ScaleY(21);
    Text := 'sa';
    Enabled := False;
    TabOrder := 4;
  end;

  { txtPassword }
  txtPassword := TPasswordEdit.Create(Page);
  with txtPassword do
  begin
    Parent := Page.Surface;
    Left := ScaleX(160);
    Top := ScaleY(152);
    Width := ScaleX(201);
    Height := ScaleY(21);
    Enabled := False;
    TabOrder := 5;
  end;
        
   { lblDatabase }
  lblDatabase := TLabel.Create(Page);
  with lblDatabase do
  begin
    Parent := Page.Surface;
    Caption := ExpandConstant('{cm:CustomForm_lblDatabase_Caption0}');
    //Left := ScaleX(56);
    //Top := ScaleY(192);
    //Width := ScaleX(53);
    //Height := ScaleY(13);
    Left := ScaleX(24);
    Top := ScaleY(192);
    Width := ScaleX(177);
    Height := ScaleY(17);
    Enabled := False;
  end;

  { lstDatabase }
  lstDatabase := TComboBox.Create(Page);
  with lstDatabase do
  begin
    Parent := Page.Surface;
    Left := ScaleX(160);
    Top := ScaleY(190);
    Width := ScaleX(145);
    Height := ScaleY(21);
    Enabled := False;
    TabOrder := 6;    
    OnDropDown:= @RetrieveDatabaseList;
    OnChange:= @DatabaseOnChange;
  end;

  with Page do
  begin
    OnNextButtonClick := @CustomForm_NextButtonClick;
  end;

  Result := Page.ID;
end;

procedure CurPageChanged(CurPageID: Integer);
begin
// set initial status of next button. Should be disabled when page is first loaded, but should be enabled if user clicked back.
  if CurPageID = Page.ID then
    WizardForm.NextButton.Enabled := bIsNextEnabled;  
end;

procedure CurStepChanged(CurStep: TSetupStep);
begin
// The preinstall step seems like the best time to do the actual install. The problem is that this is not a traditional install. Nothing is copied to the users' pc
  if CurStep = ssInstall then
    DeploySQL;  
end;
   
procedure InitializeWizard();
begin
  bIsNextEnabled := False;
  CustomForm_CreatePage(wpLicense);
end;

//populate code variable to run setup
function GetServer(Value: string): string;
begin
  Result := lstServer.Text;
end;

function GetDatabase(Value: string): string;
begin
  Result := lstDatabase.Text;
end;

function GetUser(Value: string): string;
begin
  Result := txtUsername.Text;
end;

function GetPassword(Value: string): string;
begin
  Result := txtPassword.Text;
end;
