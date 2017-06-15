@echo off
:: Get Component Argument
set component=%1
set port=%2
cd %cd%/%component%

:: Create Docker Image
docker build -t ae7bf2c134d5f11e7a174123ab8f20a4-1306207793.us-east-1.elb.amazonaws.com:5494/%component%:sprint-16 .

:: Kill Previous Docker Runtimes
docker rm $(docker ps -a -q) -f

:: Run Docker Image In Seperate CMD / Test Docker Runtime
start call docker run --rm -p 8000:%port% ae7bf2c134d5f11e7a174123ab8f20a4-1306207793.us-east-1.elb.amazonaws.com:5494/%component%:sprint-16 & curl localhost:%port%/test

docker push ae7bf2c134d5f11e7a174123ab8f20a4-1306207793.us-east-1.elb.amazonaws.com:5494/%component%:sprint-16

:: DEVEL OPTION
set deleteOld=%3%
IF "%deleteOld%"=="true" (
    :: Will Delete Old Deployment if it Exists
    call kubectl.exe --namespace stage delete deployment %component%
)

:: Create Deployment
call kubectl.exe --namespace stage create -f %component%-dep.yaml

:: Create Service
call kubectl.exe --namespace stage create -f %component%-svc.yaml

:: Show All Components in ClusterIP
call kubectl.exe --namespace stage get all

