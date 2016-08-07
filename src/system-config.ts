"use strict";

// SystemJS configuration file, see links for more information
// https://github.com/systemjs/systemjs
// https://github.com/systemjs/systemjs/blob/master/docs/config-api.md

/***********************************************************************************************
 * User Configuration.
 **********************************************************************************************/
/** Map relative paths to URLs. */
const map: any = {
  //'app':                        'src', // 'dist',
  //'rxjs':                       'https://npmcdn.com/rxjs@5.0.0-beta.6',

  //'ng2-toastr':                 'https://npmcdn.com/ng2-toastr@0.3.1' // WORKS
  'ng2-toastr': 'vendor/ng2-toastr',
};

/** User packages configuration. */
const packages: any = {
  //'app':                        { main: 'app.ts',  defaultExtension: 'ts' },
  //'rxjs':                       { defaultExtension: 'js' },
  'ng2-toastr':                 { defaultExtension: 'js' }
  //'ng2-toastr':                 { main: 'bundles/ng2-toastr.js', defaultExtension: 'js' }
  //'ng2-toastr': { main: 'dist/vendor/ng2-toastr', defaultExtension: 'js' }
};

////////////////////////////////////////////////////////////////////////////////////////////////
/***********************************************************************************************
 * Everything underneath this line is managed by the CLI.
 **********************************************************************************************/
const barrels: string[] = [
  // Angular specific barrels.
  '@angular/core',
  '@angular/common',
  '@angular/compiler',
  '@angular/platform-browser',
  '@angular/platform-browser-dynamic',
  '@angular/http',
  '@angular/router',

  // Thirdparty barrels.
  'rxjs',

  // App specific barrels.
  'app',
  'app/shared',
  /** @cli-barrel */
];

const cliSystemConfigPackages: any = {};
barrels.forEach((barrelName: string) => {
  cliSystemConfigPackages[barrelName] = { main: 'index' };
});

/** Type declaration for ambient System. */
declare var System: any;

// Apply the CLI SystemJS configuration.
System.config({
  map: {
    '@angular': 'vendor/@angular',
    'rxjs': 'vendor/rxjs',
    'main': 'main.js'
  },
  packages: cliSystemConfigPackages
});

// Apply the user's configuration.
System.config({ map, packages });
