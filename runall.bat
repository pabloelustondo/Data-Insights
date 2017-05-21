::Start Everything
start cmd.exe /k
mongod
start cmd.exe /k
cd %installdir%\ddb & start call npm start
start cmd.exe /k
 cd %installdir%\oda & start call npm start
start cmd.exe /k
 cd %installdir%\dss\backend & start call npm start
start cmd.exe /k
 cd %installdir%\dss & start call npm start
start cmd.exe /k
 cd %installdir%\ida & start call npm start
start cmd.exe /k
 cd %installdir%\dad3 & start call npm start
start cmd.exe /k
 cd %installdir%\dlm & start call npm start
start cmd.exe /k

exit