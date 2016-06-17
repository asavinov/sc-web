import { Component, OnInit } from 'angular2/core';
import { Router } from 'angular2/router';

import { Table } from './table';
//import { TableDetailComponent } from './table-detail.component';

import { ScService } from './sc.service';

@Component({
  selector: 'sc-tables',
  templateUrl: 'app/tables.component.html',
  styleUrls:  ['app/tables.component.css']
  //directives: [TableDetailComponent]
})
export class TablesComponent implements OnInit {
  tables: Table[];
  selectedTable: Table;

  constructor(
    private _router: Router,
    private _scService: ScService) { }

  getTables() {
    this._scService.getTables().then(tables => this.tables = tables);
  }

  ngOnInit() {
    this.getTables();
  }

  onSelect(table: Table) { this.selectedTable = table; }

  gotoDetail() {
    this._router.navigate(['TableDetail', { id: this.selectedTable.id }]);
  }
}
