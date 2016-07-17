export class Table {
  constructor(id: string) { 
    this.id = id;
    this.name = "";
  }

  id: string;
  name: string;

  clone(): Table {
    let tab: Table = new Table(this.id)
    Object.assign(tab, this)
    return tab
  }

  toJson(): String {
    return JSON.stringify(this);
  }
  static fromJsonObject(json: any): Table {
    let tab: Table = new Table("")

    tab.id = json.id
    tab.name = json.name

    return tab
  }
  static fromJsonList(json: any): Table[] {
    let tabs: Table[] = []
    if(!json) return tabs

    let tab: Table;
    for(let o of json) {
      tab = Table.fromJsonObject(o)
      tabs.push(tab)
    }

    return tabs;
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
