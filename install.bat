::Script presumes the presence of IDA_accessKeyID.txt & IDA_secretAccessKey.txt at root of C:\ . They can be blank.
::Change Installdir to your own install
::USE AS IS. Only works on windows. Contact Peter Maney.
::WARNING WARNING we recomend newcomers read README and do this installation/run module by module.
@echo off

::Install Everything
SET installdir= %cd%
echo Current Folder %installdir%
cd %installdir%
cd %installdir%\ddb
call npm install
cd %installdir%\dss
call npm install
cd %installdir%\dss\backend
call npm install
cd %installdir%\dad
call npm install
cd %installdir%\dad\backend
call npm install
cd %installdir%\oda
call npm install
cd %installdir%\dos
call npm install
cd %installdir%\dos\backend
call npm install
cd %installdir%\ida
npm install
cd %installdir%\cdl
npm install
cd %installdir%\tmm
call npm install
cd %installdir%\tmm\backend
call npm install
cd %installdir%
echo "installations completed"



