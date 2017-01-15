# DataCommandr Web Application

# Build

The following steps have to be performed:
* Set the necessary address of REST service in app.service.ts
* Set development or production mode in main.ts
* (Optional) Add Yandex/Google analytics to index.html
* Install all packages by executing npm install
* Build the project by executing npm run build 

# Deploy

* Copy the content of the dist folder to web server, e.g., htdocs of Apache httpd
* Start the web server 
* Start DataCommandr REST server

# Run

* Open browser
* Open a web page at URL served by the web server, e.g., http://dc.conceptoriented.com 

# Change Log

* v0.3.0 (2017-01-xx)
  * Redesign UI (popovers, buttons, confirmation dialogs etc.)
  * Dirty-clean status of columns
  * New sample data
* v0.2.0 (2016-12-10)
  * Complex types and formulas
  * Accumulating columns and formulas
* v0.1.0 (2016-09-05)
  * First working version with simple arithmetic formulas.
