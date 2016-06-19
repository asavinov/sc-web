import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router-deprecated';

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
