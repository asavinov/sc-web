import { Table, TableRef } from './table';

export class Column {
  id: string;
  name: string;

  input_ref: TableRef;
  output_ref: TableRef;
}
