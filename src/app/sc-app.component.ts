import { Component /*, provide*/ } from '@angular/core';

import { HomeComponent } from './home.component';

@Component({
  //moduleId: module.id, // Not needed when using Webpack and also produces error in rc5
  selector: 'sc-app',
  templateUrl: 'sc-app.component.html',
  styleUrls: ['sc-app.component.css']
})
export class ScAppComponent {
  title = 'DATA COMMANDR';
}
