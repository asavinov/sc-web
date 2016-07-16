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
    this.getSpaces()
  }

  //
  // Space list
  //
  
  spaces: Space[];
  selectedSpace: Space;

  getSpaces() {
    this._scService.getSpaces().then(
      spaces => { 
        this.spaces = spaces;
        this.selectedSpace = this.spaces[0];
        this.onSelectSapce(this.selectedSpace); 
      });
  }

  onSelectSapce(space: Space) { 
    this.selectedSpace = space; 
    this.getTables();
  }

  //
  // Tables
  //

  tables: Table[];
  selectedTable: Table;

  getTables() {
    this._scService.getTables(this.selectedSpace).then(
      tables => { 
        this.tables = tables;
        //this.selectedTable = undefined;
        this.onSelectTable(this.selectedTable); 
      });
  }

  onSelectTable(table: Table) { 
    this.selectedTable = table; 
    //this.getColumns();
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
