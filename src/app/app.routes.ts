import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './features/homepage/homepage.component';
import { AboutUsComponent } from './features/about-us/about-us.component';
import { NgModule } from '@angular/core';
import { HowWorksComponent } from './features/how-works/how-works.component';
import { LoginComponent } from './features/auth/login/login.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';
import { authGuard } from './core/guard/auth.guard';
import { RegisterComponent } from './features/auth/register/register.component';

export const routes: Routes = [
    {path: 'home', component: HomepageComponent},
    {path: 'about-us', component: AboutUsComponent},
    {path: 'how-works', component: HowWorksComponent},
    {path: 'login', component: LoginComponent, canActivate: [authGuard]},
    {path: 'forgot-password', component: ForgotPasswordComponent},
    {path: 'register', component: RegisterComponent},
    { path: '**', redirectTo: '/home', pathMatch: 'full' }
    
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }