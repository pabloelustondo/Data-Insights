import * as Sml from "./sml";
import * as rp from 'request-promise';
import * as P from 'es6-promise';

var json2 = [{
  "_id" : "5946fa7d0c56c36f2b2b32e8",
  "devid" : "73E65B76064901080001-1860F2240600											   ",
  "time_stamp" : "2016-08-22 10:29:59.000000",
  "StatType" : -1,
  "intvalue" : 100
}

  ,
  {
    "_id" : "5946fa7d0c56c36f2b2b32e9",
    "devid" : "73E65B76064901080002-1B9096690600											   ",
    "time_stamp" : "2016-08-22 10:29:59.000000",
    "StatType" : -1,
    "intvalue" : 100
  }

  ,
  {
    "_id" : "5946fa7d0c56c36f2b2b32ea",
    "devid" : "73E65B76064901080005-112074270600											   ",
    "time_stamp" : "2016-08-22 10:29:59.000000",
    "StatType" : -1,
    "intvalue" : 100
  }

  ,
  {
    "_id" : "5946fa7d0c56c36f2b2b32eb",
    "devid" : "73E65B76064901080006-12A0D4720600											   ",
    "time_stamp" : "2016-08-22 10:29:59.000000",
    "StatType" : -1,
    "intvalue" : 10
  }

  ,
  {
    "_id" : "5946fa7d0c56c36f2b2b32ec",
    "devid" : "73E65B76064901080006-18505C6F0600											   ",
    "time_stamp" : "2016-08-22 10:29:59.000000",
    "StatType" : -1,
    "intvalue" : 100
  }

  ,
  {
    "_id" : "5946fa7d0c56c36f2b2b32ed",
    "devid" : "73E65B76064901080007-04C0865C0600											   ",
    "time_stamp" : "2016-08-22 10:29:59.000000",
    "StatType" : -1,
    "intvalue" : 100
  }

  ,
  {
    "_id" : "5946fa7d0c56c36f2b2b32ee",
    "devid" : "73E65B76064901080007-09604E2A0600											   ",
    "time_stamp" : "2016-08-22 10:29:59.000000",
    "StatType" : -1,
    "intvalue" : 100
  }

  ,
  {
    "_id" : "5946fa7d0c56c36f2b2b32ef",
    "devid" : "73E65B76064901080007-1220A2610600											   ",
    "time_stamp" : "2016-08-22 10:29:59.000000",
    "StatType" : -1,
    "intvalue" : 100
  }];


/**
 * Created by pabloelustondo on 2017-06-21.
 */

export class SMLI {
  //This is an abstract class that is supposed to be subclassed
  //However, it should work pretty much as is in node.js/ DPS.
  //Some functions will not be available on client side.

  dataSetProviderlurl:string;   //when using in DPS this is CDL..from client is ODA

  constructor(dataSetProviderlurl:string){
    this.dataSetProviderlurl = dataSetProviderlurl;
  }

  calculateDataSet(dataset:Sml.SmlDataSet, parameters:Sml.SmlParameter[]): Promise<Sml.SmlDataSet>{

    return new Promise((resolve, reject) => {

      //first, we need to get the data from the input data sets on the from
      //for now I will assume there is one and will use this on only.

      let inputdataset = dataset.from[0];

      this.getDataSet(inputdataset, parameters).then(
          (d) => {
            let data = <Sml.SmlDataSet>d;
            //ok, here we have the data and we need to transform if we have transformations defined
            if (dataset.transformations){
              console.log("Number of transformations to apply" + dataset.transformations.length)
              this.transformDataSet(dataset.transformations, data, parameters).then(
                  (data) => {
                    console.log("INSIDE TRANSFORM DATA SET INSIDE CALCUALTE DATA SET" + JSON.stringify(data[0]))
                    resolve(data);
                  },
                  (error) => {console.log("error processing data process" + process + " error: " + error);
                    reject(error);}
              )

            } else {
              console.log("NO transformations to apply" + dataset.transformations);
              resolve(data);
            }

          },
          (error) => {
            reject(error);
          }
      )
    });
  }

  getDataSet(dataset:Sml.SmlDataSet, parameters:Sml.SmlParameter[]): Promise<Sml.SmlDataSet>{
    //call a url api passing parameters in order to get an evaluated data set from a dataset endpoint.
    //we will need somehow to differenciate types of queries...for now let assume something likje CDL
    console.log("getDataSet Callded");
    let url = this.dataSetProviderlurl;
    return new Promise(function(resolve, reject){
      console.log("inside promise url: " + url);

      var options = {
        uri: url,
        method: 'POST',
        body: {id:"devstats1"},
        json:true
      };
      console.log("calling rp with " + JSON.stringify(options));

      rp(options).then((result)=>{
            console.log("rp goet back with results.length" + result.length);
            resolve(result);
          }, (error) => {console.log("rp got error" + error);
            reject(error);}
      );

    });
  }

  transformDataSet(transformations: Sml.SmlTransformation[], dataset:Sml.SmlDataSet, parameters:Sml.SmlParameter[]): Promise<Sml.SmlDataSet>{
    return new Promise((resolve, reject) => {

      console.log("transform Data Set called  ");
      if (!transformations) resolve(dataset);

      console.log("transform Data Set number of transformations " + transformations.length);
      console.log("transform Data Set type of first transformation " + transformations[0].type);

      var trans = transformations[0]; //for now...will take care of rest in a bit

      console.log("trans type " + trans.type);

      if (trans.type === "ProcessDataSet"){
        console.log("transform data set - Ready to apply process data set ");
        this.processData(<Sml.SmlDataProcess>trans, dataset, parameters).then(
            (data) => {
              console.log("INSIDE TRANSFORM DATA SET for real!!");
              resolve(data);
            },
            (error) => {console.log("error processing data process: " + error);
              reject(error);}
            )

      } else {
        console.log("INSIDE TRANSFORM DATA SET for real!! in ELSE");
        resolve(dataset);
      }


    });

  }

  processData(process:Sml.SmlDataProcess, dataset:Sml.SmlDataSet, parameters:Sml.SmlParameter[]): Promise<Sml.SmlDataSet>{
    return new Promise((resolve, reject)  => {

      console.log("PROCESS DATA: " + process.script);

      this.pyTransformation(process.script, dataset, parameters).then(
          (data) => {
            console.log("PROCESS DATA NICE ");
            resolve(data);
          },
          (err) => {
            console.log("PROCESS DATA ERRR " + err);
            reject(err);
          }
      );




    });
  }

  addRowFeature(def:Sml.SmlDataSet, feature:Sml.SmlRowFeature, data:any[]) {
    return new Promise(function(resolve, reject){

      let ss = feature.func;

      //here we add values from parameters
      def.parameters.forEach( function(param){
        let value = param.value;
        let regExp = new RegExp(param.name);
        if(typeof value=="number") {
          ss = ss.replace(regExp, value.toString());
        }
        if(typeof value=="string"){
          ss = ss.replace(regExp, "\'" + value + "\'");
        }
      });

      //at this points ss still have variables reffering to the row but all parameters are fixed

      data.forEach(function(d){
        let ss4r:string; //this expression will be specific for this row
        //here we add values from the record itself
        Object.keys(d).forEach( function(key){
          let value = d[key];
          let regExp = new RegExp(key);
          if(typeof value=="number") {
            ss4r = ss.replace(regExp, value.toString());
          }
          if(typeof value=="string"){
            ss4r = ss.replace(regExp, "\'" + value + "\'");
          }
        });

        let featureValue = eval(ss4r); //we need to secure this..obviously..
        d[feature.name] = featureValue;
        d[feature.name + "_Expression"] = ss4r;

      });


    });

  }

  pyTransformation(code:string, dataset:Sml.SmlDataSet, parameters:Sml.SmlParameter[]):Promise<Sml.SmlDataSet>{
      return new Promise(function(resolve, reject){

        var parameters = `            
                threshold = sys.argv[3]
                shift = sys.argv[2]
                start = sys.argv[4]
                end = sys.argv[5]`;

        var spawn = require('child_process').spawn;
        var arg1 = "def f(data): \n	"+ code;

        console.log('CODE:' + arg1);
        var shift = 0;
        var threshold = 10;
        var start = '2016-08-22';
        var end = '2016-08-23';
        var py = spawn('python', ['compute_input.py', arg1, shift, threshold, start, end] );
        var data = json2;
        var dataout = '';
        var dataout2;

        py.stdout.on('data', function(data){
          dataout += data.toString();
        });

        py.stdout.on('end', function(){
          //console.log('INSIDE PROMISE NODE Got End: ' + dataout);

          try {
            dataout2 = JSON.parse(dataout);
            resolve(dataout2);
          } catch(e){
            reject("cannot parse result   " + e);
          }

        });
        py.stdin.write(JSON.stringify(data));
        py.stdin.end();

      });
    }

}
