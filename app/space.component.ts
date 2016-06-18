import { Component, OnInit } from 'angular2/core';
import { Router } from 'angular2/router';

import { Space } from './space';
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

  constructor(
    private _router: Router,
    private _scService: ScService) { }

  spaces: Space[];
  selectedSpace: Space;

  getSpaces() {
    this._scService.getSpaces().then(spaces => { this.spaces = spaces; this.selectedSpace = this.spaces[0]; });
  }

  tables: Table[];
  selectedTable: Table;

  getTables() {
    this._scService.getTables().then(tables => this.tables = tables);
  }

  onSelectTable(table: Table) { 
    this.selectedTable = table; 
    this.selectedColumn = undefined; 
    this.getColumns();
  }

  columns: Column[];
  selectedColumn: Column;

  getColumns() {
    if(!this.selectedTable) return new Array<Column>()
    this._scService.getInputColumns(this.selectedTable.id).then(columns => this.columns = columns);
    //this._scService.getColumns().then(columns => this.columns = columns);
  }

  onSelectColumn(column: Column) { this.selectedColumn = column; }

  ngOnInit() {
    this.getSpaces();
    this.getTables();
    this.getColumns();
  }

  gotoDetail() {
    this._router.navigate(['TableDetail', { id: this.selectedTable.id }]);
  }
}
