@echo off
:: Get Component Argument
set component=%1
set location=%2
cd %cd%/%location%

:: Create Docker Image
docker build -t ae7bf2c134d5f11e7a174123ab8f20a4-1306207793.us-east-1.elb.amazonaws.com:5494/%component%:sprint-16Demo3 .

:: Kill Previous Docker Runtimes
docker rm $(docker ps -a -q) -f

:: Run Docker Image In Seperate CMD / Test Docker Runtime
:: start call docker run --rm -p 8000:%port% ae7bf2c134d5f11e7a174123ab8f20a4-1306207793.us-east-1.elb.amazonaws.com:5494/%component%:sprint-16 && curl localhost:%port%/test

docker push ae7bf2c134d5f11e7a174123ab8f20a4-1306207793.us-east-1.elb.amazonaws.com:5494/%component%:sprint-16Demo3

:: DEVEL OPTION
set deleteOld=%3%
IF "%deleteOld%"=="true" (
    :: Will Delete Old Deployment if it Exists
    call kubectl.exe --namespace demo delete deployment %component%

    :: Create Deployment
    call kubectl.exe --namespace demo create -f %component%-dep.yaml
)

IF "%4%"=="true" (
    call kubectl.exe --namespace demo delete service %component%-svc
    
    :: Create Service
    call kubectl.exe --namespace demo  create -f %component%-svc.yaml
)


:: Show All Components in ClusterIP
call kubectl.exe --namespace demo get all

