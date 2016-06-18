import { Component, OnInit } from 'angular2/core';
import { Router } from 'angular2/router';

import { Table } from './table';
import { Column } from './column';
//import { TableDetailComponent } from './table-detail.component';

import { ScService } from './sc.service';

@Component({
  selector: 'sc-tables',
  templateUrl: 'app/space.component.html',
  styleUrls:  ['app/space.component.css']
  //directives: [TableDetailComponent]
})
export class SpaceComponent implements OnInit {

  tables: Table[];
  selectedTable: Table;

  columns: Column[];
  selectedColumn: Column;

  constructor(
    private _router: Router,
    private _scService: ScService) { }

  getTables() {
    this._scService.getTables().then(tables => this.tables = tables);
  }

  onSelectTable(table: Table) { this.selectedTable = table; }

  getColumns() {
    this._scService.getColumns().then(columns => this.columns = columns);
  }

  onSelectColumn(column: Column) { this.selectedColumn = column; }

  ngOnInit() {
    this.getTables();
    this.getColumns();
  }

  gotoDetail() {
    this._router.navigate(['TableDetail', { id: this.selectedTable.id }]);
  }
}
