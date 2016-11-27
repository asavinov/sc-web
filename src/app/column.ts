import { Table, TableRef } from './table';
import { ServiceError, ServiceErrorCode } from './app.service';

export class Column {

  constructor(id: string) {
    this.id = id;
    this.name = '';
    this.input = new TableRef('');
    this.output = new TableRef('');
  }

  id: string;
  name: string;

  input: TableRef;
  output: TableRef;

  formula: string;
  facttable: string;
  grouppath: string;
  descriptor: string;

  status: ServiceError;

  getStatusColor(): string {
    if (!this.formula || this.formula.trim().length === 0) return '';

    if (!this.status || !this.status.code || this.status.code === ServiceErrorCode.NONE.valueOf() ) return 'green';

    if (this.status.code === ServiceErrorCode.PARSE_ERROR.valueOf() ) return 'yellow';

    // TODO: Return status color depending on the status error

    return 'green';
  }

  clone(): Column {
    let col: Column = new Column(this.id);
    Object.assign(col, this);
    return col;
  }

  toJson(): String {
    return JSON.stringify(this);
  }
  static fromJsonObject(json: any): Column {
    let col: Column = new Column('');

    col.id = json.id;
    col.name = json.name;
    col.input.id = json.input.id;
    col.input.table = undefined;
    col.output.id = json.output.id;
    col.output.table = undefined;
    col.formula = json.formula;
    col.facttable = json.facttable;
    col.grouppath = json.grouppath;
    col.descriptor = json.descriptor;

    return col;
  }
  static fromJsonList(json: any): Column[] {
    let cols: Column[] = [];
    if (!json) return cols;

    let col: Column;
    for (let o of json) {
      col = Column.fromJsonObject(o);
      cols.push(col);
    }

    return cols;
  }

}
