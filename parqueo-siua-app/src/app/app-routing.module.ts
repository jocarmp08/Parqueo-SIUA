import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

const routes: Routes = [
    {path: '', loadChildren: './tabs/tabs.module#TabsPageModule'},
    {path: 'contact', loadChildren: './pages/contact/contact.module#ContactPageModule'},
  { path: 'about', loadChildren: './pages/about/about.module#AboutPageModule' },
  { path: 'chart/:data', loadChildren: './pages/chart/chart.module#ChartPageModule' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
