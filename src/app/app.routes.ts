import { Routes } from '@angular/router';
import { HomepageComponent } from './features/homepage/homepage.component';

export const routes: Routes = [
    {path: 'home', component: HomepageComponent},
    {path: '', component: HomepageComponent}
];
