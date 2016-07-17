import { provide } from '@angular/core';

import { HTTP_PROVIDERS } from '@angular/http';
import { RequestOptions, XHRBackend } from '@angular/http';
import 'rxjs/add/operator/toPromise';

// Imports for loading & configuring the in-memory web api
import { InMemoryBackendConfig, InMemoryBackendService, SEED_DATA }  from 'angular2-in-memory-web-api';
import { ScSampleData }   from './sc-sample-data';

import { bootstrap }    from '@angular/platform-browser-dynamic';

import { AppComponent } from './app.component';

import { APP_ROUTER_PROVIDERS } from './app.routes'; // Our app-specific route definitions are in a separate file

bootstrap(AppComponent, [
    APP_ROUTER_PROVIDERS, // Inject our app-specific route definitions for displaying components depending on URL
    HTTP_PROVIDERS,
//    { provide: XHRBackend, useClass: InMemoryBackendService },    // in-mem server will be used to serve http requests
//    { provide: SEED_DATA,  useClass: ScSampleData },              // data to be used by in-mem server
//    { provide: InMemoryBackendConfig, useValue: { delay: 1000, rootPath: "api" } }, // config. delay in ms
//    { provide: RequestOptions, useValue: { url: "http://localhost:8080" } },
//    provide('webApiBaseUrl', { useValue: 'http://localhost:8080' })
    ]);
