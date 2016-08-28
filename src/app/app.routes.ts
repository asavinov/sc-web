import { Routes, RouterModule } from '@angular/router';

import { DcComponent } from './dc.component';

export const routes: Routes = [
  {path: '', component: DcComponent},
  {path: 'dc', component: DcComponent}

//  { path: '', redirectTo: 'contact', pathMatch: 'full'},
//  { path: 'crisis', loadChildren: 'app/crisis/crisis.module' },
//  { path: 'heroes', loadChildren: 'app/hero/hero.module' }
];

export const routing = RouterModule.forRoot(routes);

/* NEW
import { Routes, RouterModule } from '@angular/router';

import { DcComponent } from './dc.component';

export const routes: Routes = [
  {path: '', component: DcComponent},
  {path: 'dc', component: DcComponent}

//  { path: '', redirectTo: 'contact', pathMatch: 'full'},
//  { path: 'crisis', loadChildren: 'app/crisis/crisis.module' },
//  { path: 'heroes', loadChildren: 'app/hero/hero.module' }
];

export const routing = RouterModule.forRoot(routes);
*/

/* OLD
import { provideRouter, RouterConfig } from '@angular/router';

import { DcComponent } from './dc.component';

export const routes: RouterConfig = [
  {path: '', component: DcComponent},
  {path: 'dc', component: DcComponent},
  //{path: 'documentation', component: DocumentationComponent},
  //{path: 'about', component: AboutComponent}
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];

*/