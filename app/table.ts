export class Table {
  constructor(id: string) { 
    this.id = id;
    this.name = "";
  }

  id: string;
  name: string;

  toJson(): String {
    return JSON.stringify(this);
  }
}

export class TableRef {

  constructor(id: string) { 
    this.id = id;
  }

  id: string;
  table: Table;

  toJson(): String {
    return JSON.stringify(this);
  }
}
