import { Component, ViewContainerRef } from '@angular/core';

@Component({
  //moduleId: module.id, // Not needed when using Webpack and also produces error in rc5
  selector: 'app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent {
  title = 'DATA COMMANDR';
  activeComponent = 'dc';

  public constructor(public viewContainerRef:ViewContainerRef) {
    // HACK: See https://valor-software.com/ng2-bootstrap/#/modals
    // You need this small hack in order to catch application root view container ref
    this.viewContainerRef = viewContainerRef;
  }
}
