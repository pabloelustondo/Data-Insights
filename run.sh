#!/bin/bash          
 echo "Run SOTI Insights"
 D="$(pwd)"
 echo "Current Folder:  ${D}"
 echo "Parameter: $1"
 if [ -z "$1" ] 
 then 
   echo "Using Local Config (pass parameter for specific config)"
   C="local"
 else 
   C="$1"
 fi
 CF="globalconfig_${C}.json"
 echo "Copying Config: ${CF}"
 cp "./globalconfigs/${CF}" "./globalconfig.json"

 echo "starting mongo"
 sudo mongod > ./dos/logs/mongod.log&

 echo "starting zoo"
 sudo startzoo > ./dos/logs/zoo.log&

 echo "starting kafka"
 sudo startkafka > ./dos/logs/kafka.log&

 cd dos
 npm start > ../dos/logs/dos.log&
 cd backend
 npm start > ../../dos/logs/dosback.log&
 cd ../..
 cd ddb
 npm start > ../dos/logs/ddb.log&
 cd ..
 cd dss
 npm start > ../dos/logs/dss.log&
 cd backend
 npm start > ../../dos/logs/dssback.log&
 cd ../..
 cd dad
 npm start > ../dos/logs/dad.log&
 cd backend
 npm start > ../../dos/logs/dadback.log&
 cd ../..
 cd oda
 npm start > ../dos/logs/oda.log&
 cd ..
 cd cdl
 npm start > ../dos/logs/cdl.log&
 cd ..
 cd ida
 npm start > ../dos/logs/ida.log&
