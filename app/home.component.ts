import { Component, OnInit } from 'angular2/core';
import { Router } from 'angular2/router';

@Component({
  selector: 'sc-home',
  templateUrl: 'app/home.component.html'
})
export class HomeComponent implements OnInit {

  constructor(
    private _router: Router) {
  }

  ngOnInit() {
  }
}
