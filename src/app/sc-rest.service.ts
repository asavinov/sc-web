import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers, Request, RequestMethod } from '@angular/http';

import { Schema } from './schema';
import { Table } from './table';
import { Column } from './column';


// Links to how implement in-memory service:
// - https://github.com/wardbell/a2-in-memory-web-api
// - https://github.com/johnpapa/event-view
// package 'angular2-in-memory-web-api' has these: InMemoryBackendConfig, InMemoryBackendService, SEED_DATA

// How to implement authentication and session management
// Configure http accordingly: http://blog.ionic.io/angularjs-authentication/
//.config(['$httpProvider', function($httpProvider) {
//  $httpProvider.defaults.withCredentials = true;
//}])
// http://corpus.hubwiz.com/2/angularjs/19383311.html
// res.header("Access-Control-Allow-Credentials", true);

// https://auth0.com/blog/2014/01/07/angularjs-authentication-with-cookies-vs-token/
// Server responds with "Set-Cookie: session=sid" on the first client login.
// For each next request, the client sets "Cookie: session=sid" so the server can recognize it.

// Server responds to login with "token: ‘...JWT…’ "
// Next client request contain: "Authorization: Bearer ...JWT..." (Jason Web Token)
// - HTTP header transmits the user information (in contrast to cookies)
// - Server does not have to maintain session store

// https://spring.io/blog/2015/01/12/the-login-page-angular-js-and-spring-security-part-ii

@Injectable()
export class ScRestService {

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
  private scSchemaUrl = 'app/schemas';
  private scTableUrl = 'app/tables';
  private scColumnUrl = 'app/columns';

  login():Promise<String> {
    let options = new RequestOptions({withCredentials: true})

    return this.http.get(this.scUrl + "/login", options)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
  }

  //
  // Schemas
  //

  getSchemas(): Promise<Schema[] | Object> {

    let options = new RequestOptions({withCredentials: true})

    return this.http.get(this.scUrl + "/schemas", options)
        .toPromise()
        .then(res => Schema.fromJsonList(this.extractData(res)))
        .catch(this.handleError);
  }

  //
  // Tables
  //

  getTables(sch: Schema): Promise<Table[] | Object> {
    if(sch == null || sch.id == null|| sch.id.length == 0) return Promise.resolve([]);
    let id: string  = sch.id;

    let options = new RequestOptions({withCredentials: true})

    return this.http.get(this.scUrl + "/schemas/" + id + "/tables", options)
        .toPromise()
        .then(res => Table.fromJsonList(this.extractData(res)))
        .catch(this.handleError);
  }

  getTable(id: string) {
  }

  createTable(sch: Schema, tab: Table): Promise<Table> {
    if(sch == null || sch.id == null) return Promise.resolve({});
    let id: string  = sch.id;

    let body = tab.toJson();

    // Header might be needed for authorization etc.
    let headers = new Headers();
    headers.append("Content-Type", 'application/json');
    headers.append("Authorization", 'Bearer ' + localStorage.getItem('id_token'))

    let options = new RequestOptions({headers: headers, withCredentials: true})

    return this.http.post(this.scUrl + "/schemas/" + id + "/tables", body, options)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
  }

  updateTable(tab: Table) {

    let body = tab.toJson();

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers, withCredentials: true });

    return this.http.put(this.scUrl + "/tables" + "/" + tab.id, body, options)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
  }

  deleteTable(tab: Table) {

    let headers = new Headers({ 'Content-Type': 'application/json' });

    let options = new RequestOptions({headers: headers, withCredentials: true})

    return this.http.delete(this.scUrl + "/tables" + "/" + tab.id, options)
        .toPromise()
        .then()
        .catch(this.handleError);
  }

  //
  // Columns
  //

  getColumns(sch: Schema): Promise<Column[] | Object> {
    if(sch == null || sch.id == null || sch.id.length == 0) return Promise.resolve([]);
    let id: string  = sch.id;

    let options = new RequestOptions({withCredentials: true})

    return this.http.get(this.scUrl + "/schemas/" + id + "/columns", options)
        .toPromise()
        .then(res => Column.fromJsonList(this.extractData(res)))
        .catch(this.handleError);
  }

  getInputColumns(sch: Schema, input_id: string): Promise<Column[] | Object> {
    if(!input_id || input_id.length === 0) return Promise.resolve([]);

    // WORKAROUND: Here we retrieve ALL column and then filter them. 
    // REDO: Retrieve ALL columns of the selected schema and then select input or other columns on the client (in controller)
    return this.getColumns(sch).then(
      cols => {
        if(cols instanceof Array) {
          return Promise.resolve( cols.filter(col => col.input.id === input_id) );
        }
        else {
          return Promise.resolve(cols);
        }
      });
  }

  getColumn(id: string) {
  }

  createColumn(sch: Schema, col: Column): Promise<Column> {
    if(sch == null || sch.id == null) return Promise.resolve({});
    let id: string  = sch.id;

    let body = col.toJson();

    // Header might be needed for authorization etc.
    let headers = new Headers();
    headers.append("Content-Type", 'application/json');
    headers.append("Authorization", 'Bearer ' + localStorage.getItem('id_token'))

    let options = new RequestOptions({headers: headers, withCredentials: true})

    return this.http.post(this.scUrl + "/schemas/" + id + "/columns", body, options)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
  }

  updateColumn(col: Column) {

    let body = col.toJson();

    let headers = new Headers({ 'Content-Type': 'application/json' });

    let options = new RequestOptions({ headers: headers, withCredentials: true });

    return this.http.put(this.scUrl + "/columns" + "/" + col.id, body, options)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
  }

  deleteColumn(col: Column) {

    let headers = new Headers({ 'Content-Type': 'application/json' });

    let options = new RequestOptions({ headers: headers, withCredentials: true });

    return this.http.delete(this.scUrl + "/columns" + "/" + col.id, options)
        .toPromise()
        .then()
        .catch(this.handleError);
  }

  //
  // Data (write, read)
  //

  read(table: Table) {

    let options = new RequestOptions({ withCredentials: true });

    return this.http.get(this.scUrl + "/tables/" + table.id + "/data", options)
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

    let options = new RequestOptions({headers: headers, withCredentials: true})

    return this.http.post(this.scUrl + "/tables/" + table.id + "/data", body, options)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
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
        xhr.withCredentials = true;
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

  //
  // Work with Response
  //

  private extractData(res: Response) {
    //let body = JSON.parse(res.text()); // Parse json string
    let body = res.json(); // Parse json string

    //
    // First, we process possible errors
    //
    if(body && body.error) {
      return body.error || { }
    }

    //
    // Second, we process normal data
    //
    else if(body && body.data) {
      return body.data || { }
    }
    else {
      return body || { }
    }
  }

  private handleError (error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let body = error.json(); // Parse json string

    //
    // First, we process our own domain-specific error information
    //
    if(body && body.error) {
      return body.error || { }
    }
    else {
      let errMsg = (error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error';
      console.error(errMsg); // log to console instead
      return Promise.reject(errMsg);
    }

  }

}
