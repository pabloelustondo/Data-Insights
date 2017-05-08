/**
 * Created by vdave on 5/8/2017.
 */
export interface ClientData {
    idaMetadata: IdaMetadata;
    clientData: InputData;
}

interface IdaMetadata {
    tenantId: string;
    timeStamp: string;
    dataSourceId: string;
}

interface InputData {
    metadata: any;
    data: any;
}