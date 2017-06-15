import { Component, OnInit }            from '@angular/core';
import { PAGES } from '../dad/sample.page'
import { DadPage } from "../dad/page.component";
import { DadConfigService, DadUserConfig } from '../dad/dadconfig.service';
import { ActivatedRoute, Params} from '@angular/router';
import { config } from "../dad/appconfig";
import { DadCrudComponent } from '../dad/crud.component';
import { DadConfigComponent } from '../dad/configuration.component';

let appconfig = require("../../../appconfig.json");

@Component({
    selector: 'app-dashboard',
    providers: [DadConfigService],
    templateUrl: './full-layout.component.html',
    styles: [`.div_hover:hover{background-color:#2c3334}`]
})
export class FullLayoutComponent extends DadCrudComponent implements OnInit {

    user: DadUserConfig;
    testingmode:boolean;
    addingPage: boolean = false;
    pageName: string;
    chartids: string[];
    widgetids: string[];
    tableids: string[];
    newPage: any;
    public selectedPage: DadPage;
    public pages: DadPage[];
    public dirty:boolean = false;

    constructor(private dadConfigService: DadConfigService,private activatedRoute: ActivatedRoute) {
        super();
    }

    pagelinks: string[];
    pagenames: string[];

    public disabled:boolean = false;
    public status:{isopen:boolean} = {isopen: false};

    public toggled(open:boolean):void {
        console.log('Dropdown is now: ', open);
    }

    public toggleDropdown($event:MouseEvent):void {
        $event.preventDefault();
        $event.stopPropagation();
        this.status.isopen = !this.status.isopen;
    }

    logout(){
        localStorage.removeItem('id_token');
        window.location.reload();
    }

    addPage(){
        this.newPage = new DadPage();
        this.newPage.name = this.pageName;
        this.newPage.id = this.pageName;
        this.newPage.chartids = this.chartids;
        this.newPage.widgetids = this.widgetids;
        this.newPage.tableids = this.tableids;
        this.newPage.elementType = 'page';
        this.dadConfigService.saveOne(this.newPage);
        this.dadConfigService.getConfig().then((config) => {
            this.user = config;
            let pagelinks = this.pagelinks = [];
            let pagenames = this.pagenames = [];
            config.configs.filter((config) => config.elementType==="page").forEach(function(page){
                pagelinks.push("/dad/page/" + page.id);
                pagenames.push(page.name);
            });
        });
        this.addingNewPage();
        this.clearField();
    }

    clearField(){
        this.pageName = '';
    }

    addingNewPage(){
        if (!this.addingPage) this.addingPage = true;
        else this.addingPage = false;
    }

    //deletePage(){
      //  DadConfigComponent.bind(this.deletePage());
   // }

    ngOnInit(): void {

            this.activatedRoute.queryParams.subscribe((params: Params) => {
                let id_token = params['id_token'];
                if (id_token){
                localStorage.setItem('id_token', id_token);
                window.location.href = window.location.protocol + '//' + window.location.host};

                this.dadConfigService.getConfig().then((config) => {
                    this.user = config;
                    let pagelinks = this.pagelinks = [];
                    let pagenames = this.pagenames = [];
                    config.configs.filter((config) => config.elementType==="page").forEach(function(page){
                        pagelinks.push("/dad/page/" + page.id);
                        pagenames.push(page.name);
                    });
                });
            });




        this.testingmode = appconfig.testingmode;
    }

    goToAdmin(event){
        window.location.assign(config.dss_url + '/#/home');
    }
}
