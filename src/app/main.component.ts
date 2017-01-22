import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';

import { AppService, ServiceError, ServiceErrorCode } from './app.service';

import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { Schema } from './schema';
import { Table, TableRef } from './table';
import { Column } from './column';

@Component({
  selector: 'dc-main',
  templateUrl: 'main.component.html',
  styleUrls:  ['main.component.css']
})
export class MainComponent implements OnInit {

  constructor(private _scService: AppService, public _toastr: ToastsManager, viewContainerRef:ViewContainerRef) {
    // Hack/workaround for angular 2.2.* to work ng2-tastr. See also forRoot() in NgModule imports.
    this._toastr.setRootViewContainerRef(viewContainerRef);
  }

  ngOnInit() {
    //this.clean();

    if(navigator.cookieEnabled) {
      this.getAccount();
    }
    else {
        this._toastr.error("Cookies are disabled. Enable cookies in the browser settings.");
    }
  }

  ngOnDestroy() {
    ; // Notify server
  }

  clean() {
    this.selectedAccount = undefined;

    this.schemas = [];
    this.selectedSchema = undefined;

    this.tables = [];
    this.selectedTable = undefined;

    this.columns = [];
    this.selectedColumn = undefined;

    this.allRecords = new Map<string,any[]>();
    this.records = [];
  }

  //
  // Account, user, session, authentication
  //

  selectedAccount: Object;

  getAccount() {
    this.clean();
    this._scService.getAccount().then(
      d => {
        if(d['code']) { // Error
          let msg: string = d['message'] || 'Error creating account.';
          msg += ' ' + (d['message2'] || '');
          this._toastr.error(msg);
        }
        else { // Success
          if(!this.selectedAccount || this.selectedAccount['id'] !== d['id']) {
            this._toastr.info('New session created.');
          }
          this.selectedAccount = d;

          this.getSchemas();
        }
      },
      e => {
        this._toastr.error('ERROR: ' + e.message);
      }
    );
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
          if(schemas.length > 0) this.selectedSchema = schemas[0];
          this.getTables();
        }
        else if(schemas instanceof Object) { // Error
          let code: ServiceErrorCode = schemas['code'] || 0;
          if(code === ServiceErrorCode.NOT_FOUND_IDENTITY) {
            this._toastr.error('Session expired. Create a new session by reloading page in the browser.', 'NOT_FOUND_IDENTITY');
            //this.getAccount(); // Automatically create a new session. This produces cycle in some cases, e.g., no session can be created because of no cookies
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
      sch = new Schema('');
      sch.name = 'New Schema';

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
          if(x['code']) { // Error
            let msg: string = x['message'] || 'Error creating schema.';
            msg += ' ' + (x['message2'] || '');
            this._toastr.error(msg);
          }
          this.getSchemas();
        }
      );
    }
    else { // Update existing
      this._scService.updateSchema(this.selectedSchema).then(
        x => {
          if(x['code']) { // Error
            let msg: string = x['message'] || 'Error updating schema.';
            msg += ' ' + (x['message2'] || '');
            this._toastr.error(msg);
          }
          this.getSchemas();
        }
      );
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
      );
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

  selectedTablePossibleTypes(): Table[] {
    if(!this.tables) return undefined;
    if(!this.selectedTable) return undefined;
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
          let code: ServiceErrorCode = tables['code'] || 0;
          if(code === ServiceErrorCode.NOT_FOUND_IDENTITY) {
            this._toastr.error('Session expired. Create a new session by reloading page in the browser.', 'NOT_FOUND_IDENTITY');
            // this.getAccount(); // Automatically create a new session.
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
      tab = new Table('');
      tab.name = 'New Table';

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
          if(x['code']) { // Error
            let msg: string = x['message'] || 'Error creating table.';
            msg += ' ' + (x['message2'] || '');
            this._toastr.error(msg);
          }
          this.onSelectSchema(this.selectedSchema);
        }
      );
    }
    else { // Update existing
      this._scService.updateTable(this.selectedTable).then(
        x => {
          if(x['code']) { // Error
            let msg: string = x['message'] || 'Error updating table.';
            msg += ' ' + (x['message2'] || '');
            this._toastr.error(msg);
          }
          this.onSelectSchema(this.selectedSchema);
        }
      );
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
      );
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
          let code: ServiceErrorCode = columns['code'] || 0;
          if(code === ServiceErrorCode.NOT_FOUND_IDENTITY) {
            this._toastr.error('Session expired. Create a new session by reloading page in the browser.', 'NOT_FOUND_IDENTITY');
            // this.getAccount(); // Automatically create a new session.
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

    let inId: string = '';
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

    let outId: string = '';
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
      col = new Column('');
      col.name = 'New Column';
      col.input.id = this.selectedTable.id;
      col.input.table = this.selectedTable;
      let type = this.tables.find(t => t.name === 'Double');
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
          if(x['code']) { // Error
            let msg: string = x['message'] || 'Error creating column.';
            msg += ' ' + (x['message2'] || '');
            this._toastr.error(msg);
          }
          this.onSelectTable(this.selectedTable);
        }
      );
    }
    else { // Update existing
      this._scService.updateColumn(this.selectedColumn).then(
        x => {
          if(x['code']) { // Error
            let msg: string = x['message'] || 'Error updating column.';
            msg += ' ' + (x['message2'] || '');
            this._toastr.error(msg);
          }
          this.onSelectTable(this.selectedTable);
        }
      );
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
      );
    }
  }

  //
  // Data
  //

  // Read

  allRecords = new Map<string,any[]>(); // For each table is, we store its records in this cache
  records: any = []; // Records of the selected table only (displayed in the table view)

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

  onTableRead() {
    // Read data from the service
    this._scService.read(this.selectedTable).then(
      records => {
        if(records instanceof Array) { // Success
          this.allRecords.set(this.selectedTable.id, records);
          this.records = records;

          this._toastr.info('Data synchronized.');
        }
        else if(records instanceof Object) { // Error
            let msg: string = records['message'] || 'Error loading table data.';
            msg += ' ' + (records['message2'] || '');
            this._toastr.error(msg);
        }
      },
      error => {
        this._toastr.error('ERROR: ' + error.message);
      }
    );
  }

  onTableEvaluate() {
    // Evaluate data from the service
    this._scService.evaluate(this.selectedSchema).then(
      records => {
        if(records instanceof Array) { // Success
          this.allRecords.set(this.selectedTable.id, []);
          this.records = [];

          this._toastr.info('Data evaluated.');
        }
        else if(records instanceof Object) { // Error
            let msg: string = records['message'] || 'Error evaluating table.';
            msg += ' ' + (records['message2'] || '');
            this._toastr.error(msg);
        }
      },
      error => {
        this._toastr.error('ERROR: ' + error.message);
      }
    );
  }

  onTableEmpty() {
    // Empty data in one table
    this._scService.empty(this.selectedTable).then(
      x => {
        this._toastr.info('Data removed.');
        this.onTableRead(); // Read data from the table (should be empty)
      }
    );
  }

  // Write

  uploadCsv: string;

  onTableUpload() {
    // Write data to the service
    this._scService.write(this.selectedTable, this.uploadCsv).then(
      x => {
        this._toastr.info('Data imported.');
        this.onTableRead(); // Read data from the table
      }
    );
  }

}
