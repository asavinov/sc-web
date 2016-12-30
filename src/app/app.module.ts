import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }        from '@angular/forms';
import { HttpModule } from '@angular/http';

import { Ng2BootstrapModule } from 'ng2-bootstrap';

import { TooltipModule } from 'ng2-bootstrap';
import { ModalModule } from 'ng2-bootstrap';
import { PopoverModule } from 'ng2-bootstrap';

import {ToastModule} from 'ng2-toastr';

//
// App-specific
//
import { AppComponent }  from './app.component';

import { MainComponent }  from './main.component';
import { HelpComponent } from './help.component';
import { AboutComponent } from './about.component';

import { AppService }  from './app.service';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    Ng2BootstrapModule,
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    PopoverModule.forRoot(),
    ToastModule,
    ],
  providers: [
    AppService,
    ],
  exports: [ AppComponent ],
  declarations: [
    AppComponent,
    MainComponent,
    HelpComponent,
    AboutComponent
    ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
