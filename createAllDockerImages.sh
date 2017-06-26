#!/bin/bash
#By Ray Gervais

# Variables
components=("cdl:cdl" "dadb:dad/dadb" "ddb:ddb" "dlm:dlm" "dosb:dos/dosb" "dps:dps" "dssb:dss/dssb" "ida:ida" "oda:oda" "tmmb:tmm/tmmb")

# Create Kubenetes Images
for i in "${components[@]}"
do
    echo "Comp" ${i%:*}
    echo "Location" ${i##*:}
    ./createDockerImages.bat ${i%:*} ${i##*:} true true
done 

echo "Completed!"
kubectrl.exe --namespace demo get all
