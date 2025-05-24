import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './features/homepage/homepage.component';
import { AboutUsComponent } from './features/about-us/about-us.component';
import { NgModule } from '@angular/core';
import { HowWorksComponent } from './features/how-works/how-works.component';
import { LoginComponent } from './features/auth/login/login.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';
import { authGuard } from './core/guard/auth.guard';
import { noAuthGuard } from './core/guard/no-auth.guard';
import { RegisterComponent } from './features/auth/register/register.component';
import { ProductsComponent } from './features/products/products.component';
import { ProfileComponent } from './features/user/profile/profile.component';
import { OrdersComponent } from './features/user/orders/orders.component';

import { UserReviewsComponent } from './features/user/user-reviews/user-reviews.component';
import { UserSettingsComponent } from './features/user/user-settings/user-settings.component';
import { ProductDetailComponent } from './features/products/product-detail/product-detail.component';
import { FavoritesComponent } from './features/favorites/favorites.component';
import { AdminGuard } from './core/guard/admin.guard';
import { ManagmentComponent } from './features/admin/managment/managment.component';
import { DashboardComponent } from './features/admin/dashboard/dashboard.component';
import { TableProductsComponent } from './features/admin/table-products/table-products.component';
import { TableOrdersComponent } from './features/admin/table-orders/table-orders.component';
import { TableUsersComponent } from './features/admin/table-users/table-users.component';
import { UserDetailsComponent } from './features/admin/table-users/user-details/user-details.component';
import { BagComponent } from './features/user/bag/bag.component';
import { CheckoutComponent } from './features/checkout/checkout.component';

export const routes: Routes = [
    {path: 'home', component: HomepageComponent},
    {path: 'about-us', component: AboutUsComponent},
    {path: 'how-works', component: HowWorksComponent},
    {path: 'login', component: LoginComponent, canActivate: [noAuthGuard]},
    {path: 'register', component: RegisterComponent, },
    {path: 'forgot-password', component: ForgotPasswordComponent},
    {path: '', redirectTo: '/home', pathMatch: 'full' },
    {path: 'products', component: ProductsComponent}, 
    {path: 'products/:gender', component: ProductsComponent},
    {path: 'products/:gender/:category', component: ProductsComponent},
    {path: 'products/:gender/:category/:subcategory', component: ProductsComponent},
    {path: 'product/:gender/:category/:subcategory/:name', component: ProductDetailComponent},
    {path: 'favorites', component: FavoritesComponent },
    {path: 'checkout', component: CheckoutComponent},
    {
  path: 'admin',
  component: ManagmentComponent,
  canActivate: [AdminGuard],
  children: [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent, data: { breadcrumb: 'Dashboard' } },
    { path: 'products', component: TableProductsComponent, data: { breadcrumb: 'Products' } },
    { path: 'orders', component: TableOrdersComponent, data: { breadcrumb: 'Orders' } },
    { path: 'customers', component: TableUsersComponent, data: { breadcrumb: 'Customers' } },
    {
      path: 'customers/:id',
      component: UserDetailsComponent,
      data: { breadcrumb: 'Customers Details' } 
    }
  ]
}
,

  
    {path: 'user', 
      canActivate: [authGuard],
      children: [
        { path: 'profile', component: ProfileComponent},
        { path: 'orders', component: OrdersComponent },
        { path: 'bag', component: BagComponent },
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