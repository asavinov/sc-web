import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';

import { AppService, ServiceError, ServiceErrorCode } from './app.service';

import { ModalDirective } from 'ng2-bootstrap';

import { ToastsManager } from 'ng2-toastr';

import { Schema } from './schema';
import { Table, TableRef } from './table';
import { Column } from './column';
import { ColumnKind } from './column';

/*
How to determine if variable is 'undefined' or 'null'?
http://stackoverflow.com/questions/2647867/how-to-determine-if-variable-is-undefined-or-null
if (variable == null) - It catches both null and undefined (but not false). Important: two signs (not three)
*/

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

    if(navigator.cookieEnabled) {
      // Make session and trigger loading a new account object (or empty it in the case of no session)
      this._scService.getAccount()
        .then(x => this.onAccountReceived(x))
        .catch(e => this._toastr.error('ERROR: ' + e.message) );
    }
    else {
        this._toastr.error("Cookies are disabled. Enable cookies in the browser settings.");
    }

  }

  ngOnDestroy() {
    ; // Notify server
  }

  //
  // Account, user, session, authentication
  //

  selectedAccount: Object;

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

  onAccountReceived(acc: any) { // Whenever a new account object is received. Update the model. We can also receive an error object.

    //this.clean();

    if(!acc['code']) { // Success
      if(!this.selectedAccount || this.selectedAccount['id'] !== acc['id']) {
        this._toastr.info('New session created.');
      }
      this.selectedAccount = acc;
    }
    else { // Error
      let msg: string = acc['message'] || 'Error creating account.';
      msg += ' ' + (acc['description'] || '');
      this._toastr.error(msg);

      this.selectedAccount = null;
    }

    // Trigger loading schema and (recursively) other model elements for the selected account
    this._scService.getSchemas(this.selectedAccount)
      .then( x => this.onSchemasReceived(x) )
      .catch( e => this._toastr.error(e.message) );
  }

  //
  // Schema list
  //

  schemas: Schema[];
  selectedSchema: Schema;
  @ViewChild('schemaModal') public schemaModal: ModalDirective;

  onSchemasReceived(schemas: Schema[] | Object) { // Whenever a new list of columns is received. Update the model. We can also receive an error object.
    if(schemas instanceof Array) { // Success
      this.schemas = schemas;
    }
    else if(schemas instanceof Object) { // Error
      this.schemas = [];
      let code: ServiceErrorCode = schemas['code'] || 0;
      if(code === ServiceErrorCode.NOT_FOUND_IDENTITY) {
        this._toastr.error('Session expired. Create a new session by reloading page in the browser.', 'NOT_FOUND_IDENTITY');
      }
    }

    // Make default selection in the recevied list which can trigger loading a lower list or emptying it
    let list = this.schemas;
    if(list.length == 0) { // Nothing to select from
      this.onSchemaSelect(undefined);
    }
    else if(this.selectedSchema && this.selectedSchema.id && list.filter(x => x.id == this.selectedSchema.id).length > 0) { // Previous selection exists. Use it
      this.onSchemaSelect(this.selectedSchema);
    }
    else { // No previous selection. Use default one
      this.onSchemaSelect(list[0]);
    } 
  }

  onSchemaSelect(sch: Schema) {
    if(sch) { // Edit existing
      this.selectedSchema = sch.clone(); // Copy object for editing
    }
    else if(sch === undefined) { // No selection
      this.selectedSchema = undefined;
    }
    else { // null. Create new
      sch = new Schema('');
      sch.name = this.getUniqueName(this.schemas, 'New Schema');

      this.selectedSchema = sch;

      this.schemaModal.show();
    }

    this._scService.getTables(this.selectedSchema)
      .then( x => this.onTablesReceived(x) )
      .catch( e => this._toastr.error(e.message) );
  }

  onSchemaSubmit() {
    if(!this.selectedSchema.id || this.selectedSchema.id.length === 0) { // Add new
      this._scService.createSchema(this.selectedSchema)
        .then( x => {
          if(x['code']) { // Error
            let msg: string = x['message'] || 'Error creating schema.';
            msg += ' ' + (x['description'] || '');
            this._toastr.error(msg);
          }

          // The newly created element will be selected
          this.selectedSchema.id = x.id || "";

          // Load all schemas
          this._scService.getSchemas(this.selectedAccount)
            .then( x => this.onSchemasReceived(x) )
            .catch( e => this._toastr.error(e.message) );
        }
      );
    }
    else { // Update existing
      this._scService.updateSchema(this.selectedSchema)
        .then( x => {
          if(x['code']) { // Error
            let msg: string = x['message'] || 'Error updating schema.';
            msg += ' ' + (x['description'] || '');
            this._toastr.error(msg);
          }

          // Load all schemas
          this._scService.getSchemas(this.selectedAccount)
            .then( x => this.onSchemasReceived(x) )
            .catch( e => this._toastr.error(e.message) );
        }
      );
    }
  }

  onSchemaDelete() {
    if(!this.selectedSchema.id || this.selectedSchema.id.length === 0) { // Nothing to do. Cannot delete new
      return;
    }
    else { // Delete existing
      this._scService.deleteSchema(this.selectedSchema)
        .then( x => { this._scService.getSchemas(this.selectedAccount) // Load all schemas
            .then( x => this.onSchemasReceived(x) )
            .catch( e => this._toastr.error(e.message) );
          }
        );
    }
  }

  //
  // Schema data
  //

  allRecords = new Map<string,any[]>(); // For each table is, we store its records in this cache
  records: any = []; // Records of the selected table only (displayed in the table view)

  onSchemaEvaluate() {
    // Evaluate data from the service
    this._scService.evaluate(this.selectedSchema)
      .then( records => {
        if(records instanceof Array) { // Success
          this.allRecords.set(this.selectedTable.id, []);
          this.records = [];

          this._toastr.info('Formulas evaluated.');
        }
        else if(records instanceof Object) { // Error
            let msg: string = records['message'] || 'Error evaluating table.';
            msg += ' ' + (records['description'] || '');
            this._toastr.error(msg);
        }
      })
      .then( x => this._scService.getInputColumns(this.selectedSchema, this.selectedTable)
          .then( x => this.onColumnsReceived(x) )
          .catch( e => this._toastr.error(e.message) )
          )
      .catch(
        error => this._toastr.error('ERROR: ' + error.message)
      );
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
      .then( (result) => { console.log(result); })
      .catch( (error) => { console.error(error); });
  }

  //
  // Table list
  //

  tables: Table[];
  selectedTable: Table;
  @ViewChild('tableModal') public tableModal: ModalDirective;

  getTableById(id: string): Table {
    if(!id) return undefined;
    let tabs: Table[] = this.tables.filter(t => t.id == id);
    if(tabs.length == 0) return undefined;
    return tabs[0];
  }

  isPrimitiveTable(id: string): boolean {
    let t: Table = this.getTableById(id);
    if(!t) return true;
    return t.isPrimitve();
  }

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

  onTablesReceived(tables: Table[] | Object) { // Whenever a new list of tables is received. Update the model. We can also receive an error object.
    if(tables instanceof Array) { // Success
      this.tables = tables;
    }
    else if(tables instanceof Object) { // Error
      this.tables = [];
      let code: ServiceErrorCode = tables['code'] || 0;
      if(code === ServiceErrorCode.NOT_FOUND_IDENTITY) {
        this._toastr.error('Session expired. Create a new session by reloading page in the browser.', 'NOT_FOUND_IDENTITY');
      }
    }

    // Make default selection in the recevied list which can trigger loading a lower list or emptying it
    let list = this.nonprimitiveTables();
    if(list.length == 0) { // Nothing to select from
      this.onTableSelect(undefined);
    }
    else if(this.selectedTable && this.selectedTable.id && list.filter(x => x.id == this.selectedTable.id).length > 0) { // Previous selection exists. Use it
      this.onTableSelect(this.selectedTable);
    }
    else { // No previous selection. Use default one
      this.onTableSelect(list[0]);
    } 
  }

  onTableSelect(tab: Table) {
    if(tab) { // Edit existing 
      this.selectedTable = tab.clone(); // Copy object for editing
    }
    else if(tab === undefined) { // No selection
      this.selectedTable = undefined;
    }
    else { // null. Create new
      tab = new Table('');
      tab.name = this.getUniqueName(this.tables, 'New Table');

      this.selectedTable = tab;

      this.tableModal.show();
    }

    this._scService.getInputColumns(this.selectedSchema, this.selectedTable)
      .then( x => this.onColumnsReceived(x) )
      .catch( e => this._toastr.error(e.message) );

    this.getRecords(); // Show records
  }

  //
  // Table details
  //

  onTableSubmit() {
    if(!this.selectedTable.id || this.selectedTable.id.length === 0) { // Add new
      this._scService.createTable(this.selectedSchema, this.selectedTable)
        .then( x => {
          if(x['code']) { // Error
            let msg: string = x['message'] || 'Error creating table.';
            msg += ' ' + (x['description'] || '');
            this._toastr.error(msg);
          }

          // The newly created element will be selected
          this.selectedTable.id = x.id || "";

          // Load all table
          this.onSchemaSelect(this.selectedSchema);
        }
      );
    }
    else { // Update existing
      this._scService.updateTable(this.selectedTable)
        .then( x => {
          if(x['code']) { // Error
            let msg: string = x['message'] || 'Error updating table.';
            msg += ' ' + (x['description'] || '');
            this._toastr.error(msg);
          }
          this.onSchemaSelect(this.selectedSchema);
        }
      );
    }
  }

  onTableDelete() {
    if(!this.selectedTable.id || this.selectedTable.id.length === 0) { // Nothing to do. Cannot delete new
      return;
    }
    else { // Delete existing
      this._scService.deleteTable(this.selectedTable)
        .then( x => {
          this.allRecords.delete(this.selectedTable.id);
          this.onSchemaSelect(this.selectedSchema);
        }
      );
    }
  }

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
    this._scService.read(this.selectedTable)
      .then( records => {
        if(records instanceof Array) { // Success
          this.allRecords.set(this.selectedTable.id, records);
          this.records = records;

          this._toastr.info('Data synchronized.');
        }
        else if(records instanceof Object) { // Error
            let msg: string = records['message'] || 'Error loading table data.';
            msg += ' ' + (records['description'] || '');
            this._toastr.error(msg);
        }
      })
      .catch(
        error => this._toastr.error('ERROR: ' + error.message)
      );
  }

  onTableEmpty() {
    // Empty data in one table
    this._scService.empty(this.selectedTable)
      .then( x => {
        this._toastr.info('Data removed.');
        this.onTableRead(); // Read data from the table (should be empty)
      }
    );
  }

  // Write

  uploadCsv: string;

  onTableUpload() {
    // Write data to the service
    this._scService.write(this.selectedTable, this.uploadCsv)
      .then(x => {
        this._toastr.info('Data uploaded.');
        this.onTableRead(); // Read data from the table
      })
      .then(x =>
        this._scService.getInputColumns(this.selectedSchema, this.selectedTable)
          .then( x => this.onColumnsReceived(x) )
          .catch( e => this._toastr.error(e.message) )
    );
  }

  //
  // Column list
  //

  columns: Column[];
  selectedColumn: Column;
  @ViewChild('columnModal') public columnModal: ModalDirective;

  // We cannot directly use elements of enum in templates like ColumnKind.LINK, hence we create a variable which stores all the elements
  columnKinds: typeof ColumnKind = ColumnKind; // Note the use of typeof
  // columnKinds = ColumnKind; // Alternative. Even simpler

  getUniqueName(elems: any[], prefix: string): string {
    if(elems == null || elems.length == 0) return prefix;
    let prefixUpper: string = prefix.toLocaleUpperCase();
     for (let i = 1; i <= 100; i++) {
       let el: any = elems.find(x => x.name.toLocaleUpperCase() === prefixUpper + ' ' + i)
       if(el == null) return prefix + ' ' + i;
     }
     return prefix;
  }

  onColumnsReceived(columns: Column[] | Object) {
    if(columns instanceof Array) { // Success
      this.columns = columns;
      this.resolveColumns();
    }
    else if(columns instanceof Object) { // Error
      this.columns = [];

      if(columns['code'] && columns['code'] === ServiceErrorCode.NOT_FOUND_IDENTITY) {
        this._toastr.error('Session expired. Create a new session by reloading page in the browser.', 'NOT_FOUND_IDENTITY');
      }
      else if(columns['code']) { // Error
        let msg: string = columns['message'] || 'Error retrieving columns from server.';
        msg += ' ' + (columns['description'] || '');
        this._toastr.error(msg);
      }

      this._toastr.error('Error retrieving columns from server.');
    }

    // Make default selection in the recevied list which can trigger loading a lower list or emptying it
    let list = this.columns;
    if(list.length == 0) { // Nothing to select from
      this.onColumnSelect(undefined);
    }
    else if(this.selectedColumn && this.selectedColumn.id && list.filter(x => x.id == this.selectedColumn.id).length > 0) { // Previous selection exists. Use it
      this.onColumnSelect(this.selectedColumn);
    }
    else { // No previous selection. Use default one
      this.onColumnSelect(list[0]);
    } 
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

  onColumnSelect(col: Column) {
    if(col) { // Edit existing
      this.selectedColumn = col.clone(); // Copy object for editing
    }
    else if(col === undefined) { // No selection
      this.selectedColumn = undefined;
    }
    else { // Create new
      col = new Column('');
      col.name = this.getUniqueName(this.columns, 'New Column');
      col.input.id = this.selectedTable.id;
      col.input.table = this.selectedTable;
      let type = this.tables.find(t => t.name === 'Double');
      col.output.id = type.id;
      col.output.table = type;

      this.selectedColumn = col;

      this.columnModal.show();
    }
  }

  //
  // Column details
  //

  onColumnSubmit() {
    if(!this.selectedColumn.id || this.selectedColumn.id.length === 0) { // Add new
      this._scService.createColumn(this.selectedSchema, this.selectedColumn)
        .then( x => {
          if(x['code']) { // Error
            let msg: string = x['message'] || 'Error creating column.';
            msg += ' ' + (x['description'] || '');
            this._toastr.error(msg);
          }

          // The newly created element will be selected
          this.selectedColumn.id = x.id || "";

          // Load all columns
          this.onTableSelect(this.selectedTable);
        }
      );
    }
    else { // Update existing
      this._scService.updateColumn(this.selectedColumn)
        .then( x => {
          if(x['code']) { // Error
            let msg: string = x['message'] || 'Error updating column.';
            msg += ' ' + (x['description'] || '');
            this._toastr.error(msg);
          }
          this.onTableSelect(this.selectedTable);
        }
      );
    }
  }

  onColumnDelete() {
    if(!this.selectedColumn.id || this.selectedColumn.id.length === 0) { // Nothing to do. Cannot delete new
      return;
    }
    else { // Delete existing
      this._scService.deleteColumn(this.selectedColumn)
        .then( x => this.onTableSelect(this.selectedTable) );
    }
  }

}
