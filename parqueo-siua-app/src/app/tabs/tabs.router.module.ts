import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {TabsPage} from './tabs.page';
import {CountersService} from '../services/counters.service';

const routes: Routes = [
    {
        path: 'tabs',
        component: TabsPage,
        children: [
            {
                path: 'main',
                children: [
                    {
                        path: '',
                        loadChildren: '../pages/main/main.module#MainPageModule',
                    }
                ]
            },
            {
                path: 'news',
                children: [
                    {
                        path: '',
                        loadChildren: '../pages/news/news.module#NewsPageModule'
                    }
                ]
            },
            {
                path: 'events',
                children: [
                    {
                        path: '',
                        loadChildren: '../pages/events/events.module#EventsPageModule'
                    }
                ]
            },
            {
                path: 'stats',
                children: [
                    {
                        path: '',
                        loadChildren: '../pages/stats/stats.module#StatsPageModule'
                    }
                ]
            },
            {
                path: '',
                redirectTo: '/tabs/main',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '',
        redirectTo: '/tabs/main',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TabsPageRoutingModule {
}
