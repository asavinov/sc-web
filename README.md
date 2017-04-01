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

# Workarounds and temporary changes

* @types/loadash (4.14.61) module will cause this error: TS2428: All declarations of 'WeakMap' must have identical type parameters. As a workaround, it is disabled by adding the "skipLibCheck": true into tsconfig.json. 
Remove this line when @types\loadash is fixed.
* <script>window.__theme = 'bs4';</script> is added to index.html to ensure compatibility of ng2-bootstrap with bootstrap 4. Remove it when not needed.

# Change Log

* v0.5.0 (2017-03-19)
  * Getting started tips
  * Import from a CSV file
  * Automatic column creation while importing from CSV
* v0.4.0 (2017-02-12)
  * Column type property introduced (user, calculated, accumulated, link).
  * Formula bar moved from the main screen to the column edit dialog.
  * UI enhancements (button locations, table styling, dialogs etc.)
* v0.3.0 (2017-01-22)
  * Redesign UI (popovers, buttons, confirmation dialogs etc.)
  * Dirty-clean status of columns
  * New sample data
* v0.2.0 (2016-12-10)
  * Complex types and formulas
  * Accumulating columns and formulas
* v0.1.0 (2016-09-05)
  * First working version with simple arithmetic formulas.
