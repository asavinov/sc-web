import { Injectable } from 'angular2/core';

import { Table } from './table';
import { TABLES } from './mock-data';

import { Column } from './column';
import { COLUMNS } from './mock-data';

@Injectable()
export class ScService {
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

  getColumns() {
    return Promise.resolve(COLUMNS);
  }

}
