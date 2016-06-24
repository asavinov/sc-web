import { Component } from '@angular/core';
import { RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from '@angular/router-deprecated';

import { HomeComponent } from './home.component';
import { SpaceComponent } from './space.component';
import { DataComponent } from './data.component';

import { ScMockService } from './sc-mock.service';

@Component({
  selector: 'sc-app',
  template: `
    <h1>{{title}}</h1>
    <nav>
      <a [routerLink]="['Home']">Home</a>
      <a [routerLink]="['Schema']">Schema</a>
      <a [routerLink]="['Data']">Data</a>
    </nav>
    <router-outlet></router-outlet>
  `,
  styleUrls: ['app/app.component.css'],
  directives: [ROUTER_DIRECTIVES],
  providers: [
    ROUTER_PROVIDERS,
    ScMockService
  ]
})
@RouteConfig([
  {
    path: '/home',
    name: 'Home',
    component: HomeComponent,
    useAsDefault: true
  },
  {
    path: '/schema',
    name: 'Schema',
    component: SpaceComponent
  },
  {
    path: '/data',
    name: 'Data',
    component: DataComponent
  }
])
export class AppComponent {
  title = 'StreamCommandr';
}
