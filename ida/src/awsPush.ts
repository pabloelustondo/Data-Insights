const config = require('../appconfig.json');
const AWS      = require('aws-sdk');
const options = ({
    accessKeyId: config['aws-accessKeyId'],
    secretAccessKey: config['aws-secretAccessKey']
});
const creds = new AWS.Credentials(options);

const firehose = new AWS.Firehose(
    {
        region : config['aws-region'],
        credentials : creds
    });


const dStreamName = 'da_firehose';


function createRecordParam(data: any) {

    const recordParams = {
        Record: {
            Data: JSON.stringify(data)
        },
        DeliveryStreamName: dStreamName
    };
    return recordParams;
}

 function putRecord(data: any) {
    let recordInput = createRecordParam(data);

    firehose.putRecord(recordInput, function (err: any , data1: any ) {
        if (err) {
            console.log(err, err.stack); // an error occurred
        } else {
          //  console.log('testttt');
        }
      //  console.log(data1);           // successful response
    });
}



module.exports = {
    putRecord: putRecord
};

/**
 * Created by vdave on 12/8/2016.
 */
