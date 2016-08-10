import { Schema } from './schema';
import { Table } from './table';
import { Column } from './column';

export class ScSampleData {
  // We simulate a database with named tables which contain records (objects)
  // returns a map whose keys are collection names and whose values are arrays of objects in those collections
  createDb() {
    // Name of the variable will be a key in the dictionary 
    // It is important because the service will use the name in service url to find a table with the coresponding name
    let s = Object.create(Schema.prototype);
    Object.assign(s, {'id':'0', 'name':'My Space'});
    let spaces: Schema[] = [ s ];

    let t1 = new Table("01"); Object.assign(t1, {'name':'Double'});
    let t2 = new Table("02"); Object.assign(t1, {'name':'String'});
    let t3 = new Table("03"); Object.assign(t1, {'name':'Events'});
    let t4 = new Table("04"); Object.assign(t1, {'name':'Devices'});

    let tables: Table[] = [ t1, t2, t3, t4 ];

    let columns: Column[] = [];
    /* 
    [
      { 'id': '101', 'name': 'Column 1', 'input': {'id': '11', 'table': undefined}, 'output': {'id': '01', 'table': undefined} },
      { 'id': '102', 'name': 'My column', 'input': {'id': '11', 'table': undefined}, 'output': {'id': '02', 'table': undefined} },
      { 'id': '103', 'name': 'Events column', 'input': {'id': '12', 'table': undefined}, 'output': {'id': '01', 'table': undefined} },
      { 'id': '104', 'name': 'Device columns', 'input': {'id': '12', 'table': undefined}, 'output': {'id': '02', 'table': undefined} },
      { 'id': '105', 'name': 'Device columns 2', 'input': {'id': '12', 'table': undefined}, 'output': {'id': '11', 'table': undefined} },
    ];
    */

    return {spaces, tables, columns};
  }

}
