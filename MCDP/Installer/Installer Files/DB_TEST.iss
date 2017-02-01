[Setup]
AppName=test
AppVersion=1.0
LicenseFile={#file AddBackslash(SourcePath) + "license.txt"}
CreateAppDir=False
UsePreviousGroup=False
DisableProgramGroupPage=yes
Uninstallable=no

[Files]
Source: "update_v1.sql"; Flags: dontcopy
Source: "update_v1.sql"; Flags: dontcopy

[CustomMessages]
CustomForm_Caption=Connect to Database Server
CustomForm_Description=Enter the information required to connect to the database server
CustomForm_lblServer_Caption0=Server name:
CustomForm_lblAuthType_Caption0=Log on credentials
CustomForm_lblUser_Caption0=User name:
CustomForm_lblPassword_Caption0=Password:
CustomForm_lblDatabase_Caption0=Database:
CustomForm_lblVersion_Caption0=SQL Version:
CustomForm_chkSQLAuth_Caption0=Use SQL Server Authentication
CustomForm_chkWindowsAuth_Caption0=Use Windows Authentication
CustomForm_lstVersion_Line0=2008 R2
CustomForm_lstVersion_Line1=2012

[Code]
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
  txtServer: TEdit;
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

// Version drop down defaults to blank. Enable server textbox once a version is selected. This forces user to select the version first.
Procedure VersionOnChange (Sender: TObject);
begin                            
  lblServer.Enabled := True;
  txtServer.Enabled := True;
end;

// enable/disable child text boxes & functions when text has been entered into Server textbox. Makes no sense to populate child items unless a value exists for server.
Procedure ServerOnChange (Sender: TObject);
begin                            
  lstDatabase.Items.Clear;
  lstDatabase.Text := '';
  bIsNextEnabled := False;
  WizardForm.NextButton.Enabled := bIsNextEnabled;
  if Length(txtServer.Text) > 0 then
  begin
    lblAuthType.Enabled := True;
    lblDatabase.Enabled := True;
    lstDatabase.Enabled := True;
    chkWindowsAuth.Enabled := True;
    chkSQLAuth.Enabled := True;
  end
  else
  begin
    lblAuthType.Enabled := False;
    lblDatabase.Enabled := False;
    lstDatabase.Enabled := False; 
    chkWindowsAuth.Enabled := False;
    chkSQLAuth.Enabled := False;
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
      'Data Source=' + txtServer.Text + ';' +   // server name
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
  Script2008R2: AnsiString;  
  Script2012: AnsiString;    
  ADOCommand: Variant;
  ADOConnection: Variant;  
begin
// extract required version of script
  if lstVersion.Text='2008 R2' then
    ExtractTemporaryFile('"update_v1.sql"')
  if lstVersion.Text='2012' then
    ExtractTemporaryFile('"update_v1.sql"');

  try
    // create the ADO connection object
    ADOConnection := CreateOleObject('ADODB.Connection');
    // build a connection string; for more information, search for ADO
    // connection string on the Internet 
    ADOConnection.ConnectionString := 
      'Provider=SQLOLEDB;' +               // provider
      'Data Source=' + txtServer.Text + ';' +   // server name
      'Initial Catalog=' + lstDatabase.Text + ';' +   // server name
      'Application Name=' + '{#SetupSetting("AppName")}' + ' Execute SQL;' ;     
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
      // load a script from file into variable. Exclusive OR because both versions should never exist at the same time.
        if (LoadStringFromFile(ExpandConstant('{tmp}\"update_v1.sql'), Script2012)) xor (LoadStringFromFile(ExpandConstant('{tmp}\update_v1.sql'), Script2008R2))     then
      begin
        // assign text of a command to be issued against a provider. Append all 3 because one of the install assembly strings will always be empty.
        ADOCommand.CommandText := Script2008R2 + Script2012;
        // this will execute the script; the adCmdText flag here means
        // you're going to execute the CommandText text command, while
        // the adExecuteNoRecords flag ensures no data row will be get
        // from a provider, what should improve performance
        ADOCommand.Execute(NULL, NULL, adCmdText or adExecuteNoRecords);
      end
      else
      begin
        MsgBox('Installation files missing.', mbError, MB_OK);
        ExitProcess(7);
      end
    finally
      ADOConnection.Close;
    end;
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
      'Data Source=' + txtServer.Text + ';' +   // server name
      'Initial Catalog=' + lstDatabase.Text + ';' +   // server name
      'Application Name=' + '{#SetupSetting("AppName")}' + ' Execute SQL;' ;     
    if chkWindowsAuth.Checked then
      ADOConnection.ConnectionString := ADOConnection.ConnectionString +
      'Integrated Security=SSPI;'         // Windows Auth
    else
      ADOConnection.ConnectionString := ADOConnection.ConnectionString +
      'User Id=' + txtUsername.Text + ';' +              // user name
      'Password=' + txtPassword.Text + ';';                   // password
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

  { lblVersion }
  lblVersion := TLabel.Create(Page);
  with lblVersion do
  begin
    Parent := Page.Surface;
    Caption := ExpandConstant('{cm:CustomForm_lblVersion_Caption0}');
    Left := ScaleX(24);
    Top := ScaleY(8);
    Width := ScaleX(61);
    Height := ScaleY(13);
  end;

  { lstVersion }
  lstVersion := TComboBox.Create(Page);
  with lstVersion do
  begin
    Parent := Page.Surface;
    Left := ScaleX(112);
    Top := ScaleY(8);
    Width := ScaleX(145);
    Height := ScaleY(21);
    Style := csDropDownList;
    DropDownCount := 2;
    TabOrder := 0;
    Items.Add(ExpandConstant('{cm:CustomForm_lstVersion_Line0}'));
    Items.Add(ExpandConstant('{cm:CustomForm_lstVersion_Line1}'));
    OnChange:= @VersionOnChange;

  end;

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
    Enabled := False;
  end;

  { txtServer }
  txtServer := TEdit.Create(Page);
  with txtServer do
  begin
    Parent := Page.Surface;
    Left := ScaleX(112);
    Top := ScaleY(32);
    Width := ScaleX(273);
    Height := ScaleY(21);
    TabOrder := 1;
    Enabled := False;
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
    Checked := True;
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
    Left := ScaleX(120);
    Top := ScaleY(128);
    Width := ScaleX(241);
    Height := ScaleY(21);
    Enabled := False;
    TabOrder := 4;
  end;

  { txtPassword }
  txtPassword := TPasswordEdit.Create(Page);
  with txtPassword do
  begin
    Parent := Page.Surface;
    Left := ScaleX(120);
    Top := ScaleY(152);
    Width := ScaleX(241);
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
    Left := ScaleX(56);
    Top := ScaleY(192);
    Width := ScaleX(53);
    Height := ScaleY(13);
    Enabled := False;
  end;

  { lstDatabase }
  lstDatabase := TComboBox.Create(Page);
  with lstDatabase do
  begin
    Parent := Page.Surface;
    Left := ScaleX(120);
    Top := ScaleY(192);
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