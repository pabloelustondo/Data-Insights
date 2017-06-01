::Script presumes the presence of IDA_accessKeyID.txt & IDA_secretAccessKey.txt at root of C:\ . They can be blank.
::Change Installdir to your own install
::USE AS IS. Only works on windows. Contact Peter Maney.
::WARNING WARNING we recomend newcomers read README and do this installation/run module by module.
@echo off

::Install Everything

cd ddb
call npm install

cd ..\dss
call npm install

cd backend
call npm install

cd ..\..\dad
call npm install

cd backend
call npm install

cd ..\..\oda
call npm install

cd ..\dos
call npm install

cd backend
call npm install

cd ..\..\cdl
npm install

cd ..\ida
npm install

echo "installations completed"



