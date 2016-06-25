import { Component /*, provide*/ } from '@angular/core';

import { Routes, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from '@angular/router';
import { Router } from '@angular/router';

import { HomeComponent } from './home.component';
import { SpaceComponent } from './space.component';
import { DataComponent } from './data.component';

import { ScService } from './sc.service';

@Component({
  selector: 'sc-app',
  template: `
    <h1>{{title}}</h1>
    <nav>
      <a [routerLink]="['/home']">Home</a>
      <a [routerLink]="['/schema']">Schema</a>
      <a [routerLink]="['/data']">Data</a>
    </nav>
    <router-outlet></router-outlet>
  `,
  styleUrls: ['app/app.component.css'],
  directives: [ROUTER_DIRECTIVES],
  providers: [
    ROUTER_PROVIDERS,
    ScService
  ]
})

@Routes([
  {path: '/', component: HomeComponent},
  {path: '/home', component: HomeComponent},
  {path: '/schema', component: SpaceComponent},
  {path: '/data', component: DataComponent}
])

export class AppComponent {
  title = 'StreamCommandr';
}
