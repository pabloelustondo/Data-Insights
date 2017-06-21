::Start Everything

SET installdir= %cd%
cd %installdir%

SET config=local

@echo off
if "%1" == "" (
    echo The variable is empty

) ELSE (
    echo The variable contains %1
    SET config=%1
)

SET configfile=globalconfig_%config%.json
echo configfile %configfile%
@echo on

echo copying globalconfig for %1   %configfile%
copy globalconfigs\%configfile% .\globalconfig.json


echo "copying files to components"
for %%x in ("cdl", "dad", "ddb", "dlm", "dos", "dps", "dss", "ida", "oda", "tmm") do (
    copy .\globalconfig.json .\%%x\globalconfig.json
)

