import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }        from '@angular/forms';

import { HttpModule } from '@angular/http';

import {ToastModule} from 'ng2-toastr/ng2-toastr';

import { TooltipModule } from 'ng2-bootstrap/ng2-bootstrap';
import { ModalModule } from 'ng2-bootstrap/ng2-bootstrap';

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
    TooltipModule,
    ModalModule
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
  bootstrap: [ AppComponent ]
})
export class AppModule { }
