import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }        from '@angular/forms';

import { HttpModule } from '@angular/http';

import {ToastModule} from 'ng2-toastr/ng2-toastr';

import { TooltipModule } from 'ng2-bootstrap/ng2-bootstrap';

require('node_modules/bootstrap/dist/css/bootstrap.min.css');
require('node_modules/ng2-toastr/bundles/ng2-toastr.min.css');

//
// App-specific
//
//import { routing, appRoutingProviders } from './app.routes';

import { AppComponent }  from './app.component';

import { DcComponent }  from './dc.component';
import { HelpComponent } from './help.component';
import { InfoComponent } from './info.component';
import { AboutComponent } from './about.component';

import { AppService }  from './app.service';

@NgModule({
  imports: [
    BrowserModule, 
    FormsModule,
    HttpModule,
    ToastModule,
    TooltipModule
    //routing
    ],
  providers: [
    AppService
    //appRoutingProviders
    ],
  exports: [ AppComponent ],
  declarations: [
    AppComponent,
    DcComponent,
    HelpComponent,
    InfoComponent,
    AboutComponent
    ],
  // WORKAROUND: we need only AppComponent. We add also other components because otherwise production build does not work
  bootstrap: [ AppComponent, DcComponent, InfoComponent, HelpComponent, AboutComponent ]
})
export class AppModule { }
