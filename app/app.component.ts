import { Component /*, provide*/ } from '@angular/core';

// Routes, ROUTER_PROVIDERS 
import { ROUTER_DIRECTIVES } from '@angular/router';

import { HomeComponent } from './home.component';
import { SpaceComponent } from './space.component';
import { DataComponent } from './data.component';

import { ScService } from './sc.service';

@Component({
  selector: 'sc-app',
  template: `
<div class="jumbotron well well-lg">
  <h1><span class="label label-danger center-block">{{title}}</span></h1>
  <p class="text-center">high throughput column-oriented in-stream analytics</p>
</div>
<router-outlet></router-outlet>
<!--
    <h1>{{title}}</h1>
    <div class="row">
    <nav>
      <a type="button" class="btn btn-default btn-lg col-sm-2" [routerLink]="['/home']">Home</a>
      <a type="button" class="btn btn-default btn-lg col-sm-2" [routerLink]="['/schema']">Schema</a>
      <a type="button" class="btn btn-default btn-lg col-sm-2" [routerLink]="['/data']">Data</a>
    </nav>
    </div>
    <router-outlet></router-outlet>
-->
  `,
  styleUrls: ['app/app.component.css'],
  directives: [ROUTER_DIRECTIVES],
  providers: [
    ScService
  ]
})

export class AppComponent {
  title = 'STREAM COMMANDR';
}
