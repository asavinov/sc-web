import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Space } from './space';
import { Table, TableRef } from './table';
import { Column } from './column';

import { ScService } from './sc.service';

@Component({
  selector: 'sc-data',
  templateUrl: 'app/data.component.html'
})
export class DataComponent implements OnInit {

  constructor(private _router: Router, private _scService: ScService) { 
  }

  ngOnInit() {
    this.getTables()
  }

  // Tables

  tables: Table[];
  selectedTable: Table;

  getTables() {
    this._scService.getTables().then(tables => this.tables = tables);
  }

  // Write

  writeJson: string;

  onWriteSubmit() {
    // Write to the service
    this._scService.write(this.selectedTable, this.writeJson)
  }

  // Read

  readJson: string;

  onReadSubmit() {
    // Write to the service
    this._scService.read(this.selectedTable).then(records => this.readJson = JSON.stringify(records));
  }

}
