import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }        from '@angular/forms';
//import { CommonModule }       from '@angular/common';

import { HttpModule } from '@angular/http';

import {TOOLTIP_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap'; // Usage: http://valor-software.com/ng2-bootstrap/#/tooltip

require('node_modules/bootstrap/dist/css/bootstrap.min.css');

import { ToastsManager } from 'ng2-toastr/ng2-toastr';
require('node_modules/ng2-toastr/bundles/ng2-toastr.min.css');

//
// App-specific
//
import { routing } from './app.routes';

import { AppComponent }  from './app.component';
import { DcComponent }  from './dc.component';
import { AppService }  from './app.service';

@NgModule({
  imports: [
    BrowserModule, 
    FormsModule, // !!! Do not add NgModel — or the FORMS_DIRECTIVES — to the AppModule metadata's declarations! These directives belong to the FormsModule. Components, directives and pipes belong to one module — and one module only.
    HttpModule,
    routing
    ],
  declarations: [
    AppComponent,
    DcComponent,
    TOOLTIP_DIRECTIVES
    ],
  providers: [
    AppService,
    ToastsManager
    ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }


/* OLD (w/o modules). Previously it was in main.ts
import { enableProdMode } from '@angular/core';
import { bootstrap } from '@angular/platform-browser-dynamic';

import { provide } from '@angular/core'; // !!! OLD: Do I need it

import {disableDeprecatedForms, provideForms} from '@angular/forms';
import {FORM_DIRECTIVES, FormBuilder, Validators, NgForm} from '@angular/forms';

import { HTTP_PROVIDERS } from '@angular/http';
import { RequestOptions, XHRBackend } from '@angular/http';
import 'rxjs/add/operator/toPromise';

// Imports for loading & configuring the in-memory web api
//import { InMemoryBackendConfig, InMemoryBackendService, SEED_DATA }  from 'angular2-in-memory-web-api';
//import { ScSampleData }   from './sc-sample-data';

import { APP_ROUTER_PROVIDERS } from './app/app.routes'; // Our app-specific route definitions are in a separate file

import { AppComponent } from './app/app.component';


// depending on the env mode, enable prod mode or add debugging modules
if (process.env.ENV === 'build') {
  enableProdMode();
}


bootstrap(AppComponent, [
    disableDeprecatedForms(), provideForms(),
    // These are dependencies of our App
    APP_ROUTER_PROVIDERS, // Inject our app-specific route definitions for displaying components depending on URL
    HTTP_PROVIDERS,
//    { provide: XHRBackend, useClass: InMemoryBackendService },    // in-mem server will be used to serve http requests
//    { provide: SEED_DATA,  useClass: ScSampleData },              // data to be used by in-mem server
//    { provide: InMemoryBackendConfig, useValue: { delay: 1000, rootPath: "api" } }, // config. delay in ms
//    { provide: RequestOptions, useValue: { url: "http://localhost:8080" } },
//    provide('webApiBaseUrl', { useValue: 'http://localhost:8080' })
    ])
  .catch(err => console.error(err));
*/
