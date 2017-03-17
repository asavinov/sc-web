import { Component } from '@angular/core';

@Component({
  selector: 'dc-app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
})
export class AppComponent {
  title = 'DATA COMMANDR';
  activeComponent = 'dc-main';
  version = '0.5.0'
  versionDate = '19.03.2017'

  public isCollapsed:boolean = false;

  public constructor() {
  }
}
