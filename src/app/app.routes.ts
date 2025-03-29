import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PageNotFoundComponent } from './ui/page-not-found/page-not-found.component';
import { ContactComponent } from './ui/contact/contact.component';
import { PrivacyComponent } from './ui/privacy/privacy.component';
import { TermsComponent } from './ui/terms/terms.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: DashboardComponent,
    },
    {
        path: 'contact',
        component: ContactComponent,
    },
    {
        path: 'privacy',
        component: PrivacyComponent,
    },
    {
        path: 'terms',
        component: TermsComponent,
    },
    { 
        path: '**', 
        component: PageNotFoundComponent 
    }
];
