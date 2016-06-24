import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router-deprecated';

import { ScMockService } from './sc-mock.service';

@Component({
  selector: 'sc-data',
  templateUrl: 'app/data.component.html'
})
export class DataComponent implements OnInit {

  constructor(private _router: Router, private _scService: ScMockService) { 
  }

  pushJson: string;

  onPushSubmit() {
    if(this.pushJson.length === 0) {
      // Nothing to do
    }
    else {
      // Push to the service
      this._scService.push(this.pushJson)
    }
  }

  ngOnInit() {
  }
}
