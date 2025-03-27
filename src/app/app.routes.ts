import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
    },
    {
        path: 'signup',
        loadComponent: () => import('./features/auth/signup/signup.component').then(m => m.SignupComponent),
    },
    {
        path: 'patient/dashboard',
        loadComponent: () => import('./features/patient/dashboard/dashboard.component').then(m => m.DashboardComponent),
    }
];
