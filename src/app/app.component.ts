import { Component } from '@angular/core';

import { DcComponent } from './dc.component';
import { HelpComponent } from './help.component';
import { InfoComponent } from './info.component';
import { AboutComponent } from './about.component';

@Component({
  //moduleId: module.id, // Not needed when using Webpack and also produces error in rc5
  selector: 'app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent {
  title = 'DATA COMMANDR';
  activeComponent = 'dc';
}
