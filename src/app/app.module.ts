import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }        from '@angular/forms';
import { HttpModule } from '@angular/http';

import { CollapseModule } from 'ngx-bootstrap';
import { TooltipModule } from 'ngx-bootstrap';
import { ModalModule } from 'ngx-bootstrap';
import { PopoverModule } from 'ngx-bootstrap';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastModule } from 'ng2-toastr';

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
    CollapseModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    PopoverModule.forRoot(),
    BrowserAnimationsModule,
    ToastModule.forRoot()
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
