import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }        from '@angular/forms';
//import { CommonModule }       from '@angular/common';

import { HttpModule } from '@angular/http';

import { ToastsManager } from 'ng2-toastr/ng2-toastr';
require('node_modules/ng2-toastr/bundles/ng2-toastr.min.css');

require('node_modules/bootstrap/dist/css/bootstrap.min.css');

//
// App-specific
//
import { routing } from './sc-app.routes';

import { ScAppComponent }  from './sc-app.component';
import { HomeComponent }  from './home.component';
import { ScRestService }  from './sc-rest.service';

@NgModule({
  imports: [
    BrowserModule, 
    FormsModule, // !!! Do not add NgModel — or the FORMS_DIRECTIVES — to the AppModule metadata's declarations! These directives belong to the FormsModule. Components, directives and pipes belong to one module — and one module only.
    HttpModule,
    routing
    ],
  declarations: [
    ScAppComponent,
    HomeComponent
    ],
  providers: [
    ScRestService,
    ToastsManager
    ],
  bootstrap: [ ScAppComponent ]
})
export class AppModule { }
