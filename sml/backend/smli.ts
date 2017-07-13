import * as Sml from "./sml";
import * as rp from 'request-promise';
import * as P from 'es6-promise';
import * as _ from 'lodash';

/**
 * Created by pabloelustondo on 2017-06-21.
 */

export class SMLI { //interpreter for SML

  //SMLI will resolve dataset by executing specificed processes and reading input data from corresponding SOTI DAS services
  //during testing mocks are provided

 // dasConfig =
  dataSetProviderlurl:string;  //for now will change this to config

  constructor(dataSetProviderlurl:string){
    this.dataSetProviderlurl = dataSetProviderlurl;
  }

  calculateDataSet(datasetq:Sml.SmlDataSet): Promise<Sml.SmlDataSet>{
    return new Promise((resolve, reject) => {

      let indatasetq = datasetq.from[0]; //for now..
      this.inheritParameters(indatasetq.parameters, datasetq.parameters);
      this.getDataSet(indatasetq).then(
          (d) => {
            let indataset = <Sml.SmlDataSet>d;
            if (datasetq.transformations){
              this.transformDataSet(datasetq, indataset).then(
                  (data) => {
                    resolve(data);
                  },
                  (error) => {
                    reject(error);}
              )
            } else {
              resolve(indataset);
            }
          },
          (error) => {
            reject(error);
          }
      )
    });
  }

  getDataSet(dataset:Sml.SmlDataSet): Promise<Sml.SmlDataSet>{
    let url = this.dataSetProviderlurl;
    return new Promise(function(resolve, reject){
      var options = {
        uri: url,
        method: 'POST',
        body: {id:"devstats1"},
        json:true
      };
      rp(options).then((result)=>{
            resolve(result);
          }, (error) => {console.log("rp got error" + error);
            reject(error);}
      );
    });
  }

  transformDataSet(datasetq: Sml.SmlDataSet, indataset:Sml.SmlDataSet): Promise<Sml.SmlDataSet>{
    return new Promise((resolve, reject) => {
      if (!datasetq.transformations) resolve(indataset);
      var trans = datasetq.transformations[0]; //for now...will take care of rest in a bit
      if (trans.type === "ProcessDataSet"){
        this.processData(<Sml.SmlDataProcess>trans, datasetq, indataset).then(
            (data) => {
              resolve(data);
            },
            (error) => {
              reject(error);}
            )
      } else {
        resolve(indataset);
      }
    });
  }

  processData(process:Sml.SmlDataProcess, datasetq:Sml.SmlDataSet, indataset:Sml.SmlDataSet): Promise<Sml.SmlDataSet>{
    return new Promise((resolve, reject)  => {
      this.pyTransformation(process.script, datasetq, indataset).then(
          (data) => {
            resolve(data);
          },
          (err) => {
            reject(err);
          }
      );
    });
  }

  addRowFeature(def:Sml.SmlDataSet, feature:Sml.SmlRowFeature, data:any[]) {
    return new Promise(function(resolve, reject){

      let ss = feature.script;

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

  pyTransformation(code:string, datasetq:Sml.SmlDataSet,  indataset:Sml.SmlDataSet):Promise<Sml.SmlDataSet>{
      return new Promise(function(resolve, reject){

        var spawn = require('child_process').spawn;
        //trying to add arguments using a prefix
        /*

         start = '2016-08-22'
         end = '2016-08-23'
         */
        let ps = datasetq.parameters;
        let pyparameters = "";

        pyparameters += "    " + ps[1].name + " = "+ ps[1].value +"\n";



      //  let pyparameters = "    " + ps[1].name + " = "+ ps[1].value +"\n    "+ ps[2].name +" = '"+ ps[2].value +"'\n    end = '2016-08-23'\n    shift = 0";
        var arg1 = "def f(data):\n" + pyparameters + code;

        console.log('CODE:' + arg1);
        var shift = 0;
        var threshold = 10;
        var start = '2016-08-22';
        var end = '2016-08-23';
        var json = JSON.stringify( {name:'pablo', age:52});
        var params = ['compute_input.py', arg1, shift, threshold, start, end];
   //     params.push(end);
        var py = spawn('python', params );
        var data = indataset;
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

  inheritParameters(specificParameters:Sml.SmlParameter[], generalParameters:Sml.SmlParameter[]):Sml.SmlParameter[]{

  generalParameters.forEach(function(gparam){
    if (!_.find(specificParameters, function(sparam){ sparam.name == gparam.name})){
      if (!specificParameters) specificParameters = [];
      specificParameters.push(gparam);
    }
  });

  return specificParameters;

  }


}
