#!/bin/bash
#By Ray Gervais

# Variables
components=("cdl:8020" "dad:8026" "ddb:8000" "dlm:8003" "dos:5000" "dps:8002" "dss:8024" "ida:8027" "oda:8022" "tmm:8029")

# Create Kubenetes Images
for i in "${components[@]}"
do
    echo "Comp" ${i%:*}
    echo "Port" ${i##*:}
    ./createDockerImages.bat ${i%:*} ${i##*:} true
done 

echo "Completed!"
kubectrl.exe --namespace stage get all
