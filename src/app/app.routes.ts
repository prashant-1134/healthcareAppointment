import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard'; // Import the AuthGuard

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
        path: 'patient/dashboard/:patientId',
        loadComponent: () => import('./features/patient/dashboard/dashboard.component').then(m => m.DashboardComponent),
        canActivate: [AuthGuard], // ✅ Protect patient dashboard
        data: { role: 'patient' }  // ✅ Only allow patients
    },
    {
        path: 'doctor/dashboard/:doctorId',
        loadComponent: () => import('./features/doctor/dashboard/dashboard.component').then(m => m.DashboardComponent),
        canActivate: [AuthGuard], // ✅ Protect doctor dashboard
        data: { role: 'doctor' }  // ✅ Only allow doctors
    }
];
