// Imports for loading & configuring the in-memory web api
import { XHRBackend } from '@angular/http';
import { InMemoryBackendService, SEED_DATA }  from 'angular2-in-memory-web-api';
import { ScSampleData }   from './sc-sample-data';

import { bootstrap }    from '@angular/platform-browser-dynamic';
import { ROUTER_PROVIDERS } from '@angular/router-deprecated';
import { HTTP_PROVIDERS } from '@angular/http';

import { AppComponent } from './app.component';

bootstrap(AppComponent, [
    ROUTER_PROVIDERS,
    HTTP_PROVIDERS,
    { provide: XHRBackend, useClass: InMemoryBackendService }, // in-mem server
    { provide: SEED_DATA,  useClass: ScSampleData }            // data to be used by in-mem server
    ]);
