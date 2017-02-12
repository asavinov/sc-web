import { Component } from '@angular/core';

@Component({
  selector: 'dc-app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
})
export class AppComponent {
  title = 'DATA COMMANDR';
  activeComponent = 'dc-main';
  version = '0.4.0'
  versionDate = '12.02.2017'

  public isCollapsed:boolean = false;

  public constructor() {
  }
}
