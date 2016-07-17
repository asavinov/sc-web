import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Schema } from './schema';
import { Table, TableRef } from './table';
import { Column } from './column';

import { ScService } from './sc.service';

@Component({
  selector: 'sc-home',
  templateUrl: 'app/home.component.html',
  styleUrls:  ['app/home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private _router: Router, private _scService: ScService) {
    //this.filesToUpload = [];
  }

  ngOnInit() {
    this.getSchemas()
  }

  //
  // Schema list
  //
  
  schemas: Schema[];
  selectedSchema: Schema;

  getSchemas() {
    this._scService.getSchemas().then(
      schs => { 
        this.schemas = schs;
        this.selectedSchema = undefined;
        this.onSelectSchema(this.selectedSchema); 
      });
  }

  onSelectSchema(spa: Schema) { 
    if(spa) { // Edit existing 
      this.selectedSchema = spa.clone() // Copy object for editing
    }
    else if(spa === undefined) {
      this.selectedSchema = undefined
    }
    else { // Create new
      spa = new Schema("")
      spa.name = "New Schema"

      this.selectedSchema = spa
    } 

    this.getTables();
  }

  fileToUpload: File;
  // filesToUpload: Array<File>; // For multiple files

  fileChangeEvent2(fileInput: any){
    this.fileToUpload = <File> fileInput.target.files[0];
    // this.filesToUpload = <Array<File>> fileInput.target.files; // For multiple files
  }

  onUploadClick() {
    this._scService.uploadFile(this.fileToUpload)
      .then((result) => {
        console.log(result);
      }, (error) => {
        console.error(error);
      });
  }

  //
  // Schema details
  //
  
  onSchemaSubmit() { 
  }

  onSchemaDelete() { 
  }

  //
  // Table list
  //
  
  tables: Table[];
  selectedTable: Table;

  getTables() {
    this._scService.getTables(this.selectedSchema).then(
      tables => { 
        this.tables = tables;
        this.onSelectTable(this.selectedTable); 
        //this.selectedTable = undefined;
      });
  }

  onSelectTable(table: Table) { 
    this.selectedTable = table; 
    this.getColumns();
  }

  //
  // Table details
  //
  
  onTableSubmit() { 
  }

  onTableumnDelete() { 
  }

  //
  // Column list
  //
  
  columns: Column[];
  selectedColumn: Column;

  getColumns() {
    if(!this.selectedTable) return new Array<Column>()
    this._scService.getInputColumns(this.selectedSchema, this.selectedTable.id).then(
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
      this._scService.createColumn(this.selectedSchema, this.selectedColumn).then(
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

  //
  // Data
  //

  // Read

  readJson: string;

  onReadSubmit() {
    // Write to the service
    this._scService.read(this.selectedTable).then(records => this.readJson = JSON.stringify(records));
  }

  // Write

  writeJson: string;

  onWriteSubmit() {
    // Write to the service
    this._scService.write(this.selectedTable, this.writeJson)
  }

}
