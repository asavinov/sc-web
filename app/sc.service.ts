import { Injectable } from '@angular/core';

import { Space } from './space';
import { SPACES } from './mock-data';

import { Table } from './table';
import { TABLES } from './mock-data';

import { Column } from './column';
import { COLUMNS } from './mock-data';

@Injectable()
export class ScService {

  //
  // Spaces
  //

  getSpaces() {
    return Promise.resolve(SPACES);
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
      columns => columns.filter(column => column.input_ref.id === input_id)
    );
  }

  updateColumn(column: Column) {
    // Copy the whole object
    let idx = COLUMNS.findIndex(c => c.id === column.id)
    COLUMNS[idx] = column

    // Copy individual fields
    //let col = COLUMNS.find(c => c.id === column.id)
    //col.name = column.name
    //col.input_ref = column.input_ref
    //col.output_ref = column.output_ref
  }

}
