::Start Everything

SET installdir= %cd%
cd %installdir%

echo "copy globalconfig %1"
copy globalconfigs\globalconfig%1.json .\globalconfig.json

exit