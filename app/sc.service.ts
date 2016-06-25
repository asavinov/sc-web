import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';

import { Space } from './space';
import { Table } from './table';
import { Column } from './column';

@Injectable()
export class ScService {

  constructor (private http: Http) {
  }

  // URL to web API
  //private scUrl = 'api/v1'; 

  // Alternatively (without in-mem server), we can point to a file 
  //private scSpaceUrl = 'app/mock-spaces.json';
  //private scTableUrl = 'app/mock-tables.json';
  //private scColumnUrl = 'app/mock-columns.json';
  
  // With in-mem server, we point to table names used as a key in dictionary
  // It is configured in main.ts. We need to create a class which contains (and initializes the dict with data)
  // The name in this url must correspond to the name in the sample database  
  private scSpaceUrl = 'app/spaces';
  private scTableUrl = 'app/tables';
  private scColumnUrl = 'app/columns';

  //
  // Spaces
  //

  getSpaces() {
    return this.http.get(this.scSpaceUrl)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
  }

  //
  // Tables
  //

  getTables(): Promise<Table[]> {
    return this.http.get(this.scTableUrl)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
  }

  getTable(id: string) {
  }

  //
  // Columns
  //

  getColumns(): Promise<Column[]> {
    return this.http.get(this.scColumnUrl)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
  }

  getInputColumns(input_id: string): Promise<Column[]> {
    if(!input_id || input_id.length === 0) return Promise.resolve([])

    return this.http.get(this.scColumnUrl)
        .toPromise()
        .then(this.extractData)
        .then( columns => columns.filter((col: Column) => col.input_ref.id === input_id) )
        .catch(this.handleError);
  }

  addColumn(column: Column): Promise<Column> {

    let body = JSON.stringify(column);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this.scColumnUrl, body, options)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
  }

  updateColumn(column: Column) {

    let body = JSON.stringify(column);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.put(this.scColumnUrl + "/" + column.id, body, options)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
  }

  //
  // Data (push, pop)
  //

  push(json: string) {
    console.log("PUSHED: " + json)
  }

  //
  // Work with Response
  //

  private extractData(res: Response) {
    let body = res.json();
    return body.data || { };
  }

  private handleError (error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Promise.reject(errMsg);
  }

}
