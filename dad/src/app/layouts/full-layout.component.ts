import { Component, OnInit }            from '@angular/core';
import { PAGES } from '../dad/sample.page'
import { DadPage } from "../dad/page.component";
import { DadConfigService, DadUserConfig } from '../dad/dadconfig.service';
import { ActivatedRoute, Params} from '@angular/router';
import { config } from "../dad/appconfig";

let appconfig = require("../../../appconfig.json");

@Component({
    selector: 'app-dashboard',
    providers: [DadConfigService],
    templateUrl: './full-layout.component.html'
})
export class FullLayoutComponent implements OnInit {

    user: DadUserConfig;
    testingmode:boolean;
    parentRouter;

    constructor(private dadConfigService: DadConfigService,private activatedRoute: ActivatedRoute) {}

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
