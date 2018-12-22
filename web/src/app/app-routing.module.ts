import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PageComponent} from './page/page.component';

const appRoutes: Routes = [
  {
    path: '',
    component: PageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, {
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled',
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
