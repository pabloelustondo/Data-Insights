/**
 * Created by pabloelustondo on 2016-11-21.
 * TODO: This code needs urgent refactor to avoid the same code repeated 4 times!!!!!!
 * we need to create one
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
import * as _ from "lodash";
import { Headers, Http,URLSearchParams, Response, RequestOptions } from '@angular/http';
import { config } from "./appconfig";
import { Observable } from 'rxjs/Rx';
import { DadUser } from "./dadmodels";
import { JwtHelper } from 'angular2-jwt';

@Injectable()
export class DadChartConfigsService {

    user:DadUser;
    token: string;
    jwtHelper = new JwtHelper();

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
    }

  public getUserConfigurationFromDdb(): Promise<any>{
    //this method will get the current configuration from server and store it in local storage

    let headers = new Headers({ 'Content-Type': 'application/json',  'x-access-token' : this.token});
    let url = config.dadback_url + "/daduser/"+ this.user.userid;
    return this.http.get(url).toPromise();
  }



  public saveUserConfigurationToDdb(){
      //this method will save the current configuration in local storage to the server
      let charts = localStorage.getItem("chartdata");
      let widgets = localStorage.getItem("widgetdata");
      let tables = localStorage.getItem("tabledata");
      let pages = localStorage.getItem("pagedata");
      let timeStamp = Date.now().toString();
      let daduserconfig = {
        userid: this.user.userid,
        username: this.user.username,
        tenantid: this.user.tenantid,
        config: { timeStamp: timeStamp,
                  charts: charts,
                  widgets: widgets,
                  tables:tables,
                  pages:pages}
      }

      let headers = new Headers({ 'Content-Type': 'application/json',  'x-access-token' : this.token});
      let url = config.dadback_url + "/daduser/"+ daduserconfig.userid;
      this.http.post(url, daduserconfig).toPromise().then(
          (res:Response) => {
            console.log('configuration saved' + JSON.stringify(res));
          }).catch(
          (error) =>{
            console.log('configuration failed to save')
          }
         );
    }

    public clearLocalCopy(){
      localStorage.removeItem("chartdata");
    }

  public save(charts:DadChart[] ){
    let charts_string = JSON.stringify(charts);
    localStorage.setItem("chartdata",charts_string);
    if (!config.testing) this.saveUserConfigurationToDdb();
  }

  public saveOne(chart:DadChart ){
    let charts:DadChart[];

    this.getChartConfigs().then((charts:DadChart[]) =>{

        let chartIndex = _.findIndex(charts, function(w) { return w.id == chart.id; });
    if(chartIndex === -1){
      charts.push(chart);
    } else {
      charts.splice(chartIndex, 1, chart);
    }
    this.save(charts);
    }
    );

  }

    public getChartConfigs(): Promise<any> {
      let charts_string = localStorage.getItem("chartdata");

      if (charts_string == null && config.testing){
        localStorage.setItem("chartdata", JSON.stringify(CHARTS));
        return Promise.resolve(CHARTS);
      }



      if (charts_string != null || !config.testing){
        let charts_obj = JSON.parse(charts_string);
        let DATA = charts_obj as DadChart[];
        return Promise.resolve(DATA);
      }
      else {
        return this.getUserConfigurationFromDdb().then(
            (data) => {
              let dataObj = JSON.parse(data._body)[0];
              this.saveConfigFromDb(dataObj);
              let chartsString = localStorage.getItem("chartdata");
              let charts = JSON.parse(chartsString);
              return Promise.resolve(charts);
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
      localStorage.setItem("chartdata", charts);
      localStorage.setItem("widgetdata", widgets);
      localStorage.setItem("tabledata", tables);
      localStorage.setItem("pagedata", pages);
    }

  public getChartConfig(id:string): Promise<DadChart> {
    return this.getChartConfigs().then((charts:DadChart[]) =>{
      let chartIndex = _.findIndex(charts, function(w) { return w.id == id; });
      if (chartIndex>-1) return Promise.resolve(charts[chartIndex]);
      else return Promise.resolve(null);
    });
  }
}

@Injectable()
export class DadWidgetConfigsService {

  user:DadUser;
  token: string;
  jwtHelper = new JwtHelper();

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
  }

  public getUserConfigurationFromDdb(): Promise<any>{
    //this method will get the current configuration from server and store it in local storage

    let headers = new Headers({ 'Content-Type': 'application/json',  'x-access-token' : this.token});
    let url = config.dadback_url + "/daduser/"+ this.user.userid;
    return this.http.get(url).toPromise();
  }

  public saveUserConfigurationToDdb(){
    //this method will save the current configuration in local storage to the server
    let charts = localStorage.getItem("chartdata");
    let widgets = localStorage.getItem("widgetdata");
    let tables = localStorage.getItem("tabledata");
    let pages = localStorage.getItem("pagedata");
    let timeStamp = Date.now().toString();
    let daduserconfig = {
      userid: this.user.userid,
      username: this.user.username,
      tenantid: this.user.tenantid,
      config: { timeStamp: timeStamp,
        charts: charts,
        widgets: widgets,
        tables:tables,
        pages:pages}
    }

    let headers = new Headers({ 'Content-Type': 'application/json',  'x-access-token' : this.token});
    let url = config.dadback_url + "/daduser/"+ daduserconfig.userid;
    this.http.post(url, daduserconfig).toPromise().then(
        (res:Response) => {
          console.log('configuration saved' + JSON.stringify(res));
        }).catch(
        (error) =>{
          console.log('configuration failed to save')
        }
    );
  }

  public saveConfigFromDb(data){
    let charts = data.config.charts;
    let widgets = data.config.widgets;
    let tables = data.config.tables;
    let pages = data.config.pages;

    //comment: for some reason charts, widgets...etc.. are already JSON...why?
    localStorage.setItem("chartdata", charts);
    localStorage.setItem("widgetdata", widgets);
    localStorage.setItem("tabledata", tables);
    localStorage.setItem("pagedata", pages);
  }

  public clearLocalCopy(){
    localStorage.removeItem("widgetdata");
  }

  public saveOne(widget:DadWidget ){
    let widgets:DadWidget[];

    this.getWidgetConfigs().then((widgets:DadWidget[]) =>{

          let chartIndex = _.findIndex(widgets, function(w) { return w.id == widget.id; });
          if(chartIndex === -1){
            widgets.push(widget);
          } else {
            widgets.splice(chartIndex, 1, widget);
          }
          this.save(widgets);
        }
    );
  }

public save(widgets:DadWidget[] ){
  let widgets_string = JSON.stringify(widgets);
  localStorage.setItem("widgetdata",widgets_string);
  if (!config.testing) this.saveUserConfigurationToDdb();
}

public getWidgetConfig(id:string): Promise<DadWidget> {
    return this.getWidgetConfigs().then((widgets:DadWidget[]) =>{
      let widgetIndex = _.findIndex(widgets, function(w) { return w.id == id; });
      if (widgetIndex>-1) return Promise.resolve(widgets[widgetIndex]);
      else return Promise.resolve(null);
    }
);
}

  public getWidgetConfigs(): Promise<any> {
    let widgets_string = localStorage.getItem("widgetdata");

    if (widgets_string==null && config.testing){
      localStorage.setItem("widgetdata", JSON.stringify(WIDGETS));
      return Promise.resolve(WIDGETS);
    }


    if (widgets_string != null || !config.testing){
      let widgets_obj = JSON.parse(widgets_string);
      let DATA = widgets_obj as DadWidget[];
      return Promise.resolve(DATA);
    }
    else {
      return this.getUserConfigurationFromDdb().then(
          (data) => {
            let dataObj = JSON.parse(data._body)[0];
            this.saveConfigFromDb(dataObj);
            let widgetsString = localStorage.getItem("widgetdata");
            let widgets = JSON.parse(widgetsString);
            return Promise.resolve(widgets);
          },
          (error) => {
            console.log(error);
          }
      );
    }
  }



}

@Injectable()
export class DadTableConfigsService {

  user:DadUser;
  token: string;
  jwtHelper = new JwtHelper();

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
  }

  public getUserConfigurationFromDdb(): Promise<any>{
    //this method will get the current configuration from server and store it in local storage

    let headers = new Headers({ 'Content-Type': 'application/json',  'x-access-token' : this.token});
    let url = config.dadback_url + "/daduser/"+ this.user.userid;
    return this.http.get(url).toPromise();
  }

  public saveUserConfigurationToDdb(){
    //this method will save the current configuration in local storage to the server
    let charts = localStorage.getItem("chartdata");
    let widgets = localStorage.getItem("widgetdata");
    let tables = localStorage.getItem("tabledata");
    let pages = localStorage.getItem("pagedata");
    let timeStamp = Date.now().toString();
    let daduserconfig = {
      userid: this.user.userid,
      username: this.user.username,
      tenantid: this.user.tenantid,
      config: { timeStamp: timeStamp,
        charts: charts,
        widgets: widgets,
        tables:tables,
        pages:pages}
    }

    let headers = new Headers({ 'Content-Type': 'application/json',  'x-access-token' : this.token});
    let url = config.dadback_url + "/daduser/"+ daduserconfig.userid;
    this.http.post(url, daduserconfig).toPromise().then(
        (res:Response) => {
          console.log('configuration saved' + JSON.stringify(res));
        }).catch(
        (error) =>{
          console.log('configuration failed to save')
        }
    );
  }

  public saveConfigFromDb(data){
    let charts = data.config.charts;
    let widgets = data.config.widgets;
    let tables = data.config.tables;
    let pages = data.config.pages;

    //comment: for some reason charts, widgets...etc.. are already JSON...why?
    localStorage.setItem("chartdata", charts);
    localStorage.setItem("widgetdata", widgets);
    localStorage.setItem("tabledata", tables);
    localStorage.setItem("pagedata", pages);
  }

  public clearLocalCopy(){
    localStorage.removeItem("tabledata");
  }

  public save(tables:DadTable[] ){
    let tables_string = JSON.stringify(tables);
    localStorage.setItem("tabledata",tables_string);
    if (!config.testing) this.saveUserConfigurationToDdb();

  }

  public saveOne(table:DadTable ){
    let tables:DadTable[] = this.getTableConfigs();
    let tableIndex = _.findIndex(tables, function(w) { return w.id == table.id; });
    if(tableIndex === -1){
      tables.push(table);
    } else {
      tables.splice(tableIndex, 1, table);
    }
    this.save(tables);
  }

  public getTableConfig(id:string): DadTable {
    let tables = this.getTableConfigs();
    let tableIndex = _.findIndex(tables, function(w) { return w.id == id; });
    return tables[tableIndex];
  }

  public getTableConfigs(): DadTable[] {
    let tables_string = localStorage.getItem("tabledata");

    if (tables_string == null && config.testing) {
      localStorage.setItem("tabledata", JSON.stringify(TABLES));
      return TABLES;
    }


    if (tables_string != null || !config.testing){
      let table_obj = JSON.parse(tables_string);
      let DATA = table_obj as DadTable[];
      return DATA;
    }
    else {
      let tables_string = JSON.stringify(TABLES);
      localStorage.setItem("tabledata",tables_string);
      return TABLES;
    }
  }
}

@Injectable()
export class DadPageConfigsService {

  user:DadUser;
  token: string;
  jwtHelper = new JwtHelper();

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
  }

  public getUserConfigurationFromDdb(): Promise<any>{
    //this method will get the current configuration from server and store it in local storage

    let headers = new Headers({ 'Content-Type': 'application/json',  'x-access-token' : this.token});
    let url = config.dadback_url + "/daduser/"+ this.user.userid;
    return this.http.get(url).toPromise();
  }

  public saveUserConfigurationToDdb(){
    //this method will save the current configuration in local storage to the server
    let charts = localStorage.getItem("chartdata");
    let widgets = localStorage.getItem("widgetdata");
    let tables = localStorage.getItem("tabledata");
    let pages = localStorage.getItem("pagedata");
    let timeStamp = Date.now().toString();
    let daduserconfig = {
      userid: this.user.userid,
      username: this.user.username,
      tenantid: this.user.tenantid,
      config: { timeStamp: timeStamp,
        charts: charts,
        widgets: widgets,
        tables:tables,
        pages:pages}
    }

    let headers = new Headers({ 'Content-Type': 'application/json',  'x-access-token' : this.token});
    let url = config.dadback_url + "/daduser/"+ daduserconfig.userid;
    this.http.post(url, daduserconfig).toPromise().then(
        (res:Response) => {
          console.log('configuration saved' + JSON.stringify(res));
        }).catch(
        (error) =>{
          console.log('configuration failed to save')
        }
    );
  }

  public saveConfigFromDb(data){
    let charts = data.config.charts;
    let widgets = data.config.widgets;
    let tables = data.config.tables;
    let pages = data.config.pages;

    //comment: for some reason charts, widgets...etc.. are already JSON...why?
    localStorage.setItem("chartdata", charts);
    localStorage.setItem("widgetdata", widgets);
    localStorage.setItem("tabledata", tables);
    localStorage.setItem("pagedata", pages);
  }

  public clearLocalCopy(){
    localStorage.removeItem("pagedata");
  }

  public save(pages:DadPage[] ){
    let pages_string = JSON.stringify(pages);
    localStorage.setItem("pagedata",pages_string);
    if (!config.testing) this.saveUserConfigurationToDdb();
  }

  public saveOne(page:DadPage ){
    let pages:DadPage[] = this.getPageConfigs();
    let pageIndex = _.findIndex(pages, function(w) { return w.id == page.id; });
    if(pageIndex === -1){
      pages.push(page);
    } else {
      pages.splice(pageIndex, 1, page);
    }
    this.save(pages);
  }

  public getPageConfig(id:string): DadPage {
    let pages = this.getPageConfigs();
    let pageIndex = _.findIndex(pages, function(w) { return w.id == id; });
    return pages[pageIndex];
  }

  public getPageConfigs(): DadPage[] {

    let pages_string = localStorage.getItem("pagedata");

    if (pages_string != null || !config.testing){
      let page_obj = JSON.parse(pages_string);
      let DATA = page_obj as DadPage[];
      return DATA;
    }
    else {
      let pages_string = JSON.stringify(PAGES);
      localStorage.setItem("pagedata",pages_string);
      return PAGES;
    }
  }
}

