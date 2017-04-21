import {Component, resolveForwardRef} from '@angular/core';
import {DasMetadata} from "../model/DasMetadata";
import {DasMetadataService} from "./dasmetadata.service";

@Component({
  selector: 'app-root',
  template: `
      <h1>SOTI Insights - Metadata Management - Proof of Concept</h1>
      <table style="border:solid">
      <tr>
        <td style="min-width: 200px"><h2>Data Sources</h2></td>
        <td style="min-width: 200px"><h2>Data Sets</h2></td>
      </tr>     
      </table>
           
   `
})
export class AppComponent {

  tenantId: String = "test";  //obviusly for now this will come from jwt
  md: DasMetadata;
  constructor( private dasMetadataService: DasMetadataService){}

 OnInit(){
   this.refreshMetadata();
 }

 refreshMetadata(){
   this.dasMetadataService.get(this.tenantId).then((md)=>{
     this.md = md;
   })
 }

}
