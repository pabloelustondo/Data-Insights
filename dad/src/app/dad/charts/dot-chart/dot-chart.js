/**
 * Created by dister on 11/30/2016.
 */
/**
 * Created by dister on 11/30/2016.
 */

var data = {};
var device_owner = [];
jsonData.forEach(function(e) {
    device_owner.push(e.device_owner);
    data[e.device_owner] = e.battery;
})

chart = c3.generate({
    data: {
        json: [ data ],
        keys: {
            value: device_owner
        },
        type:'spline',
    },
    tooltip: {
        format: {
            title: function() {return ('Device Owner');},
        }
    },
    axis: {
        x: {
            label: {
                text: 'Device Owners',
                position: 'outer-right'
            }
        },
        y: {
            label: {
                text: 'Battery %',
                position: 'outer-top'
            }
        }
    }
});