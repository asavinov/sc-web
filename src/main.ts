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

import { APP_ROUTER_PROVIDERS } from './app/sc-app.routes'; // Our app-specific route definitions are in a separate file

import { ScAppComponent } from './app/sc-app.component';


// depending on the env mode, enable prod mode or add debugging modules
if (process.env.ENV === 'build') {
  enableProdMode();
}


bootstrap(ScAppComponent, [
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
