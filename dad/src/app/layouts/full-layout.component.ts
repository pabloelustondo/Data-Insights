import { Component, OnInit }            from '@angular/core';
import { PAGES } from '../dad/sample.page'
import { DadPage } from "../dad/page.component";
import { DadUser } from "../dad/dadmodels";
let appconfig = require("../../../appconfig.json");

@Component({
    selector: 'app-dashboard',
    templateUrl: './full-layout.component.html'
})
export class FullLayoutComponent implements OnInit {

    user: DadUser;
    testingmode:boolean;
    constructor() {
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

    ngOnInit(): void {
        this.user = JSON.parse(localStorage.getItem('daduser')) as DadUser;
        let pagelinks = this.pagelinks = [];
        let pagenames = this.pagenames = [];
        PAGES.forEach(function(page){
            //"['/dad/page/deviceapps']"
            pagelinks.push("/dad/page/" + page.id);
            pagenames.push(page.name);
        });

        this.testingmode = appconfig.testingmode;
    }
}
