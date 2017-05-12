::Script presumes the presence of IDA_accessKeyID.txt & IDA_secretAccessKey.txt at root of C:\ . They can be blank.
::Change Installdir to your own install
::USE AS IS. Only works on windows. Contact Peter Maney.
::WARNING WARNING we recomend newcomers read README and do this installation/run module by module.
@echo off

SET installdir= %cd%
cd %installdir%

:: Its Mongo Time 2.0
mkdir data_folder
start call mongod -dbpath ./data_folder 
start call mongo

::Start Everything
 cd %installdir%\ddb & start call npm start
 cd %installdir%\oda & start call npm start
 cd %installdir%\dss\backend & start call npm start
 cd %installdir%\dss & start call npm start
 cd %installdir%\ida & start call npm start
 cd %installdir%\dad & start call npm start
 cd %installdir%\dlm & start call npm start
