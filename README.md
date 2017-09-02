# Data Commandr Web Application

# Build

The building process is using webpack and is based on the following sample projects: 
https://github.com/preboot/angular-webpack

The following steps have to be performed:
* Set the necessary address of REST service in app.service.ts
* Set development or production mode in main.ts
* (Optional) Add Yandex/Google analytics to index.html
* Install all packages by executing npm install
* Build the project by executing npm run build 

# Deploy

* Copy the content of the dist folder to web server, e.g., htdocs of Apache httpd
* Start the web server 
* Start Data Commandr REST server

# Run

* Open browser
* Open a web page at URL served by the web server, e.g., http://conceptoriented.com 

# Workarounds and temporary changes

* <script>window.__theme = 'bs4';</script> is added to index.html to ensure compatibility of ngx-bootstrap with bootstrap 4. Remove it when not needed.
* Empty file postcss.config.js had to be added to avoid error "No PostCSS Config found".

# Change Log

* v0.7.0 (2017-09-02)
  * Streaming data to the server with automatic evaluation
* v0.6.0 (2017-05-13)
  * Popovers with linked record details
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
