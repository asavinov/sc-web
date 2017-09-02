import { Component } from '@angular/core';

@Component({
  selector: 'dc-app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
})
export class AppComponent {
  title = 'DATA COMMANDR';
  activeComponent = 'dc-edit';
  version = '0.7.0'
  versionDate = '02.09.2017'

  public isCollapsed:boolean = false;

  public constructor() {
  }
}
