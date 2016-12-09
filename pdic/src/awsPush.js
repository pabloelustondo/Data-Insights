var awsIot = require('aws-iot-device-sdk');

const AWS      = require('aws-sdk');
const options = ({
    accessKeyId: 'AKIAI724ZGGR5S3APCEQ',
    secretAccessKey: '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'
});
const creds = new AWS.Credentials(options)

const firehose = new AWS.Firehose(
    {
        region : 'us-east-1',
        credentials : creds
    });


const dStreamName = 'da_firehose';


function createRecordParam(data){

    var recordParams = {
        Record: {
            Data: JSON.stringify(data)
        },
        DeliveryStreamName: dStreamName
    };
    return recordParams;
}

function putRecord(data) {
    var recordInput = createRecordParam(data);

    firehose.putRecord(recordInput, function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else {
            console.log("testttt");
        }
        console.log(data);           // successful response
    });
}



module.exports = {
    putRecord: putRecord
}