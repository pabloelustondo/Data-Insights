/**
 * Created by dister on 5/2/2017.
 */
import { Injectable } from '@angular/core';
import { CHARTS } from './sample.charts';
import { DadChart } from './chart.component';
import { DadWidget } from "./widget.component";
import { DadTable } from "./table.component";
import { DadPage } from "./page.component";
import { WIDGETS } from "./sample.widgets";
import { TABLES } from "./sample.tables";
import { PAGES } from './sample.page';
import { DadElement } from './dadmodels';
import * as _ from "lodash";
import { Headers, Http,URLSearchParams, Response, RequestOptions } from '@angular/http';
import { config } from "./appconfig";
import { Observable } from 'rxjs/Rx';
import { DadUser } from "./dadmodels";
import { JwtHelper } from 'angular2-jwt';

export class DadUserConfig {
 //put in dad models
    userid: string;
    username: string;
    tenantid: string;
    timeStamp: string;
    configs: DadElement[];

    constructor(user:DadUser){
        this.username = user.username;
        this.tenantid = user.tenantid;
        this.userid = user.userid;
        this.timeStamp = new Date().toDateString();
        this.configs = [];
    }

    addDefaultConfiguration(){
        CHARTS.forEach((e) => {
            e.elementType = 'chart'
            this.configs.push(e);});

        WIDGETS.forEach((e) => {
            e.elementType = 'widget'
            this.configs.push(e);});

        TABLES.forEach((e) => {
            e.elementType = 'table'
            this.configs.push(e);});

        PAGES.forEach((e) => {
            e.elementType = 'page'
            this.configs.push(e);});
    }
}


@Injectable()
export class DadConfigService {
//This service provides the whole configuration for the current user. This configuration is tored both in the database and in local storage.
// Every time a change is made the updated configuration is sent to the database.
// when teh service is called to get a configuration that data comes normally comming from the local storage.
// We still need create a mechanism to automatically update the configuration in the browser if a change was de tected in teh database
    user:DadUser;
    token: string;
    jwtHelper = new JwtHelper();
    localkeyPrefix  = "userconfig"; //
    localkey;  //the user configuratino will be saved in local storage with the key 'tenanid_username_<localkeyPrefix>'
    config = config;

    constructor(private http: Http) {
        if (config.testing){
            this.user = {username:"user", tenantid:"test", userid:"test-user"};
        } else {
            let token = localStorage.getItem('id_token');
            let u =  this.jwtHelper.decodeToken(token);
            let username = u.username;
            let tenantid = u.tenantId;
            let userid = tenantid + "-" + username;
            this.user = {username:username, tenantid:tenantid, userid:userid};
        }
        localStorage.setItem('daduser',JSON.stringify(this.user));
        this.localkey = this.user.username + '_' + this.user.username +'_'+ this.localkeyPrefix;
    }

    public getUserConfigurationFromDdb(): Promise<any>{
        let headers = new Headers({ 'Content-Type': 'application/json',  'x-access-token' : this.token});
        let url = config.dadback_url + "/daduser/"+ this.user.userid;
        return this.http.get(url).toPromise();
    }

    public saveUserConfigurationToDdb(){
        //this method will save the current configuration in local storage to the server

        if (config.testing) return;

        let daduserconfig = JSON.parse(localStorage.getItem(this.localkey)) as DadUserConfig;
        let timeStamp = Date.now().toString();

        let headers = new Headers({ 'Content-Type': 'application/json',  'x-access-token' : this.token});
        let url = config.dadback_url + "/daduser/"+ daduserconfig.userid;

        this.http.post(url, daduserconfig).toPromise().then(
            (res:Response) => {
                console.log('configuration saved' + JSON.stringify(res));
            }).catch(
            (error) =>{
                alert("Failed to save configuration to database " + error);
                console.log('configuration failed to save')
            }
        );
    }
/* Everything is same */

//This is tested and works

    public resetToDefaultConfiguration(){
        let newUserConfig = new DadUserConfig(this.user);
        newUserConfig.addDefaultConfiguration();
        localStorage.setItem(this.localkey,JSON.stringify(newUserConfig));
        this.saveUserConfigurationToDdb();
    }

    public clearLocalCopy(){
        localStorage.removeItem(this.localkey);
    }
//This is tested and works
    public saveOne(element:DadElement ){
        this.save([element]);
    }

//Under test config
    public save(elements:DadElement[] ){
        let daduserconfig = JSON.parse(localStorage.getItem(this.localkey)) as DadUserConfig;
        if (!daduserconfig) daduserconfig = new DadUserConfig(this.user);
        let configs = daduserconfig.configs;

        elements.forEach((element) => {
            let elementIndex = _.findIndex(configs, function(w) { return w.id == element.id; });

            if(elementIndex === -1){
                configs.push(element);
            } else {
                configs.splice(elementIndex, 1, element);
            }
        });

        localStorage.setItem(this.localkey,JSON.stringify(daduserconfig));
        this.saveUserConfigurationToDdb();

    }

    //next test
    public getConfig(): Promise<DadUserConfig> {
        //this method will return the configuration that are expected to be in the local storage.
        //if not we are going to get this from DB. IF we are in test mode we will get it from test data.
        let userconfigString = localStorage.getItem(this.localkey);
        if (userconfigString != null){
            let userconfig = JSON.parse(userconfigString) as DadUserConfig;
            return Promise.resolve(userconfig);
        };

        if (config.testing){
            let newUserConfig = new DadUserConfig(this.user);
            newUserConfig.addDefaultConfiguration();
            localStorage.setItem(this.localkey,JSON.stringify(newUserConfig));
            return Promise.resolve(newUserConfig);
        }
        else {
            return this.getUserConfigurationFromDdb().then(
                (data) => {
                    let userConfig = JSON.parse(data._body)[0];
                    if (userConfig){
                        localStorage.setItem(this.localkey, JSON.stringify(userConfig));
                        return Promise.resolve(userConfig as DadUserConfig);
                    } else {
                        //create brand new configuration
                        let newUserConfig = new DadUserConfig(this.user);
                        newUserConfig.addDefaultConfiguration();
                        localStorage.setItem(this.localkey,JSON.stringify(newUserConfig));
                        return Promise.resolve(newUserConfig);
                    }
                },
                (error) => {
                    alert("error in getConfig()" + error.toString());
                    return Promise.resolve({}); //TO-DO fix this not sure what to do in case of error
                }
            );
        }
    }


    /*This part is created because functions are used in the other components but service will be working under one name
     * since names are casted. DON'T CHANGE!
     */
    public getChartConfigs(): Promise<DadChart[]> {
        return this.getConfig().then( (config)  => {
            let charts = _.filter(config.configs, (config) => config.elementType=='chart');
            return Promise.resolve(charts as DadChart[]);
        })
    }

    public getWidgetConfigs(): Promise<DadWidget[]> {
        return this.getConfig().then( (config)  => {
            let elements = _.filter(config.configs, (config) => config.elementType=='widget');
            return Promise.resolve(elements as DadWidget[]);
        })
    }

    public getTableConfigs(): Promise<DadTable[]> {
        return this.getConfig().then( (config)  => {
            let elements = _.filter(config.configs, (config) => config.elementType=='table');
            return Promise.resolve(elements as DadTable[]);
        })
    }


    public getPageConfigs(): Promise<DadPage[]> {
        return this.getConfig().then( (config)  => {
            let elements = _.filter(config.configs, (config) => config.elementType=='page');
            return Promise.resolve(elements as DadPage[]);
        })
    }

    public getChartConfig(id:string): Promise<DadChart> {
        return this.getConfig().then( (config)  => {
            let charts = _.filter(config.configs, (config) => config.elementType=='chart' && config.id==id);
            return Promise.resolve(charts[0] as DadChart);
        })
    }

    public getWidgetConfig(id:string): Promise<DadWidget> {
        return this.getConfig().then( (config)  => {
            let elements = _.filter(config.configs, (config) => config.elementType=='widget' && config.id==id);
            return Promise.resolve(elements[0] as DadWidget);
        })
    }

    public getTableConfig(id:string): Promise<DadTable> {
        return this.getConfig().then( (config)  => {
            let elements = _.filter(config.configs, (config) => config.elementType=='table' && config.id==id);
            return Promise.resolve(elements[0] as DadTable);
        })
    }


    public getPageConfig(id:string): Promise<DadPage> {
        return this.getConfig().then( (config)  => {
            let elements = _.filter(config.configs, (config) => config.elementType=='page' && config.id==id);
            return Promise.resolve(elements[0] as DadPage);
        })
    }

}