import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers, Request, RequestMethod } from '@angular/http';

import { Schema } from './schema';
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
  //private scSchemaUrl = 'app/mock-spaces.json';
  //private scTableUrl = 'app/mock-tables.json';
  //private scColumnUrl = 'app/mock-columns.json';
  
  // With in-mem server, we point to table names used as a key in dictionary
  // It is configured in main.ts. We need to create a class which contains (and initializes the dict with data)
  // The name in this url must correspond to the name in the sample database  
  private scSchemaUrl = 'app/spaces';
  private scTableUrl = 'app/tables';
  private scColumnUrl = 'app/columns';

  //
  // Schemas
  //

  getSchemas(): Promise<Schema[]> {
    return this.http.get(this.scUrl + "/spaces")
        .toPromise()
        .then(res => Schema.fromJsonList(this.extractData(res)))
        .catch(this.handleError);
  }

  //
  // Tables
  //

  getTables(sch: Schema): Promise<Table[]> {
    if(sch == null || sch.id == null|| sch.id.length == 0) return Promise.resolve([]);
    let id: string  = sch.id;

    return this.http.get(this.scUrl + "/spaces/" + id + "/tables")
        .toPromise()
        .then(res => Table.fromJsonList(this.extractData(res)))
        .catch(this.handleError);
  }

  getTable(id: string) {
  }

  //
  // Columns
  //

  getColumns(sch: Schema): Promise<Column[]> {
    if(sch == null || sch.id == null || sch.id.length == 0) return Promise.resolve([]);
    let id: string  = sch.id;

    return this.http.get(this.scUrl + "/spaces/" + id + "/columns")
        .toPromise()
        .then(res => Column.fromJsonList(this.extractData(res)))
        .catch(this.handleError);
  }

  getInputColumns(sch: Schema, input_id: string): Promise<Column[]> {
    if(!input_id || input_id.length === 0) return Promise.resolve([]);

    // WORKAROUND: Here we retrieve ALL column and then filter them. 
    // REDO: Retrieve ALL columns of the selected space and then select input or other columns on the client (in controller)
    return this.getColumns(sch)
      .then(cols => cols.filter((col: any) => col.input.id === input_id))
      .catch();
  }

  createColumn(sch: Schema, col: Column): Promise<Column> {
    if(sch == null || sch.id == null) return Promise.resolve({});
    let id: string  = sch.id;

    let body = col.toJson();

    // Header might be needed for authorization etc.
    let headers = new Headers();
    headers.append("Content-Type", 'application/json');
    headers.append("Authorization", 'Bearer ' + localStorage.getItem('id_token'))

    let options = new RequestOptions({headers: headers})

    return this.http.post(this.scUrl + "/spaces/" + id + "/columns", body, options)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
  }

  getColumn(id: string) {
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

  //
  // Data (write, read)
  //

  read(table: Table) {
    return this.http.get(this.scUrl + "/tables/" + table.id + "/data")
        .toPromise()
        .then(res => this.extractData(res))
        .catch(this.handleError);
  }

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
  }

  //
  // Work with Response
  //

  private extractData(res: Response) {
    //let body = JSON.parse(res.text()); // Parse json string
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


  //
  // File upload http://stackoverflow.com/questions/32423348/angular2-post-uploaded-file
  //

  // Service method which knows how to upload to the service
  uploadFile(file:File):Promise<String> {

    return new Promise((resolve, reject) => {

        let formData = new FormData();
        formData.append("file", file, file.name);
        //for(let i = 0; i < files.length; i++) {
        //  formData.append("uploads[]", files[i], files[i].name);
        //}

        let xhr:XMLHttpRequest = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    resolve(<String>JSON.parse(xhr.response));
                } else {
                    reject(xhr.response);
                }
            }
        };

        xhr.open('POST', this.scUrl + "/assets/", true);
        xhr.send(formData);
    });

  }

}
