import { Table } from './table';

export class Space {
  constructor(id: string) { 
    this.id = id;
    this.name = "";
  }

  id: string;
  name: string;

  clone(): Space {
    let spa: Space = new Space(this.id)
    Object.assign(spa, this)
    return spa
  }

  toJson(): String {
    return JSON.stringify(this);
  }
  static fromJsonObject(json: any): Space {
    let spa: Space = new Space("")

    spa.id = json.id
    spa.name = json.name

    return spa
  }
  static fromJsonList(json: any): Space[] {
    let spas: Space[] = []
    if(!json) return spas

    let spa: Space;
    for(let o of json) {
      spa = Space.fromJsonObject(o)
      spas.push(spa)
    }

    return spas;
  }





}
