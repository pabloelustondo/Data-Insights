/**
 * Created by vdave on 5/5/2017.
 */

export interface TenantMetadata {
    tenantId: string;
    tenantInformation: TenantInformation;
    dataSources: DataSource[];
    streams: Stream[];
    dataLakeInformation: DataLakeInformation;
}

interface DataSource{
    dataSourceId: string;
    dataSourceType: string;
    dataSourceProperties : DataSourceProperty[];
    metaData: DataSourceMetadata;
}


interface DataSourceProperty {
    name: string;
    value: string;
}

interface Stream{
    dataSource: DataSource;
    streamId: string;
}

interface DataLakeInformation{
    connectionString: string;
}

interface TenantInformation {
    name: string;
    address: string;
    phoneNumber: string;
    email: string;
    clientId: string;
    clientSecret: string;
    companyAddress: string;
    companyName: string;
    companyPhone: string;
    idps: IDP[];

}

interface IDP {
    name: string;
    destination: string;
    additionalFields?: any;
}

interface DataSourceMetadata{
    dataSetId: string;
    projections: string[];
}