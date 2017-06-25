import { Component } from '@angular/core';

import { Schema } from './schema';
import { Table, TableRef } from './table';
import { Column } from './column';
import { ColumnKind } from './column';

@Component({
  selector: 'dc-sim',
  templateUrl: 'sim.component.html',
  styleUrls: ['app.component.css']
})
export class SimComponent {
  title = 'STREAM SIMULATOR';


  selectedTable: Table;

}
