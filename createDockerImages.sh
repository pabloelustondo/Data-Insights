#!/bin/bash
#By Ray Gervais

componentName=$1
componentLocation=$2
deleteDeployment=$3
deleteService=$4

# Move to Component Location
echo "Moving to $componentName location"
cd $(pwd)/$componentLocation

# Docker Build Process
echo "Building Docker Image for $componentName"
docker build -t ae7bf2c134d5f11e7a174123ab8f20a4-1306207793.us-east-1.elb.amazonaws.com:5494/$componentName:latest .

# Docker Kill Previous Runtimes
docker rm $(docker ps -a -q) -f

# Run Docker Image In Seperate CMD / Test Docker Runtime
# docker run --rm -p 8000:%port% ae7bf2c134d5f11e7a174123ab8f20a4-1306207793.us-east-1.elb.amazonaws.com:5494/%component%:sprint-16 && curl localhost:%port%/test

echo "Pushing $componentName:latest Docker Image"
docker push ae7bf2c134d5f11e7a174123ab8f20a4-1306207793.us-east-1.elb.amazonaws.com:5494/$componentName:latest

# Deployment OPTION
if ( $deleteDeployment ); then
    echo "Deleting Previous Deployment Definition for $componentName"
    kubectl --namespace stage delete deployment $componentName

    echo "Creating New Deployment Definition for $componentName"
    kubectl --namespace stage create -f $component-dep.yaml
fi

if ( $deleteService ); then 
    echo "Deleting Previous Service Definition for $componentName"
    kubectl --namespace stage delete service $component-svc
    
    echo "Creating New Service Definition for $componentName"
    kubectl --namespace stage create -f $component-svc.yaml
fi 

echo "Completed Running createDockerImages shell script for $componentName"
kubectl --namespace stage get all

