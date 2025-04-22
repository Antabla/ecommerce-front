import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ProductListComponent } from './products/list/product-list.component';
import { ProductCatalogComponent } from './products/catalog/product-catalog.component';
import { MyCartComponent } from './cart/my-cart.component';
import { MyOrdersComponent } from './orders/my-orders/my-orders.component';
import { AuthAdminGuard, AuthGuard } from './core/guard/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
  {
    path: 'products/list',
    component: ProductListComponent,
    canActivate: [AuthAdminGuard],
  },
  {
    path: 'products/catalog',
    component: ProductCatalogComponent,
    canActivate: [AuthGuard],
  },
  { path: 'cart', component: MyCartComponent, canActivate: [AuthGuard] },
  { path: 'orders', component: MyOrdersComponent, canActivate: [AuthGuard] },
];
