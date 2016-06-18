import { Table } from './table';
import { Column } from './column';

export var TABLES: Table[] = [
  { 'id': '11', 'name': 'Table 1' },
  { 'id': '12', 'name': 'My table' },
  { 'id': '13', 'name': 'Events table' },
  { 'id': '14', 'name': 'Devices' },
  { 'id': '15', 'name': 'Devices 2' },
];

export var COLUMNS: Column[] = [
  { 'id': '11', 'name': 'Column 1', 'input_ref': '11', 'output_ref': '11' },
  { 'id': '12', 'name': 'My column', 'input_ref': '12', 'output_ref': '12' },
  { 'id': '13', 'name': 'Events column', 'input_ref': '13', 'output_ref': '13' },
  { 'id': '14', 'name': 'Device columns', 'input_ref': '14', 'output_ref': '14' },
  { 'id': '15', 'name': 'Device columns 2', 'input_ref': '15', 'output_ref': '15' },
];
