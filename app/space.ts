import { Table } from './table';

export class Space {
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
