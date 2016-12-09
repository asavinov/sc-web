import { Routes, RouterModule } from '@angular/router';

import { MainComponent } from './main.component';
import { HelpComponent } from './help.component';
import { AboutComponent } from './about.component';

export const routes: Routes = [
  {path: '', component: MainComponent},
  {path: 'main', component: MainComponent},
  {path: 'help', component: HelpComponent},
  {path: 'about', component: AboutComponent}

//  { path: '', redirectTo: 'contact', pathMatch: 'full'},
//  { path: 'crisis', loadChildren: 'app/crisis/crisis.module' },
//  { path: 'heroes', loadChildren: 'app/hero/hero.module' }
];

export const appRoutingProviders: any[] = [
];

export const routing = RouterModule.forRoot(routes);

/* NEW
import { Routes, RouterModule } from '@angular/router';

import { MainComponent } from './main.component';

export const routes: Routes = [
  {path: '', component: MainComponent},
  {path: 'dc', component: MainComponent}

//  { path: '', redirectTo: 'contact', pathMatch: 'full'},
//  { path: 'crisis', loadChildren: 'app/crisis/crisis.module' },
//  { path: 'heroes', loadChildren: 'app/hero/hero.module' }
];

export const routing = RouterModule.forRoot(routes);
*/

/* OLD
import { provideRouter, RouterConfig } from '@angular/router';

import { MainComponent } from './main.component';

export const routes: RouterConfig = [
  {path: '', component: MainComponent},
  {path: 'dc', component: MainComponent},
  //{path: 'documentation', component: DocumentationComponent},
  //{path: 'about', component: AboutComponent}
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];

*/