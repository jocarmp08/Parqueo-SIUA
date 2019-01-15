import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DummyComponent} from './components/dummy/dummy.component';

const appRoutes: Routes = [
  {
    path: '',
    component: DummyComponent
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
