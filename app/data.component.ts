import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router-deprecated';

@Component({
  selector: 'sc-data',
  templateUrl: 'app/data.component.html'
})
export class DataComponent implements OnInit {

  constructor(
    private _router: Router) {
  }

  ngOnInit() {
  }
}
