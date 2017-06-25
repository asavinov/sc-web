import { Component, OnInit, AfterViewInit, ViewChild, ViewContainerRef } from '@angular/core';

import { AppService, ServiceError, ServiceErrorCode } from './app.service';

import { ModalDirective } from 'ngx-bootstrap';

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
  selector: 'dc-edit',
  templateUrl: 'edit.component.html',
  styleUrls:  ['edit.component.css']
})
export class EditComponent implements OnInit, AfterViewInit {

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

    //this.tipsModal.show();
  }

  ngOnDestroy() {
    ; // Notify server
  }

  ngAfterViewInit() {
    this.tipsModal.show();
  }

  //
  // Tips
  //
  public tipCount = 7;
  public tipNumber = 0;
  public tipText: string[] = [
    "Start working by creating a new <b>database</b> (called base in Data Commandr) or selecting an existing (example) base from the list of bases. ",
    "Create a new <b>table</b> in the list of tables or select an existing table. A table is intended for storing a number of rows with data structured by the table columns.",
    "Load data into the selected table from a CSV file by clicking <b>Upload</b> button. The columns will be created automatically from the file header if the corresponding option is selected.",
    "Create new or additional columns for the selected table. <b>Data type</b> specifies what kind of data this column will store. <b>Column type</b> specifies how data in this column are produced.",
    "Choose <b>calculated</b> column type if this column values will be computed from other column values using a <b>formula</b> that has to be specified in another field.",
    "Choose <b>accumulated</b> column type if this column values will be computed from a group of <em>many</em> rows of another table that has to be specified in addition to other parameters.",
    "Choose <b>link</b> column type if this column values will reference rows of another table which is this column data type."
    ];
  @ViewChild('tipsModal') public tipsModal: ModalDirective;

  firstTip(): boolean {
    if(this.tipNumber == 0) return true;
    else return false;
  }
  lastTip(): boolean {
    if(this.tipNumber == this.tipCount-1) return true;
    else return false;
  }
  previousTip() {
    if(!this.firstTip()) {
      this.tipNumber--;
    }
  }
  nextTip() {
    if(!this.lastTip()) {
      this.tipNumber++;
    }
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
    this.selectedTableColumns = [];
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

  schemas: Schema[] = [];
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
    let list = (this.schemas == null ? [] : this.schemas);
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
      sch.name = this.getUniqueName(this.schemas, 'New Base');

      this.selectedSchema = sch;

      this.schemaModal.show();
    }

    // Load a list of tables and then a list of all schema columns
    this._scService.getTables(this.selectedSchema)
      .then( x => { 
        this.onTablesReceived(x); 

        this._scService.getColumns(this.selectedSchema)
          .then( x => this.onColumnsReceived(x) )
          .catch( e => this._toastr.error(e.message) );

        } 
      )
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

  allRecords = new Map<string,any[]>(); // Table guid is a key, and value is a list of record objects
  records: any = []; // Records of the selected table only (displayed in the table view)

  dataLoaded(tableId: string): boolean {
    if(tableId == null) {
      return false;
    }

    // Find table by id
    let recs = this.allRecords.get(tableId);
    if(recs == null) {
      return false;
    }

    return true;
  }

  getRecordAsList(tableId: string, recordId: string):any[] { // Get one record as a list of [col_name,col_value] pairs (in their original column order)
    if(tableId == null || recordId == null) {
      return undefined;
    }

    // Find table by id
    let recs = this.allRecords.get(tableId);
    if(recs == null) {
      return undefined;
    }

    // Find record by id
    let rec: Object = recs.find(x => x['_id'] === recordId)
    if(rec == null) {
      return undefined;
    }

    // Transform to a list of pairs
    let cols = this.getInputColumns(tableId);
    let fields = [];
    for (let col of cols) {
      fields.push([col.name, rec[col.name]]);
    }

    return fields;
  }

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
      .then( x => this._scService.getColumns(this.selectedSchema)
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
  maxCsvFileSize = 8192;

  // Store file in the model as soon as something is selected (manual binding)
  fileChangeEvent(fileInput: any) {
    let target: HTMLInputElement = <HTMLInputElement> fileInput.target;
    let files: FileList = target.files; // Array<File>
    let file  = <File> files[0];

    this.fileToUpload = file;
  }

  // Really read the previously selected file and paste the records to the text area maybe with some processing and validation
  loadFileToTextArea() {
    if(!this.fileToUpload) return;

    let reader = new FileReader();
    let this_model = this;
    reader.onload = function(event) {
      let file_text = reader.result;
      let lines = file_text.split('\n');
      let currentSize = 0;
      let text = '';
      for(let i=0; i<lines.length; i++) {
        if(currentSize + lines[i].length + 1 > this_model.maxCsvFileSize) {
          this_model._toastr.info('Currently the size is limited by ' + this_model.maxCsvFileSize + ' bytes. ' + i + ' lines have been loaded.');
          break;
        }
        text += lines[i] + '\n';
        currentSize += lines[i].length + 1;
      }
      this_model.uploadCsv = text;
    };
    reader.onerror = function(event) {
      console.error("File could not be read! Code " + event.error);
    };
    reader.readAsText(this.fileToUpload);

    // Alternative (node.js)
    //import * as fs from "fs";
    // let fileName = 'myfile.csv';
    //let fileContents = fs.readFileSync(fileName, 'utf8');
    //fileContents.split(','); // Or whatever
  }

  onUploadClick() {
    this._scService.uploadFile(this.fileToUpload)
      .then( (result) => { console.log(result); })
      .catch( (error) => { console.error(error); });
  }

  //
  // Table list
  //

  tables: Table[] = [];
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

    this.selectedTableColumns = this.selectedTable == null ? [] : this.getInputColumns(this.selectedTable.id);

    // Try to select the previous selected column or defualt (first). This can trigger loading a lower list or emptying it
    let list = (this.selectedTableColumns == null ? [] : this.selectedTableColumns);
    if(list.length == 0) { // Nothing to select from
      this.onColumnSelect(undefined);
    }
    else if(this.selectedColumn && this.selectedColumn.id && list.filter(x => x.id == this.selectedColumn.id).length > 0) { // Previous selection exists. Use it
      this.onColumnSelect(this.selectedColumn);
    }
    else { // No previous selection. Use default one
      this.onColumnSelect(list[0]);
    } 

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
  createColumns: boolean = true;

  onTableUpload() {
    // Collect parameters
    let params = { createColumns: this.createColumns }
    // Write data to the service
    this._scService.write(this.selectedTable, this.uploadCsv, params)
      .then(x => {
        this._toastr.info('Data uploaded.');
        this.onTableRead(); // Read data from the table
      })
      .then(x =>
        this._scService.getColumns(this.selectedSchema)
          .then( x => this.onColumnsReceived(x) )
          .catch( e => this._toastr.error(e.message) )
    );
  }

  // Stream

  streamCsv: string;

  streamFrequency: number = 1000;
  streamCount: number = 5;

  isStarted: boolean = false;
  eventsSent: number = 0;
  streamTimer = null;

/*
TODO: Send lines of csv rather than the whole csv (one event per append). Maybe use some other method (not csv but something like append json)
  Maybe introduce checkbox: all lines in one event (otherwise one line per event)
TODO: Show progress as progress bar (or something moving) in dialog.
TODO: Show progress in main (edit) screen, say, rotating spinner.
NEXT: 1) set parameters for auto-evaluation in UI 2) periodically evaluate on the server according to these parameters
*/  
  onTableStreamStart() {
    //
    // Initialize the state
    //
    this.isStarted = true;
    this.eventsSent = 0;
    if (this.streamTimer != null) {
      clearInterval(this.streamTimer);
    }

    //
    // Start timer which will send events periodically
    //
    this.streamTimer = setInterval( this.sendEvent, this.streamFrequency, this);
    // Now the send event method will be called periodically
  }

  onTableStreamStop() {
    this.isStarted = false;
    this.eventsSent = 0;
    if (this.streamTimer != null) {
      clearInterval(this.streamTimer);
    }
  }

  // This method will be sent by the timer and really send next event by means of REST call
  // We need to pass a component because 'this' points to the Window
  sendEvent(model:EditComponent) {

    // Stop if explicit signal
    if(model.isStarted == false || model.eventsSent >= model.streamCount) {
      model.onTableStreamStop();
      return;
    }

    let params = { createColumns: false }
    // Write data to the service
    model._scService.write(model.selectedTable, model.streamCsv, params)
      .then(x => {
        model.eventsSent++; // Update progress
      })
      .catch( e => {
        model._toastr.error(e.message);
        model.onTableStreamStop(); // Stop the process
      });
  }

  //
  // Column list
  //

  columns: Column[] = [];

  selectedTableColumns: Column[] = [];
  selectedColumn: Column;
  @ViewChild('columnModal') public columnModal: ModalDirective;

  // We cannot directly use elements of enum in templates like ColumnKind.LINK, hence we create a variable which stores all the elements
  columnKinds: typeof ColumnKind = ColumnKind; // Note the use of typeof
  // columnKinds = ColumnKind; // Alternative. Even simpler

  getUniqueName(elems: any[], prefix: string): string {
    if(elems == null) return prefix;
    let prefixUpper: string = prefix.toLocaleUpperCase();
     for (let i = 1; i <= 100; i++) {
       let el: any = elems.find(x => x.name.toLocaleUpperCase() === prefixUpper + ' ' + i)
       if(el == null) return prefix + ' ' + i;
     }
     return prefix;
  }

  getInputColumns(table_id: string): Column[] {
    return this.columns.filter(col => col.input.id === table_id);
  }

  onColumnsReceived(columns: Column[] | Object) { // Called when a list of ALL schema columns arrived
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

    // Update the list of columns of the currently selected table
    if(this.selectedTable == null) {
      this.selectedTableColumns = [];
    }
    else {
      this.selectedTableColumns = this.getInputColumns(this.selectedTable.id);
    }

    // Try to select the previous selected column or defualt (first). This can trigger loading a lower list or emptying it
    let list = (this.selectedTableColumns == null ? [] : this.selectedTableColumns);
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
      col.name = this.getUniqueName(this.selectedTableColumns, 'New Column');
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
          this._scService.getColumns(this.selectedSchema)
            .then( x => this.onColumnsReceived(x) )
            .catch( e => this._toastr.error(e.message) );
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

          // Load all columns
          this._scService.getColumns(this.selectedSchema)
            .then( x => this.onColumnsReceived(x) )
            .catch( e => this._toastr.error(e.message) );
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
        .then( x => {
          if(x['code']) { // Error
            let msg: string = x['message'] || 'Error deleting column.';
            msg += ' ' + (x['description'] || '');
            this._toastr.error(msg);
          }

          // Load all columns
          this._scService.getColumns(this.selectedSchema)
            .then( x => this.onColumnsReceived(x) )
            .catch( e => this._toastr.error(e.message) );
          }
        );
    }
  }

}
