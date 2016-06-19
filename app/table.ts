export class Table {
  id: string;
  name: string;
}

export class TableRef {

  constructor(id: string) { 
    this.id = id;
  }

  id: string;
  table: Table;
}
