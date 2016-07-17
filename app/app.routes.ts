import { provideRouter, RouterConfig } from '@angular/router';

import { HomeComponent } from './home.component';

export const routes: RouterConfig = [
  {path: '', component: HomeComponent},
  //{path: 'home', component: HomeComponent},
  //{path: 'schema', component: SpaceComponent},
  //{path: 'data', component: DataComponent}
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];
