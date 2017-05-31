/**
 * Created by pabloelustondo on 2016-11-19.
 */
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DadChart } from './chart.component';
import { DadConfigService } from './dadconfig.service';
import { DadWidget } from "./widget.component";
import { DadTable } from "./table.component";

declare var d3, c3: any;

@Component({
    selector: 'dadlogin',
    styles:['.row{overflow:hidden;}'],
    providers: [DadConfigService],
    template: ''
})

export class DadLoginComponent implements  OnInit{
    public id_token;

    constructor(private activatedRoute: ActivatedRoute
    ) { }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe((params: Params) => {
            this.id_token = params['id_token'];
            localStorage.setItem('id_token', this.id_token);
            window.location.href = window.location.protocol + '//' + window.location.host
        });
    }
}


