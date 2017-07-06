import * as Sml from "./sml";
import * as rp from 'request-promise';
import * as P from 'es6-promise';

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

  getDataSet(datasetDef:Sml.SmlDataSet, parameters:Sml.SmlParameter[]): Promise<Sml.SmlDataSet>{
    //call a url api passing parameters in order to get an evaluated data set from a dataset endpoint.
    //we will need somehow to differenciate types of queries...for now let assume something likje CDL
    console.log("getDataSet Callded");
    let url = this.dataSetProviderlurl;
    return new Promise(function(resolve, reject){
      console.log("inside promise url: " + url);

      var options = {
        uri: url,
        method: 'POST',
        body: {id:"devstats2"},
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

  calculateDataSet(datasetDef:Sml.SmlDataSet, parameters:Sml.SmlParameter[]): Promise<Sml.SmlDataSet>{
    console.log("calculte DataSet Callded");
    let url = this.dataSetProviderlurl;

    return new Promise((resolve, reject) => {
      console.log("calling getdataset indide calculate");
      this.getDataSet(datasetDef, parameters).then(
          (data) => {
            resolve(data);
          },
          (error) => {
            reject(error);
          }
      )
    });
  }


  transformDataSet(datasetDef:Sml.SmlDataSet, inputDataSet:Sml.SmlDataSet, parameters:Sml.SmlParameter[]): Promise<Sml.SmlDataSet>{
    return new Promise(function(resolve, reject){

      let result = new Sml.SmlDataSet();
      result.data = inputDataSet.data;  //fpr now until we have filter..

      datasetDef.transformations.forEach(trans => {
        //   if (trans.type = "AddRowFeature") this.addRowFeature(datasetDef, (Sml.SmlRowFeature)trans,result.data);
        if (typeof trans === "SmlDataProcess") this.processData(datasetDef, <Sml.SmlDataProcess><Object> trans)
            .then(function(resultDataSet:Sml.SmlDataSet) {
              result.data = resultDataSet.data;
              resolve(result);
            });

      })
    });

  }

  processData(def:Sml.SmlDataSet, process:Sml.SmlDataProcess): Promise<Sml.SmlDataSet>{
    return new Promise(function(resolve, reject){


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

}
