import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './features/homepage/homepage.component';
import { AboutUsComponent } from './features/about-us/about-us.component';
import { NgModule } from '@angular/core';
import { HowWorksComponent } from './features/how-works/how-works.component';
import { LoginComponent } from './features/auth/login/login.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';
import { authGuard } from './core/guard/auth.guard';
import { ProfileComponent } from './features/profile/profile.component';
import { OrdersComponent } from './features/orders/orders.component';
import { FavoritesComponent } from './features/favorites/favorites.component';
import { UserReviewsComponent } from './features/user-reviews/user-reviews.component';
import { UserSettingsComponent } from './features/user-settings/user-settings.component';
import { noAuthGuard } from './core/guard/no-auth.guard';
import { RegisterComponent } from './features/auth/register/register.component';

export const routes: Routes = [
    {path: 'home', component: HomepageComponent},
    {path: 'about-us', component: AboutUsComponent},
    {path: 'how-works', component: HowWorksComponent},
    {path: 'login', component: LoginComponent, canActivate: [noAuthGuard]},
    {path: 'register', component: RegisterComponent},
    {path: 'forgot-password', component: ForgotPasswordComponent},
    { path: '', redirectTo: '/home', pathMatch: 'full' },

    { 
  path: 'user', 
  canActivate: [authGuard],
  children: [
    { path: 'profile', component: ProfileComponent},
    { path: 'orders', component: OrdersComponent },
    { path: 'favorites', component: FavoritesComponent },
    { path: 'reviews', component: UserReviewsComponent}, // Cambiado el nombre del componente
    { path: 'settings', component: UserSettingsComponent}, // Cambiado el nombre del componente
    { path: '**', redirectTo: '/user/profile', pathMatch: 'full' }
  ] 
},
    { path: '**', redirectTo: '/home', pathMatch: 'full' }
    
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }