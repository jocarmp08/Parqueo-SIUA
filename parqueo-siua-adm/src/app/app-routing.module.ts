import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainComponent} from './components/main/main.component';
import {NewsComponent} from './components/news/news.component';
import {EventsComponent} from './components/events/events.component';
import {ReportsComponent} from './components/reports/reports.component';
import {NewsResolverService} from './services/news-resolver.service';
import {EventsResolverService} from './services/events-resolver.service';
import {LoginComponent} from './components/login/login.component';
import {AuthGuard} from './auth/auth.guard';
import {UsersComponent} from './components/users/users.component';

const appRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: MainComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'noticias',
    component: NewsComponent,
    canActivate: [AuthGuard],
    resolve: {observable: NewsResolverService}
  },
  {
    path: 'eventos',
    component: EventsComponent,
    canActivate: [AuthGuard],
    resolve: {observable: EventsResolverService}
  },
  {
    path: 'reportes',
    canActivate: [AuthGuard],
    component: ReportsComponent
  },
  {
    path: 'usuarios',
    canActivate: [AuthGuard],
    component: UsersComponent
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
