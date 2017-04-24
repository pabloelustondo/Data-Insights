/**
 * Created by pabloelustondo on 2017-04-24.
 */

export interface DasDataSet {
    tenantid: string;
    dsid: string;
    dsname?: string;
    data?: any[];
    merge?: DasDataSetMerge;
}


export interface DasDataSetMerge {
    dsid: string;
    commonFeatureName: string;
}