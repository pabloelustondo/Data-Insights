/**
 * Created by dister on 11/30/2016.
 */

var data = {};
var team = [];
jsonData.forEach(function(e) {
    team.push(e.team);
    data[e.team] = e.number_of_members;
})

chart = c3.generate({
    data: {
        json: [ data ],
        keys: {
            value: team
        },
        type:'bar',
    },
    tooltip: {
        format: {
            title: function(value) {return ('Teams');}
        }
    },
    axis: {
        x: {
            label: {
                text: 'Teams',
                position: 'outer-right'
            }
        },
        y: {
            label: {
                text: 'Number of Members',
                position: 'outer-top'
            }
        }
    }
});