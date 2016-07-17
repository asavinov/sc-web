import { Injectable } from '@angular/core';

import { Schema } from './schema';
import { Table } from './table';
import { Column } from './column';

//import { SCHEMAS } from './mock-data';
//import { TABLES } from './mock-data';
//import { COLUMNS } from './mock-data';

@Injectable()
export class ScMockService {

  //
  // Schemas
  //

  getSpaces() {
    return Promise.resolve(SCHEMAS);
  }

  //
  // Tables
  //

  getTables() {
    return Promise.resolve(TABLES);
  }

  getTablesSlowly() {
    return new Promise<Table[]>(resolve =>
      setTimeout(()=>resolve(TABLES), 2000) // 2 seconds
    );
  }

  getTable(id: string) {
    return Promise.resolve(TABLES).then(
      tables => tables.filter(table => table.id === id)[0]
    );
  }

  //
  // Columns
  //

  getColumns() {
    return Promise.resolve(COLUMNS);
  }

  getInputColumns(input_id: string) {
    if(!input_id || input_id.length === 0) return Promise.resolve([])
    return Promise.resolve(COLUMNS).then(
      columns => columns.filter(column => column.input.id === input_id)
    );
  }

  id_counter: number = 1000
  addColumn(column: Column) {
    column.id = String(this.id_counter++)
    COLUMNS.push(column)

    // Copy individual fields
    //let col = COLUMNS.find(c => c.id === column.id)
    //col.name = column.name
    //col.input = column.input
    //col.output = column.output
  }

  updateColumn(column: Column) {
    // Copy the whole object
    let idx = COLUMNS.findIndex(c => c.id === column.id)
    COLUMNS[idx] = column

    // Copy individual fields
    //let col = COLUMNS.find(c => c.id === column.id)
    //col.name = column.name
    //col.input = column.input
    //col.output = column.output
  }

  //
  // Data (push, pop)
  //

  push(json: string) {
    console.log("PUSHED: " + json)
  }

}

export var SCHEMAS: Schema[] = []
/*
[
  { 'id': '0', 'name': 'My Space' },
];
*/

export var TABLES: Table[] = []
/* 
[
  { 'id': '01', 'name': 'Double' },
  { 'id': '02', 'name': 'String' },
  { 'id': '11', 'name': 'Events' },
  { 'id': '12', 'name': 'Devices' },
];
*/

export var COLUMNS: Column[] = []
/* 
[
  { 'id': '101', 'name': 'Column 1', 'input': {'id': '11', 'table': undefined}, 'output': {'id': '01', 'table': undefined} },
  { 'id': '102', 'name': 'My column', 'input': {'id': '11', 'table': undefined}, 'output': {'id': '02', 'table': undefined} },
  { 'id': '103', 'name': 'Events column', 'input': {'id': '12', 'table': undefined}, 'output': {'id': '01', 'table': undefined} },
  { 'id': '104', 'name': 'Device columns', 'input': {'id': '12', 'table': undefined}, 'output': {'id': '02', 'table': undefined} },
  { 'id': '105', 'name': 'Device columns 2', 'input': {'id': '12', 'table': undefined}, 'output': {'id': '11', 'table': undefined} },
];
*/
