import { Space } from './space';
import { Table } from './table';
import { Column } from './column';

export class ScSampleData {
  // We simulate a database with named tables which contain records (objects)
  // returns a map whose keys are collection names and whose values are arrays of objects in those collections
  createDb() {
    // Name of the variable will be a key in the dictionary 
    // It is important because the service will use the name in service url to find a table with the coresponding name
    let spaces: Space[] = [
      { 'id': '0', 'name': 'My Space' },
    ];
    let tables: Table[] = [
      { 'id': '01', 'name': 'Double' },
      { 'id': '02', 'name': 'String' },
      { 'id': '11', 'name': 'Events' },
      { 'id': '12', 'name': 'Devices' },
    ];
    let columns: Column[] = [
      { 'id': '101', 'name': 'Column 1', 'input_ref': {'id': '11', 'table': undefined}, 'output_ref': {'id': '01', 'table': undefined} },
      { 'id': '102', 'name': 'My column', 'input_ref': {'id': '11', 'table': undefined}, 'output_ref': {'id': '02', 'table': undefined} },
      { 'id': '103', 'name': 'Events column', 'input_ref': {'id': '12', 'table': undefined}, 'output_ref': {'id': '01', 'table': undefined} },
      { 'id': '104', 'name': 'Device columns', 'input_ref': {'id': '12', 'table': undefined}, 'output_ref': {'id': '02', 'table': undefined} },
      { 'id': '105', 'name': 'Device columns 2', 'input_ref': {'id': '12', 'table': undefined}, 'output_ref': {'id': '11', 'table': undefined} },
    ];

    return {spaces, tables, columns};
  }

}
