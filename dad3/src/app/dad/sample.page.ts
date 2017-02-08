/**
 * Created by dister on 2/2/2017.
 */
import { DadPage } from './page.component';

export const PAGES: DadPage[] = [
    {id:"batstats",
     name: "Battery Stats",
     widgetids:[ "widget1","widget2","widget3", "widget4"],
     chartids: ['chartbar'],
     tableids: ['table1', 'table2']
    },

    {id:"deviceapps",
        name: "Device Apps Usage Analytics",
        widgetids:['widget_chart1'],
        chartids: [],
        tableids: []
    }
];