echo "ODA"
./node_modules/.bin/cucumberjs -f pretty features\\ODA.feature -f pretty -f json:test/report/cucumber_report_ODA.json
echo "IDA"
./node_modules/.bin/cucumberjs -f pretty features\\IDA.feature -f pretty -f json:test/report/cucumber_report_IDA.json
echo "CB-425"
./node_modules/.bin/cucumberjs -f pretty features\\CB-425.feature -f pretty -f json:test/report/cucumber_report_CB-425.json
echo "CB-438"
./node_modules/.bin/cucumberjs -f pretty features\\CB-438.feature -f pretty -f json:test/report/cucumber_report_CB-438.json
echo "CB-437"
./node_modules/.bin/cucumberjs -f pretty features\\CB-437.feature -f pretty -f json:test/report/cucumber_report_CB-437.json
echo "CB-505"
./node_modules/.bin/cucumberjs -f pretty features\\CB-505.feature -f pretty -f json:test/report/cucumber_report_CB-505.json