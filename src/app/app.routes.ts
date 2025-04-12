import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { HomeLayoutComponent } from './layouts/home-layout/home-layout.component';
import { LoginComponent } from './pages/login/login.component';
import { ForgetPasswordComponent } from './pages/forget-password/forget-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { HomeComponent } from './pages/home/home.component';
import { authGuard } from './core/auth.guard';
import { SignupComponent } from './pages/signup/signup.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { TradersListComponent } from './pages/trader-module/traders-list/traders-list.component';
import { TraderDetailsComponent } from './pages/trader-module/trader-details/trader-details.component';
import { TraderAllProductsComponent } from './pages/trader-module/trader-all-products/trader-all-products.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { FavItemsComponent } from './pages/fav-items/fav-items.component';
import { ShoppingCartComponent } from './pages/shopping-cart/shopping-cart.component';



export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'forget_password', component: ForgetPasswordComponent },
      { path: 'reset_password', component: ResetPasswordComponent },
      { path: 'signup', component: SignupComponent }
    ]
  },
  {
    path: '',
    component: HomeLayoutComponent,
    // canActivate: [authGuard], // Applying authGuard to the home layout
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'aboutus', component: AboutUsComponent },
      { path: 'traders_list', component: TradersListComponent },
      { path: 'trader_details/:id', component: TraderDetailsComponent },
      { path: 'trader_all_details/:id/:type', component: TraderAllProductsComponent },
      { path: 'product_details/:productId', component: ProductDetailsComponent },
      { path: 'product_details/:productId/:traderId', component: ProductDetailsComponent },
      { path: 'wishlist', component: FavItemsComponent ,canActivate: [authGuard] },
      { path: 'cart', component: ShoppingCartComponent , canActivate: [authGuard] },

    ]
  },
  { path: '**', component: NotFoundComponent }
];
