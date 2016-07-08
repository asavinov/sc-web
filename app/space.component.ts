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
  }

  //
  // Space list
  //
  
  spaces: Space[];
  selectedSpace: Space;

  getSpaces() {
    this._scService.getSpaces().then(
      spaces => { 
        this.spaces = spaces;
        this.selectedSpace = this.spaces[0];
        this.onSelectSapce(this.selectedSpace); 
      });
  }

  onSelectSapce(space: Space) { 
    this.selectedSpace = space; 
    this.getTables();
  }

  //
  // Table list
  //
  
  tables: Table[];
  selectedTable: Table;

  getTables() {
    this._scService.getTables(this.selectedSpace).then(
      tables => { 
        this.tables = tables;
        //this.selectedTable = undefined;
        this.onSelectTable(this.selectedTable); 
      });
  }

  onSelectTable(table: Table) { 
    this.selectedTable = table; 
    this.getColumns();
  }

  //
  // Column list
  //
  
  columns: Column[];
  selectedColumn: Column;

  getColumns() {
    if(!this.selectedTable) return new Array<Column>()
    this._scService.getInputColumns(this.selectedSpace, this.selectedTable.id).then(
      columns => {
        this.columns = columns; 
        this.resolveColumns(); 
        //this.selectedColumn = undefined;
      });
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
    if(!this.selectedColumn.id || this.selectedColumn.id.length === 0) {
      // Add new column
      this._scService.createColumn(this.selectedSpace, this.selectedColumn).then(
        x => {
          this.onSelectTable(this.selectedTable);
        }
      )
    }
    else {
      // Update existing column
      this._scService.updateColumn(this.selectedColumn).then(
        x => {
          this.onSelectTable(this.selectedTable);
        }
      )
    }
  }

  onColumnDelete() { 
    if(!this.selectedColumn.id || this.selectedColumn.id.length === 0) {
      return; // Nothing to do. Cannot delete new column
    }
    else {
      // Delete rexisting column
      this._scService.deleteColumn(this.selectedColumn).then(
        x => {
          this.onSelectTable(this.selectedTable);
        }
      )
    }
  }

  gotoDetail() {
    this._router.navigate(['TableDetail', { id: this.selectedTable.id }]);
  }

}
