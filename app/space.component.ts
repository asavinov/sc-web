import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Space } from './space';
import { Table, TableRef } from './table';
import { Column } from './column';

import { ScService } from './sc.service';

@Component({
  selector: 'sc-space',
  templateUrl: 'app/space.component.html',
  styleUrls:  ['app/space.component.css']
})
export class SpaceComponent implements OnInit {

  constructor(private _router: Router, private _scService: ScService) { 
  }

  ngOnInit() {
    this.getSpaces()
    this.getTables()
    this.getColumns()
  }

  //
  // Space list
  //
  
  spaces: Space[];
  selectedSpace: Space;

  getSpaces() {
    this._scService.getSpaces().then(spaces => { this.spaces = spaces; this.selectedSpace = this.spaces[0]; });
  }

  //
  // Table list
  //
  
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

  //
  // Column list
  //
  
  columns: Column[];
  selectedColumn: Column;

  getColumns() {
    if(!this.selectedTable) return new Array<Column>()
    this._scService.getInputColumns(this.selectedTable.id).then(
      columns => { this.columns = columns; this.resolveColumns(); }
      );
  }

  resolveColumn(column: Column) { // Resolve all reference from the specified column
    let colAny: any = column

    // Resolve input table reference

    let inId: string = ""
    if(colAny.input) inId = colAny.input.id

    if(!column.input) column.input = new TableRef(inId);
    else column.input.id = inId

    if(!column.input.id) {
      column.input.table = undefined
    }
    else {
      column.input.table = this.tables.find(t => t.id === column.input.id)
    }

    // Resolve output table reference

    let outId: string = ""
    if(colAny.output) outId = colAny.output.id

    if(!column.output) column.output = new TableRef(outId);
    else column.output.id = outId

    if(!column.output.id) {
      column.output.table = undefined
    }
    else {
      column.output.table = this.tables.find(t => t.id === column.output.id)
    }

  }
  resolveColumns() {
    for(let column of this.columns) {
      this.resolveColumn(column);
    }
  }

  onSelectColumn(column: Column) {
    if(column) { // Edit existing column
      this.selectedColumn = column.clone() // Copy object for editing
    }
    else { // Create new column
      let col = new Column("")
      col.name = "New Column"
      col.input.id = this.selectedTable.id
      col.input.table = this.selectedTable
      let type = this.tables.find(t => t.name === "String")
      col.output.id = type.id
      col.output.table = type

      this.selectedColumn = col
    } 
  }

  //
  // Column details
  //
  
  onColumnSubmit() { 
    if(this.selectedColumn.id.length === 0) {
      // Add new column
      this._scService.addColumn(this.selectedColumn)
    }
    else {
      // Update rexisting column
      this._scService.updateColumn(this.selectedColumn)
    }

    // Clear the selected object (we want to load it again after update)
    let id = this.selectedColumn.id
    this.selectedColumn = null

    // Update the view by loading again all the columns (or updating only one of them)
    setTimeout(this.getColumns(), 2000)
    // We could also trigger column list update by selecting the current table

    // We need to refresh the column list to reflect the updated column
    this.onSelectTable(this.selectedTable)

    // Set selection again
    //let col = this.columns.find(c => c.id === id)
    //this.onSelectColumn(col)
  }

  gotoDetail() {
    this._router.navigate(['TableDetail', { id: this.selectedTable.id }]);
  }

}
