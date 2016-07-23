import { provideRouter, RouterConfig } from '@angular/router';

import { HomeComponent } from './home.component';

export const routes: RouterConfig = [
  {path: '', component: HomeComponent},
  {path: 'home', component: HomeComponent},
  //{path: 'documentation', component: DocumentationComponent},
  //{path: 'about', component: AboutComponent}
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];
