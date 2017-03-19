import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers, Request, RequestMethod } from '@angular/http';

import { Schema } from './schema';
import { Table } from './table';
import { Column } from './column';


// How to implement authentication and session management
// Configure http accordingly: http://blog.ionic.io/angularjs-authentication/
// .config(['$httpProvider', function($httpProvider) {
//  $httpProvider.defaults.withCredentials = true;
// }])
// http://corpus.hubwiz.com/2/angularjs/19383311.html
// res.header('Access-Control-Allow-Credentials', true);

// https://auth0.com/blog/2014/01/07/angularjs-authentication-with-cookies-vs-token/
// Server responds with 'Set-Cookie: session=sid' on the first client login.
// For each next request, the client sets 'Cookie: session=sid' so the server can recognize it.

@Injectable()
export class AppService {

  constructor (private http: Http) {
  }

  //
  // URL to web API
  //
  // Development:
  private serviceHost = 'http://localhost:8000';
  //private serviceHost = 'http://192.168.66.35:8000';

  // Production:
  //private serviceHost = 'http://datacommandr.eastus2.cloudapp.azure.com:8000';
  //private serviceHost = 'http://dc.conceptoriented.com:8000';
  //private serviceHost = 'http://dc.conceptoriented.com:8000';

  private url = this.serviceHost + '/api';

  //
  // Account, uer, session, authentication
  //

  getAccount():Promise<Object> {
    let options = new RequestOptions({withCredentials: true});

    return this.http.get(this.url + '/account', options)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
  }

  //
  // Schemas
  //

  getSchemas(acc: Object): Promise<Schema[] | Object> {
    if(!acc || !acc['id']) return Promise.resolve([]);
    let id: string  = acc['id'];

    let options = new RequestOptions({withCredentials: true});

    return this.http.get(this.url + '/schemas', options)
        .toPromise()
        .then(res => Schema.fromJsonList(this.extractData(res)))
        .catch(this.handleError);
  }

  createSchema(sch: Schema): Promise<Schema> {
    if(!sch)  return Promise.resolve({});

    let body = sch.toJson();

    // Header might be needed for authorization etc.
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + localStorage.getItem('id_token'));

    let options = new RequestOptions({headers: headers, withCredentials: true});

    return this.http.post(this.url + '/schemas', body, options)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
  }

  updateSchema(sch: Schema) {
    if(!sch || !sch.id) return;

    let body = sch.toJson();

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers, withCredentials: true });

    return this.http.put(this.url + '/schemas' + '/' + sch.id, body, options)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
  }

  deleteSchema(sch: Schema) {
    if(!sch || !sch.id) return;

    let headers = new Headers({ 'Content-Type': 'application/json' });

    let options = new RequestOptions({headers: headers, body: '', withCredentials: true});

    return this.http.delete(this.url + '/schemas' + '/' + sch.id, options)
        .toPromise()
        .then()
        .catch(this.handleError);
  }

  //
  // Tables
  //

  getTables(sch: Schema): Promise<Table[] | Object> {
    if(!sch || !sch.id) return Promise.resolve([]);
    let id: string  = sch.id;

    let options = new RequestOptions({withCredentials: true});

    return this.http.get(this.url + '/schemas/' + id + '/tables', options)
        .toPromise()
        .then(res => Table.fromJsonList(this.extractData(res)))
        .catch(this.handleError);
  }

  getTable(id: string) {
  }

  createTable(sch: Schema, tab: Table): Promise<Table> {
    if(!sch || !sch.id || !tab) return Promise.resolve({});
    let id: string  = sch.id;

    let body = tab.toJson();

    // Header might be needed for authorization etc.
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + localStorage.getItem('id_token'));

    let options = new RequestOptions({headers: headers, withCredentials: true});

    return this.http.post(this.url + '/schemas/' + id + '/tables', body, options)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
  }

  updateTable(tab: Table) {
    if(!tab || !tab.id) return;

    let body = tab.toJson();

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers, withCredentials: true });

    return this.http.put(this.url + '/tables' + '/' + tab.id, body, options)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
  }

  deleteTable(tab: Table) {
    if(!tab || !tab.id) return;

    let headers = new Headers({ 'Content-Type': 'application/json' });

    let options = new RequestOptions({headers: headers, body: '', withCredentials: true});

    return this.http.delete(this.url + '/tables' + '/' + tab.id, options)
        .toPromise()
        .then()
        .catch(this.handleError);
  }

  //
  // Columns
  //

  getColumns(sch: Schema): Promise<Column[] | Object> {
    if(!sch || !sch.id) return Promise.resolve([]);
    let id: string  = sch.id;

    let options = new RequestOptions({withCredentials: true});

    return this.http.get(this.url + '/schemas/' + id + '/columns', options)
        .toPromise()
        .then(res => Column.fromJsonList(this.extractData(res)))
        .catch(this.handleError);
  }

  getInputColumns(sch: Schema, tab: Table): Promise<Column[] | Object> {
    if(!sch || !sch.id || !tab || !tab.id ) return Promise.resolve([]);

    // WORKAROUND: Here we retrieve ALL column and then filter them. 
    // REDO: Retrieve ALL columns of the selected schema and then select input or other columns on the client (in controller)
    return this.getColumns(sch).then(
      cols => {
        if(cols instanceof Array) {
          return Promise.resolve( cols.filter(col => col.input.id === tab.id) );
        }
        else {
          return Promise.resolve(cols);
        }
      });
  }

  getColumn(id: string) {
  }

  createColumn(sch: Schema, col: Column): Promise<Column> {
    if(!sch || !sch.id || !col) return Promise.resolve({});
    let id: string  = sch.id;

    let body = col.toJson();

    // Header might be needed for authorization etc.
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + localStorage.getItem('id_token'));

    let options = new RequestOptions({headers: headers, withCredentials: true});

    return this.http.post(this.url + '/schemas/' + id + '/columns', body, options)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
  }

  updateColumn(col: Column) {
    if(!col || !col.id) return;

    let body = col.toJson();

    let headers = new Headers({ 'Content-Type': 'application/json' });

    let options = new RequestOptions({ headers: headers, withCredentials: true });

    return this.http.put(this.url + '/columns' + '/' + col.id, body, options)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
  }

  deleteColumn(col: Column) {
    if(!col || !col.id) return;

    let headers = new Headers({ 'Content-Type': 'application/json' });

    let options = new RequestOptions({ headers: headers, body: '', withCredentials: true });

    return this.http.delete(this.url + '/columns' + '/' + col.id, options)
        .toPromise()
        .then()
        .catch(this.handleError);
  }

  //
  // Data (write, read)
  //

  read(tab: Table) {
    if(!tab || !tab.id) return;

    let options = new RequestOptions({ withCredentials: true });

    return this.http.get(this.url + '/tables/' + tab.id + '/data/json', options)
        .toPromise()
        .then(res => this.extractData(res))
        .catch(this.handleError);
  }

  evaluate(sch: Schema) {
    if(!sch || !sch.id) return;

    let options = new RequestOptions({ withCredentials: true });

    return this.http.get(this.url + '/schemas/' + sch.id + '/evaluate', options)
        .toPromise()
        .then(res => this.extractData(res))
        .catch(this.handleError);
  }

  write(tab: Table, data: string, params: Object) {
    if(!tab || !tab.id) return;

    if(params == null) params = { createColumns: true }; // Params must be always provided even if empty

    let body = JSON.stringify(params) + '\n' + data; // First line is a json object with parameters

    // Header might be needed for authorization etc.
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + localStorage.getItem('id_token'));

    let options = new RequestOptions({headers: headers, withCredentials: true});

    return this.http.post(this.url + '/tables/' + tab.id + '/data/csv', body, options)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
  }

  empty(tab: Table) {
    if(!tab || !tab.id) return;

    let headers = new Headers({ 'Content-Type': 'application/json' });

    let options = new RequestOptions({headers: headers, body: '', withCredentials: true});

    return this.http.delete(this.url + '/tables/' + tab.id + '/data', options)
        .toPromise()
        .then()
        .catch(this.handleError);
  }

  //
  // File upload http://stackoverflow.com/questions/32423348/angular2-post-uploaded-file
  //

  // Service method which knows how to upload to the service
  uploadFile(file:File):Promise<String> {

    return new Promise((resolve, reject) => {

        let formData = new FormData();
        formData.append('file', file, file.name);
        // for(let i = 0; i < files.length; i++) {
        //   formData.append('uploads[]', files[i], files[i].name);
        // }

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

        xhr.open('POST', this.url + '/assets/', true);
        xhr.send(formData);
    });

  }

  //
  // Work with Response
  //

  private extractData(res: Response) {
    if(! (res.text().charAt(0) === '[') && !(res.text().charAt(0) === '{')) { // Not JSON
      return res.text();
    }

    let body:any = null;
    try { // Try to parse json
      // let body = JSON.parse(res.text());
      body = res.json();
    }
    catch(e) {
      let err = new ServiceError(ServiceErrorCode.GENERAL, "Server error", "Wrong server response");
      throw err;
      //return Promise.resolve(err);
      //return err.toJson();
    }

    //
    // First, we process possible errors
    //
    if(body && body.error) {
      // Create and return new error object
      return body.error || { };
    }

    //
    // Second, we process normal data
    //
    else if(body && body.data) {
      return body.data || { };
    }
    else {
      return body || { };
    }
  }

  private handleError (error: any): any {
    // Error can be: JSON, our error object, object with 'message', object with 'code'.

    let body: any = null;
    try { // Try to parse json
      body = error.json();
    }
    catch(e) {
      let msg: string = (error.message) ? error.message : null;
      let err = new ServiceError(ServiceErrorCode.GENERAL, "General error", msg ? msg : "");
      return Promise.resolve(err);
    }

    //
    // First, we process our own domain-specific error information
    //
    if(body && body.error) {
      let err = new ServiceError(body.error.code, body.error.message, body.error.message2);
      return Promise.resolve(err);
    }
    else {
      // Use case no server at all: error.message = undefined, error.status = 0, error.statusText = ''

      let status: number = error.status ? error.status : 0;
      let message: string = error.message ? error.message : (error.statusText ? error.statusText : 'Server error');
      let err = new ServiceError(status, message, '');
      return Promise.reject(err);
    }

  }

}

export class ServiceError {
  constructor(code: ServiceErrorCode, message: string, description: string) {
    this.code = code;
    this.message = message;
    this.description = description;
  }

  code: ServiceErrorCode;
  message: string;
  description: string;

  toJson(): string {
    return JSON.stringify(this);
  }

  static fromJsonObject(json: any): ServiceError {
    let er: ServiceError = new ServiceError(ServiceErrorCode.NONE, '', '');

    if(!json) return er;

    er.code = json.code;
    er.message = json.message;
    er.description = json.description;

    return er;
  }
}

export enum ServiceErrorCode {
    NONE = 0,
    GENERAL = 1,

    NOT_FOUND_IDENTITY = 10,

    GET_ELEMENT = 21,
    CREATE_ELEMENT = 22,
    UPATE_ELEMENT = 23,
    DELETE_ELEMENT = 24,

    PARSE_ERROR = 51,
    BIND_ERROR = 52,
    EVALUATE_ERROR = 53,

    PARSE_PROPAGATION_ERROR = 61,
    BIND_PROPAGATION_ERROR = 62,
    EVALUATE_PROPAGATION_ERROR = 63,

    DEPENDENCY_CYCLE_ERROR = 71,
}
