/**
 * Created by vdave on 5/5/2017.
 */
export interface InputDataModel {
    metadata: InsightsMetadata;
    data: any;
}

interface InsightsMetadata {
    dataSetId: string;
    projections: string[];
}