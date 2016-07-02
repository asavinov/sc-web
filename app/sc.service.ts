import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers, Request, RequestMethod } from '@angular/http';

import { Space } from './space';
import { Table } from './table';
import { Column } from './column';


// Links to how implement in-memory service:
// - https://github.com/wardbell/a2-in-memory-web-api
// - https://github.com/johnpapa/event-view
// package 'angular2-in-memory-web-api' has these: InMemoryBackendConfig, InMemoryBackendService, SEED_DATA

@Injectable()
export class ScService {

  constructor (private http: Http) {
  }

  // URL to web API
  private scUrl = 'http://localhost:8080/api'; 

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
    return this.http.get(this.scUrl + "/spaces")
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
  }

  //
  // Tables
  //

  // Mulitple tables. /api/v1/tables

  // GET /api/v1/tables
  getTables(): Promise<Table[]> {
    return this.http.get(this.scUrl + "/tables")
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
  }

  // One table. /api/v1/tables/{id}

  getTable(id: string) {
  }

  //
  // Columns
  //

  // Mulitple columns. /api/v1/columns
/*
  let body = res.json(); // Parse json string
  if(!body) return spaces;
  if(body.data) {
    body = body.data || { }
  }
*/

  getColumns(): Promise<Column[]> {
    return this.http.get(this.scUrl + "/columns")
        .toPromise()
        .then(res => Column.fromJsonList(this.extractData(res)))
        .catch(this.handleError);
  }

  getInputColumns(input_id: string): Promise<Column[]> {
    if(!input_id || input_id.length === 0) return Promise.resolve([])

    // WORKAROUND: Here we retrieve ALL column and then filter them
    return this.getColumns()
      .then(columns => columns.filter((col: any) => col.input.id === input_id))
      .catch();
  }

  addColumn(column: Column): Promise<Column> {

    let body = column.toJson();

    // Header might be needed for authorization etc.
    let headers = new Headers();
    headers.append("Content-Type", 'application/json');
    headers.append("Authorization", 'Bearer ' + localStorage.getItem('id_token'))

    let options = new RequestOptions({headers: headers})

    return this.http.post(this.scUrl + "/columns", body, options)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);

    /* Explicitly paramterize the request
    let options = new RequestOptions({
      method: RequestMethod.Post,
      url: this.scColumnUrl,
      headers: headers,
      body: JSON.stringify(column)
    });
    return this.http.request(new Request(options))
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
    */
  }

  updateColumn(column: Column) {

    let body = column.toJson();
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.put(this.scUrl + "/columns" + "/" + column.id, body, options)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
  }

  deleteColumn(column: Column) {

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.delete(this.scUrl + "/columns" + "/" + column.id, options)
        .toPromise()
        .then()
        .catch(this.handleError);
  }

  // One column. /api/v1/columns/{id}

  getColumn(id: string) {
  }

  //
  // Data (write, read)
  //

  write(table: Table, json: string) {

    let body = json;

    // Header might be needed for authorization etc.
    let headers = new Headers();
    headers.append("Content-Type", 'application/json');
    headers.append("Authorization", 'Bearer ' + localStorage.getItem('id_token'))

    let options = new RequestOptions({headers: headers})

    return this.http.post(this.scUrl + "/tables/" + table.id + "/data", body, options)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);

    /* Explicitly paramterize the request
    let options = new RequestOptions({
      method: RequestMethod.Post,
      url: this.scColumnUrl,
      headers: headers,
      body: JSON.stringify(column)
    });
    return this.http.request(new Request(options))
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
    */
  }

  //
  // Work with Response
  //

  private extractData(res: Response) {
    let body = res.json(); // Parse json string
    if(body && body.data) {
      return body.data || { }
    }
    else {
      return body
    }
    //return body.data || { };
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
