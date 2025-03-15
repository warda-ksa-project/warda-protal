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
    canActivate: [authGuard], // Applying authGuard to the home layout
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'aboutus', component: AboutUsComponent },
    ]
  },
  { path: '**', component: NotFoundComponent }
];
