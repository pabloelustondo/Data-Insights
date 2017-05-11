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

export interface DadUserConfig {
 //put in dad models
    userid: string;
    username: string;
    tenantid: string;
    configs: { timeStamp: string,
        charts: DadChart[],
        widgets: DadWidget[],
        tables: DadTable[],
        pages: DadPage[]
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
        //this method will get the current configuration from server and store it in local storage

        let headers = new Headers({ 'Content-Type': 'application/json',  'x-access-token' : this.token});
        let url = config.dadback_url + "/daduser/"+ this.user.userid;
        return this.http.get(url).toPromise();
    }

    public saveUserConfigurationToDdb(){
        //this method will save the current configuration in local storage to the server

        let userconfig = JSON.parse(localStorage.getItem(this.localkey));
        let timeStamp = Date.now().toString();

        let daduserconfig:DadUserConfig = {
            userid: this.user.userid,
            username: this.user.username,
            tenantid: this.user.tenantid,
            configs: { timeStamp: timeStamp,
                charts: userconfig.charts,
                widgets: userconfig.widgets,
                tables: userconfig.tables,
                pages: userconfig.pages
            }
        };

        let headers = new Headers({ 'Content-Type': 'application/json',  'x-access-token' : this.token});
        let url = config.dadback_url + "/daduser/"+ daduserconfig.userid;
        console.log('call in http');
        this.http.post(url, daduserconfig).toPromise().then(
            (res:Response) => {
                console.log('configuration saved' + JSON.stringify(res));
            }).catch(
            (error) =>{
                console.log('configuration failed to save')
            }
        );
    }
/* Everything is same */

//This is tested and works
    public clearLocalCopy(){
        localStorage.removeItem(this.localkey);
    }
//This is tested and works
    public save(elements:DadElement[] ){
        let userconfigJson = JSON.stringify(elements);
        localStorage.setItem(this.localkey,userconfigJson);
        if (!this.config.testing) this.saveUserConfigurationToDdb();
    }
//Under test config
    public saveOne(element:DadElement ){
        let elements:DadElement[];

        this.getConfigs().then((elements:DadElement[]) =>{

                let elementIndex = _.findIndex(elements, function(w) { return w.id == element.id; });
                if(elementIndex === -1){
                    elements.push(element);
                } else {
                    elements.splice(elementIndex, 1, element);
                }
                this.save(elements);
            }
        );
    }
/*This part is created because functions are used in the other components but service will be working under one name
 * since names are casted. DON'T CHANGE!
 */
    public getChartConfigs(): Promise<DadChart[]> {
        return this.getConfigs().then( (config)  => {
            return Promise.resolve(config.configs.charts as DadChart[]);
        })
    }

    public getWidgetConfigs(): Promise<DadWidget[]> {
        return this.getConfigs().then( (config)  => {
            return Promise.resolve(config.configs.widgets as DadWidget[]);
        })
    }

    public getTableConfigs(): Promise<DadTable[]> {
        return this.getConfigs().then( (config)  => {
            return Promise.resolve(config.configs.tables as DadTable[]);
        })
    }


    public getPageConfigs(): Promise<DadPage[]> {
        return this.getConfigs().then( (config)  => {
            return Promise.resolve(config.configs.pages as DadPage[]);
        })
    }
///////////////////////////////////////////////////////////////////////

    //next test
    public getConfigs(): Promise<any> {
        //this method will return the configuration that are expected to be in the local storage.
        //if not we are going to get this from DB. IF we are in test mode we will get it from test data.
        let userconfigString = localStorage.getItem(this.localkey);
        if (userconfigString != null){
            let userconfig = JSON.parse(userconfigString);
            return Promise.resolve(userconfig);
        }

        else {
            return this.getUserConfigurationFromDdb().then(
                (data) => {
                    let dataObj = JSON.parse(data._body)[0];
                    this.saveConfigFromDb(dataObj);
                    let userconfigString = localStorage.getItem(this.localkey);
                    let userconfig = JSON.parse(userconfigString);
                    return Promise.resolve(userconfig as DadElement);
                },
                (error) => {
                    console.log(error);
                }
            );
        }
    }

    public saveConfigFromDb(data){
            let charts = data.config.charts;
            let widgets = data.config.widgets;
            let tables = data.config.tables;
            let pages = data.config.pages;
        //comment: for some reason charts, widgets...etc.. are already JSON...why?
            localStorage.setItem(this.localkey, charts);
            localStorage.setItem(this.localkey, widgets);
            localStorage.setItem(this.localkey, tables);
            localStorage.setItem(this.localkey, pages);
    }

    public getChartConfig(id:string): Promise<any> {
        return this.getChartConfigs().then((charts: DadChart[]) => {
            let chartIndex = _.findIndex(charts, function (w) {
                return w.id == id;
            });
            if (chartIndex > -1) return Promise.resolve(charts[chartIndex]);
            else return Promise.resolve(null);
        });
    }

    public getWidgetConfig(id:string): Promise<any> {
        return this.getWidgetConfigs().then((elements: DadWidget[]) => {
            let index = _.findIndex(elements, function (w) {
                return w.id == id;
            });
            if (index > -1) return Promise.resolve(elements[index]);
            else return Promise.resolve(null);
        });
    }
    public getTableConfig(id:string): Promise<any> {
        return this.getTableConfigs().then((elements: DadTable[]) => {
            let index = _.findIndex(elements, function (w) {
                return w.id == id;
            });
            if (index > -1) return Promise.resolve(elements[index]);
            else return Promise.resolve(null);
        });
    }
    public getPageConfig(id:string): Promise<any> {
        return this.getPageConfigs().then((elements: DadPage[]) => {
            let index = _.findIndex(elements, function (w) {
                return w.id == id;
            });
            if (index > -1) return Promise.resolve(elements[index]);
            else return Promise.resolve(null);
        });
    }

}