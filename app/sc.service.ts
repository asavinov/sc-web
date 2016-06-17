import { Injectable } from 'angular2/core';

import { Table } from './table';
import { TABLES } from './mock-tables';

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

  getTable(id: number) {
    return Promise.resolve(TABLES).then(
      tables => tables.filter(table => table.id === id)[0]
    );
  }
}
