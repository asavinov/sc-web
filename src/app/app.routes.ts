import { Routes, RouterModule } from '@angular/router';

import { EditComponent } from './edit.component';
import { SimComponent } from './sim.component';
import { HelpComponent } from './help.component';
import { AboutComponent } from './about.component';

export const routes: Routes = [
  {path: '', component: EditComponent},
  {path: 'main', component: EditComponent},
  {path: 'sim', component: SimComponent},
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

import { EditComponent } from './edit.component';

export const routes: Routes = [
  {path: '', component: EditComponent},
  {path: 'dc', component: EditComponent}

//  { path: '', redirectTo: 'contact', pathMatch: 'full'},
//  { path: 'crisis', loadChildren: 'app/crisis/crisis.module' },
//  { path: 'heroes', loadChildren: 'app/hero/hero.module' }
];

export const routing = RouterModule.forRoot(routes);
*/
