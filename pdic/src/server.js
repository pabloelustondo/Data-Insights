/**
 * Created by vdave on 12/6/2016.
 */
var minutes = 1, the_interval = minutes * 5 * 5;
var request = require('request');

setInterval(function() {

    console.log(new Date());

    /* const testPutData = {
        'metadata': 'here is where metadata explaining the data should go',
        'createdAt': '2016-08-08',
        'data': [
            {
                'dev_id': '12345678901234567890123456789012345678901234567890123456789012345678901234567890',
                'server_time_stamp':  new Date(),
                'int_value': 191231231319,
                'stat_type': random(1,99999),
                'time_stamp': new Date()
            }
        ]
    };*/


    const testPutData = {
        'dev_id': '12345678901234567890123456789012345678901234567890123456789012345678901234567890',
        'server_time_stamp':  new Date(),
        'int_value': 191231231319,
        'stat_type': random(1,99999),
        'time_stamp': new Date()
    }
    function random (low,high){
        return Math.floor(Math.random()*(high - low) + low);
    }

    request({
        headers: {
            'X-API-key': 'DiGyphaBjj10CbsNpqBAM2kLGfRAXRob9XYEchxm',
            'Accept': 'application/json'
        },
        json: true,
        url: 'http://localhost:3003/data',
        body : testPutData,
        method: 'POST'
    }, function(error, response, body){
        console.log(JSON.stringify(testPutData));
        if (!error ) {
            console.log(body)
        }
        else{
            console.log(error);

        }
    });

}, the_interval);