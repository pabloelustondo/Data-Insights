::Start Everything

call setconfig %1

SET kafkadir=C:\kafka

SET installdir= %cd%
cd %installdir%

echo "starting kafka zoo"
start cmd.exe /k  "%kafkadir%\bin\windows\zookeeper-server-start.bat %kafkadir%\config\zookeeper.properties"

echo "starting kafka"
start cmd.exe /k  "%kafkadir%\bin\windows\kafka-server-start.bat %kafkadir%\config\server.properties"

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

echo "starting dos backend"
start cmd.exe /k "cd %installdir%\dos\backend & call npm run start"

echo "starting cdl"
start cmd.exe /k "cd %installdir%\cdl & call npm run start"

echo "starting ida"
start cmd.exe /k "cd %installdir%\ida & call npm run start"

echo "starting tmm"
start cmd.exe /k "cd %installdir%\tmm & call npm run start"

echo "starting tmm backend"
start cmd.exe /k "cd %installdir%\tmm\backend & call npm run start"