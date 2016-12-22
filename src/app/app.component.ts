import { Component } from '@angular/core';

@Component({
  selector: 'dc-app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
})
export class AppComponent {
  title = 'DATA COMMANDR';
  activeComponent = 'dc-main';
  version = '0.3.0'
  versionDate = 'xx.12.2016'

  public constructor() {
  }
}
