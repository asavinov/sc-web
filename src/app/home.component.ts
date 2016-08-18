import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { ScRestService, ScServiceError, ScServiceErrorCode } from './sc-rest.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { Schema } from './schema';
import { Table, TableRef } from './table';
import { Column } from './column';

@Component({
  selector: 'sc-home',
  templateUrl: 'home.component.html',
  styleUrls:  ['home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private _router: Router, private _scService: ScRestService, public _toastr: ToastsManager) {
    //this.filesToUpload = [];
  }

  ngOnInit() {
    // TODO: clean the state (no login)
    this.schemas = [];
    this.selectedSchema = undefined; 
    this.tables = [];
    this.selectedTable = undefined; 
    this.columns = [];
    this.selectedColumn = undefined;

    let loginStatus = this.login();
  }

  login() {
    this._scService.login().then(
      (result) => {
        this.getSchemas();
      },
      (error) => {
        this._toastr.error('ERROR: ' + error.message);
      }
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
        this.schemas = [];
        this.selectedSchema = undefined;

        if(schemas instanceof Array) { // Success
          this.schemas = schemas;
          this.getTables();

          this._toastr.info('New session created.');
        }
        else if(schemas instanceof Object) { // Error
          let code: ScServiceErrorCode = schemas["code"] || 0;
          if(code == ScServiceErrorCode.NOT_FOUND_IDENTITY) {
            this._toastr.error('Session expired.', 'NOT_FOUND_IDENTITY');
            this.login();
          }
        }
      }).catch(
        error => { 
          this._toastr.error(error.message);
        }
      );
  }

  onSelectSchema(sch: Schema) { 
    if(sch) { // Edit existing
      this.selectedSchema = sch.clone(); // Copy object for editing
    }
    else if(sch === undefined) { // No selection
      this.selectedSchema = undefined;
    }
    else { // null. Create new
      sch = new Schema("");
      sch.name = "New Schema";

      this.selectedSchema = sch;
    }

    this.getTables();
  }

  //
  // Schema details
  //
  
  onSchemaSubmit() { 
    if(!this.selectedSchema.id || this.selectedSchema.id.length === 0) { // Add new
      this._scService.createSchema(this.selectedSchema).then(
        x => {
          this.getSchemas();
        }
      )
    }
    else { // Update existing
      this._scService.updateSchema(this.selectedSchema).then(
        x => {
          this.getSchemas();
        }
      )
    }
  }

  onSchemaDelete() { 
    if(!this.selectedSchema.id || this.selectedSchema.id.length === 0) { // Nothing to do. Cannot delete new
      return; 
    }
    else { // Delete existing
      this._scService.deleteSchema(this.selectedSchema).then(
        x => {
          this.getSchemas();
        }
      )
    }
  }

  //
  // Schema assets
  //
  
  fileToUpload: File;
  // filesToUpload: Array<File>; // For multiple files

  fileChangeEvent2(fileInput: any) {
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
  // Table list
  //
  
  tables: Table[];
  selectedTable: Table;

  primitiveTables(): Table[] {
    if(!this.tables) return undefined;
    return this.tables.filter(t => t.isPrimitve());
  }

  nonprimitiveTables(): Table[] {
    if(!this.tables) return undefined;
    return this.tables.filter(t => !t.isPrimitve());
  }

  getTables() {
    this._scService.getTables(this.selectedSchema).then(
      tables => {
        this.tables = [];
        this.selectedTable = undefined;

        if(tables instanceof Array) { // Success
          this.tables = tables;
          this.getColumns();
        }
        else if(tables instanceof Object) { // Error
          let code: ScServiceErrorCode = tables["code"] || 0;
          if(code == ScServiceErrorCode.NOT_FOUND_IDENTITY) {
            this._toastr.error('Session expired.', 'NOT_FOUND_IDENTITY');
            this.login();
          }
        }
      }).catch(
        error => { 
          this._toastr.error(error.message);
        }
      );
  }

  onSelectTable(tab: Table) { 
    if(tab) { // Edit existing 
      this.selectedTable = tab.clone(); // Copy object for editing
    }
    else if(tab === undefined) { // No selection
      this.selectedTable = undefined;
    }
    else { // null. Create new
      tab = new Table("");
      tab.name = "New Table";

      this.selectedTable = tab;
    }

    this.getColumns(); //Show columns
    this.getRecords(); // Show records
  }

  //
  // Table details
  //
  
  onTableSubmit() {
    if(!this.selectedTable.id || this.selectedTable.id.length === 0) { // Add new
      this._scService.createTable(this.selectedSchema, this.selectedTable).then(
        x => {
          this.onSelectSchema(this.selectedSchema);
        }
      )
    }
    else { // Update existing
      this._scService.updateTable(this.selectedTable).then(
        x => {
          this.onSelectSchema(this.selectedSchema);
        }
      )
    }
  }

  onTableDelete() { 
    if(!this.selectedTable.id || this.selectedTable.id.length === 0) { // Nothing to do. Cannot delete new
      return; 
    }
    else { // Delete existing
      this._scService.deleteTable(this.selectedTable).then(
        x => {
          this.allRecords.delete(this.selectedTable.id);
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
    if(!this.selectedTable) return new Array<Column>();
    this._scService.getInputColumns(this.selectedSchema, this.selectedTable.id).then(
      columns => { 
        this.columns = [];
        this.selectedColumn = undefined;
        if(columns instanceof Array) { // Success
          this.columns = columns;
          this.resolveColumns();
        }
        else if(columns instanceof Object) { // Error
          let code: ScServiceErrorCode = columns["code"] || 0;
          if(code == ScServiceErrorCode.NOT_FOUND_IDENTITY) {
            this._toastr.error('Session expired.', 'NOT_FOUND_IDENTITY');
            this.login();
          }
        }
      }).catch(
        error => { 
          this._toastr.error(error.message);
        }
      );
  }

  resolveColumn(column: Column) { // Resolve all reference from the specified column
    let colAny: any = column;

    // Resolve input table reference

    let inId: string = "";
    if(colAny.input) inId = colAny.input.id;

    if(!column.input) column.input = new TableRef(inId);
    else column.input.id = inId;

    if(!column.input.id) {
      column.input.table = undefined;
    }
    else {
      column.input.table = this.tables.find(t => t.id === column.input.id);
    }

    // Resolve output table reference

    let outId: string = "";
    if(colAny.output) outId = colAny.output.id;

    if(!column.output) column.output = new TableRef(outId);
    else column.output.id = outId;

    if(!column.output.id) {
      column.output.table = undefined;
    }
    else {
      column.output.table = this.tables.find(t => t.id === column.output.id);
    }

  }
  resolveColumns() {
    for(let column of this.columns) {
      this.resolveColumn(column);
    }
  }

  onSelectColumn(col: Column) {
    if(col) { // Edit existing
      this.selectedColumn = col.clone(); // Copy object for editing
    }
    else if(col === undefined) { // No selection
      this.selectedColumn = undefined;
    }
    else { // Create new
      col = new Column("");
      col.name = "New Column";
      col.input.id = this.selectedTable.id;
      col.input.table = this.selectedTable;
      let type = this.tables.find(t => t.name === "String");
      col.output.id = type.id;
      col.output.table = type;

      this.selectedColumn = col;
    } 
  }

  //
  // Column details
  //
  
  onColumnSubmit() { 
    if(!this.selectedColumn.id || this.selectedColumn.id.length === 0) { // Add new
      this._scService.createColumn(this.selectedSchema, this.selectedColumn).then(
        x => {
          this.onSelectTable(this.selectedTable);
        }
      )
    }
    else { // Update existing
      this._scService.updateColumn(this.selectedColumn).then(
        x => {
          this.onSelectTable(this.selectedTable);
        }
      )
    }
  }

  onColumnDelete() { 
    if(!this.selectedColumn.id || this.selectedColumn.id.length === 0) { // Nothing to do. Cannot delete new
      return; 
    }
    else { // Delete existing
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

  allRecords = new Map<string,any[]>(); // For each table is, we store its records in this cache
  records: any = [] // Records of the selected table only (displayed in the table view)

  getRecords() {
    if(this.selectedTable) {
      let recs = this.allRecords.get(this.selectedTable.id);
      if(recs) {
        this.records = recs;
      }
      else { // No records found
        this.records = [];
      }
    }
    else { // No selection - empty list of records
      this.records = [];
    } 
}

  onReadSubmit() {
    // Read data from the service
    this._scService.read(this.selectedTable).then(
      records => { 
        this.allRecords.set(this.selectedTable.id, records);
        this.records = records;
      }
      );
  }

  // Write

  writeCsv: string;

  onWriteSubmit() {
    // Write data to the service
    this._scService.write(this.selectedTable, this.writeCsv);
  }

}
