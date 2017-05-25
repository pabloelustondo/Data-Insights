::Start Everything

call setconfig %1

SET installdir= %cd%
cd %installdir%

echo "starting mongo"
start cmd.exe /k mongod

echo "starting ddb"
start cmd.exe /k "cd %installdir%\ddb & call npm start"

ehoc "starting dss"
start cmd.exe /k "cd %installdir%\dss & call npm start"

echo "starting dss backend"
start cmd.exe /k "cd %installdir%\dss\backend & call npm start"

echo "starting dad"
start cmd.exe /k "cd %installdir%\dad & call npm run start"

echo "starting dad backend"
start cmd.exe /k "cd %installdir%\dad\backend & call npm run start"

echo "starting oda"
start cmd.exe /k "cd %installdir%\oda & call npm run start"

echo "starting dos"
start cmd.exe /k "cd %installdir%\dos & call npm run start"