import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { Schema } from './schema';
import { Table, TableRef } from './table';
import { Column } from './column';

import { ScRestService } from './sc-rest.service';

@Component({
  selector: 'sc-home',
  templateUrl: 'app/home.component.html',
  styleUrls:  ['app/home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private _router: Router, private _scService: ScRestService) {
    //this.filesToUpload = [];
  }

  ngOnInit() {
    // TODO: clean the state (no login)
    this.schemas = [] 
    this.tables = [] 
    this.columns = [] 

    let loginStatus = this.login();
  }

  login() {
    this._scService.login().then(
      (result) => {this.getSchemas();}, 
      (error) => {console.error(error);}
      );

    return true;
  }

  //
  // Schema list
  //
  
  schemas: Schema[];
  selectedSchema: Schema;

  getSchemas() {
    this._scService.getSchemas().then(
      schemas => { 
        if(schemas instanceof Array) { // Success
          this.schemas = schemas;
          this.selectedSchema = undefined;
          this.onSelectSchema(this.selectedSchema); 
        }
        else if(schemas instanceof Object) { // Error
          let code: String = schemas["code"] || ""
          if(code === "400") {
            this.login();
          }
        }
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

  primitiveTables(): Table[] {
    if(!this.tables) return undefined
    return this.tables.filter(t => t.isPrimitve())
  }

  nonprimitiveTables(): Table[] {
    if(!this.tables) return undefined
    return this.tables.filter(t => !t.isPrimitve())
  }

  getTables() {
    this._scService.getTables(this.selectedSchema).then(
      tables => {
        if(tables instanceof Array) { // Success
          this.tables = tables;
          this.onSelectTable(this.selectedTable); 
          //this.selectedTable = undefined;
        }
        else if(tables instanceof Object) { // Error
          let code: String = tables["code"] || ""
          if(code === "400") {
            this.login();
          }
        }
      });
  }

  onSelectTable(tab: Table) { 
    if(tab) { // Edit existing
      this.selectedTable = tab.clone() // Copy object for editing
    }
    else { // Create new
      tab = new Table("")
      tab.name = "New Table"

      this.selectedTable = tab
    } 

    this.getColumns();
  }

  //
  // Table details
  //
  
  onTableSubmit() { 
    if(!this.selectedTable.id || this.selectedTable.id.length === 0) {
      // Add new
      this._scService.createTable(this.selectedSchema, this.selectedTable).then(
        x => {
          this.onSelectSchema(this.selectedSchema);
        }
      )
    }
    else {
      // Update existing
      this._scService.updateTable(this.selectedTable).then(
        x => {
          this.onSelectSchema(this.selectedSchema);
        }
      )
    }
  }

  onTableDelete() { 
    if(!this.selectedTable.id || this.selectedTable.id.length === 0) {
      return; // Nothing to do. Cannot delete new
    }
    else {
      // Delete existing
      this._scService.deleteTable(this.selectedTable).then(
        x => {
          this.onSelectSchema(this.selectedSchema);
        }
      )
    }
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
        if(columns instanceof Array) { // Success
          this.columns = columns; 
          this.resolveColumns(); 
          //this.selectedColumn = undefined;
        }
        else if(columns instanceof Object) { // Error
          let code: String = columns["code"] || ""
          if(code === "400") {
            this.login();
          }
        }
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

  onSelectColumn(col: Column) {
    if(col) { // Edit existing
      this.selectedColumn = col.clone() // Copy object for editing
    }
    else { // Create new
      col = new Column("")
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
      // Add new
      this._scService.createColumn(this.selectedSchema, this.selectedColumn).then(
        x => {
          this.onSelectTable(this.selectedTable);
        }
      )
    }
    else {
      // Update existing
      this._scService.updateColumn(this.selectedColumn).then(
        x => {
          this.onSelectTable(this.selectedTable);
        }
      )
    }
  }

  onColumnDelete() { 
    if(!this.selectedColumn.id || this.selectedColumn.id.length === 0) {
      return; // Nothing to do. Cannot delete new
    }
    else {
      // Delete existing
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
