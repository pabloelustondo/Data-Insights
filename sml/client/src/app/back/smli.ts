import {SmlDataSet, SmlParameter, SmlTransformation} from "./sml";
/**
 * Created by pabloelustondo on 2017-06-21.
 */

export class SMLI {


  getDataSet(datasetDef:SmlDataSet, parameters:SmlParameter[]): Promise<SmlDataSet>{
    //call a url api passing parameters in order to get an evaluated data set

    return new Promise(function(resolve, reject){





    });


    }

  }


  calculateDataSet(datasetDef:SmlDataSet, parameters:SmlParameter[]): SmlDataSet{



    this.


    return result;

  }


  transformDataSet(datasetDef:SmlDataSet, inputDataSet:SmlDataSet, parameters:SmlParameter[]): SmlDataSet{

    let result = new SmlDataSet();
    result.data = inputDataSet.data;  //fpr now until we have filter..

    datasetDef.transformations.forEach(trans=>{

      if (trans.type = "AddRowFeature") this.addFeature(datasetDef, trans,result.data);
      if (trans.type = "ProcessData") this.processData(datasetDef, trans,result.data);

    });

    return result;

  }


  addFeature(def:SmlDataSet, feature:SmlFeature, data:any[]) {

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
      let ss4r; //this expression will be specific for this row
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
  }

  getDataSet(datasets:SmlDataSet[], dataSetId:string): SmlDataSet{
    return datasets.find( ds => (ds.id == dataSetId) )
  }
}
