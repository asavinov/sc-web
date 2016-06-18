import { Space } from './space';
import { Table } from './table';
import { Column } from './column';

export var SPACES: Space[] = [
  { 'id': '0', 'name': 'My Space' },
];

export var TABLES: Table[] = [
  { 'id': '01', 'name': 'Double' },
  { 'id': '02', 'name': 'String' },
  { 'id': '11', 'name': 'Events' },
  { 'id': '12', 'name': 'Devices' },
];

export var COLUMNS: Column[] = [
  { 'id': '101', 'name': 'Column 1', 'input_ref': '11', 'output_ref': '01' },
  { 'id': '102', 'name': 'My column', 'input_ref': '11', 'output_ref': '02' },
  { 'id': '103', 'name': 'Events column', 'input_ref': '12', 'output_ref': '01' },
  { 'id': '104', 'name': 'Device columns', 'input_ref': '12', 'output_ref': '02' },
  { 'id': '105', 'name': 'Device columns 2', 'input_ref': '12', 'output_ref': '11' },
];
