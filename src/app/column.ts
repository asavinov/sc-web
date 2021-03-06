import { Table, TableRef } from './table';
import { ServiceError, ServiceErrorCode } from './app.service';

export class Column {

  constructor(id: string) {
    this.id = id;
    this.name = '';
    this.input = new TableRef('');
    this.output = new TableRef('');

    this.kind = ColumnKind.USER;
  }

  id: string;
  name: string;

  input: TableRef;
  output: TableRef;

  isPrimitve(): boolean {
    if(!this.output || !this.output.table) return false;
    return this.output.table.isPrimitve();
  }

  kind: ColumnKind;

  isDerived(): boolean {
    let k: ColumnKind = this.kind;
		if(k == ColumnKind.CALC || k == ColumnKind.ACCU || k == ColumnKind.LINK || k == ColumnKind.CLASS) {
			return true;
		}
    return false;
  }

  calcFormula: string; // CALC

  linkFormula: string; // LINK

  initFormula: string; // ACCU
  accuFormula: string;
  accuTable: string;
  accuPath: string;

  descriptor: string;

  dirty: boolean;
  status: ServiceError;

  getFormulaForColumnCard(): string {
    if(this.kind == ColumnKind.USER) return "";
    else if(this.kind == ColumnKind.CALC) return this.calcFormula;
    else if(this.kind == ColumnKind.LINK) return this.linkFormula;
    else if(this.kind == ColumnKind.ACCU) return this.accuFormula;
    else return "";
  }

  getStatusColor(): string {
    if(this.kind == ColumnKind.USER) return "";
    //if (!this.calcFormula || this.calcFormula.trim().length === 0) return '';

    if (!this.status || !this.status.code || this.status.code === ServiceErrorCode.NONE.valueOf() ) return 'green';

    if (
      this.status.code === ServiceErrorCode.PARSE_PROPAGATION_ERROR.valueOf() || this.status.code === ServiceErrorCode.BIND_PROPAGATION_ERROR.valueOf() ||
      this.status.code === ServiceErrorCode.TRANSLATE_PROPAGATION_ERROR.valueOf() ||
      this.status.code === ServiceErrorCode.DEPENDENCY_CYCLE_ERROR.valueOf()
      )
      return 'yellow';

    if (
      this.status.code === ServiceErrorCode.PARSE_ERROR.valueOf() || this.status.code === ServiceErrorCode.BIND_ERROR.valueOf()
      )
      return 'red';

    return 'green';
  }

  getStatusMessage(): string {
    if(this.kind == ColumnKind.USER) return "";
    //if (!this.calcFormula || this.calcFormula.trim().length === 0) return '';

    if (!this.status || !this.status.code || this.status.code === ServiceErrorCode.NONE.valueOf() ) return 'OK';

    if (
      this.status.code === ServiceErrorCode.PARSE_ERROR.valueOf() || this.status.code === ServiceErrorCode.BIND_ERROR.valueOf() ||
      this.status.code === ServiceErrorCode.PARSE_PROPAGATION_ERROR.valueOf() || this.status.code === ServiceErrorCode.BIND_PROPAGATION_ERROR.valueOf() ||
      this.status.code === ServiceErrorCode.TRANSLATE_PROPAGATION_ERROR.valueOf() ||
      this.status.code === ServiceErrorCode.DEPENDENCY_CYCLE_ERROR.valueOf()
      )
      return this.status.message ? this.status.message : 'ERROR';

    return 'ERROR';
  }

  getStatusDescription(): string {
    if(this.kind == ColumnKind.USER) return "";
    //if (!this.calcFormula || this.calcFormula.trim().length === 0) return '';

    if (!this.status || !this.status.code || this.status.code === ServiceErrorCode.NONE.valueOf() ) return 'No errors found.';

    if (
      this.status.code === ServiceErrorCode.PARSE_ERROR.valueOf() || this.status.code === ServiceErrorCode.BIND_ERROR.valueOf() ||
      this.status.code === ServiceErrorCode.PARSE_PROPAGATION_ERROR.valueOf() || this.status.code === ServiceErrorCode.BIND_PROPAGATION_ERROR.valueOf() ||
      this.status.code === ServiceErrorCode.DEPENDENCY_CYCLE_ERROR.valueOf()
      )
      return this.status.description ? this.status.description : 'Errors have been found.';

    return 'Errors have been found.';
  }

  clone(): Column {
    let col: Column = new Column(this.id);
    Object.assign(col, this);
    return col;
  }

  toJson(): string {
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

    col.kind = json.kind;

    col.calcFormula = json.calcFormula;

    col.linkFormula = json.linkFormula;

    col.initFormula = json.initFormula;
    col.accuFormula = json.accuFormula;
    col.accuTable = json.accuTable;
    col.accuPath = json.accuPath;

    col.descriptor = json.descriptor;

    col.dirty = json.dirty;
    col.status = ServiceError.fromJsonObject(json.status);

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

export enum ColumnKind {
    NONE = 10,
    UNKNOWN = 20,

    AUTO = 0,

    USER = 50,
    CALC = 60,
    LINK = 70,
    ACCU = 90,

    CLASS = 100,
}
