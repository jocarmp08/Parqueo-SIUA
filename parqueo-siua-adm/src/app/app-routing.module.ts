import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainComponent} from './main/main.component';
import {NewsComponent} from './news/news.component';
import {EventsComponent} from './events/events.component';
import {ReportsComponent} from './reports/reports.component';
import {NewsResolverService} from './news/rest/news-resolver.service';
import {EventsResolverService} from './events/rest/events-resolver.service';
import {LoginComponent} from './login/login.component';
import {SignUpComponent} from './sign-up/sign-up.component';

const appRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignUpComponent
  },
  {
    path: '',
    component: MainComponent
  },
  {
    path: 'noticias',
    component: NewsComponent,
    resolve: {observable: NewsResolverService}
  },
  {
    path: 'eventos',
    component: EventsComponent,
    resolve: {observable: EventsResolverService}
  },
  {
    path: 'reportes',
    component: ReportsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, {
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled',
  })],
  exports: [RouterModule],
  providers: [NewsResolverService]
})
export class AppRoutingModule {
}
