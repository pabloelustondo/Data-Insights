/**
 * Created by dister on 11/29/2016.
 */
var data = {};
var brand = [];
jsonData.forEach(function(e) {
    brand.push(e.brand);
    data[e.brand] = e.number;
})

chart = c3.generate({
    data: {
        json: [ data ],
        keys: {
            value: brand
        },
        type:'pie',

    },
});