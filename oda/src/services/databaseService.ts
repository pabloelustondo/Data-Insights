/**
 * Created by vdave on 5/8/2017.
 */
let config = require('../../config.json');
let appconfig = require('../../appconfig.json');
let globalConfig = require('../../globalconfig.json');
let sampletenants = require('../../testing/sampleTenants.json');
let _ = require('lodash');
import * as rp from 'request-promise';

export class DatabaseService {

    connectionString: string;
    database: any;
    tenants: any [];

    appConfig: any;

    constructor(ddbUrl: string) {

        this.appConfig = globalConfig;
        if (appconfig.testingmode) {
            this.tenants = sampletenants.tenants;
        } else {
            //TODO: call DDB for this but for now just return  test data


            const headersOptions = {
                'x-api-key': 'kTq3Zu7OohN3R5H59g3Q4PU40Mzuy7J5sU030jPg'
            };

            const options: rp.OptionsWithUrl = {
                json: true,
                method: 'get',
                headers: headersOptions,
                url: globalConfig['ddb_url'] + '/getAllTenants',
            };
            rp(options).then(data => this.tenants = data.tenants).catch(function(err) {
                console.log(err);
            });
        }
    }

    public populateTenants( tenants: any) {

        this.tenants = tenants;

    }

    public getAllDataSets () {
        let dataSets = [];

        // go through each tenant and find the dataSet that needs to be updated listened to
        for ( let tenant of this.tenants) {
            if (tenant.dataSets) {
                for (let dataSet of tenant.dataSets) {
                    dataSets.push({
                        tenantId: tenant.id,
                        dataSet: dataSet
                    });
                }
            }
        }
        return dataSets;
    }

    public getDbFromDataService (){
        let server = require('../server');
        let app = server.app;
        let db = app.get('db');
        return app.get('db');
    }

    public getTenant(tenantId: string) {
        if (this.tenants) {
            return _.find(this.tenants, ['tenantId', tenantId]);
        } else {
            return null;
        }

    }

    public getTenantDataSets(tenant: any, dataSet: string) {

    }

    public findProperty(propertyName: string, propertyValue: string) {
        return _.find(this.tenants, [propertyName, propertyValue]);
    }

    public getUserInfo(userId: string) {
        //TODO: proper implementation

        return {
            userId: "varun",
            tenantId: "varunTenant" + Math.floor(Math.random() * 5 ) + 1
        }
    }

}