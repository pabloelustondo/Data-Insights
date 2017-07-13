#!/bin/bash
#By Ray Gervais

deleteDeployments=$1
deleteServices=$2

# Variables
components=("cdl:cdl" "dadb:dad/dadb" "ddb:ddb" "dlm:dlm" "dosb:dos/dosb" "dps:dps" "dssb:dss/dssb" "ida:ida" "oda:oda" "tmmb:tmm/tmmb")

# Create Kubenetes Images
for i in "${components[@]}"
do
    echo "Comp" ${i%:*}
    echo "Location" ${i##*:}
    ./createDockerImages.sh ${i%:*} ${i##*:} $deleteDeployments $deleteServices
done 

echo "Completed!"
kubectrl.exe --namespace demo get all
