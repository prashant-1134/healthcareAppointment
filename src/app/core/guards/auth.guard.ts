import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private userService: UserService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const user = this.userService.getLoggedInUser(); // ✅ Get user from localStorage

    if (!user) {
      this.router.navigate(['/login']); // ✅ Redirect if not logged in
      return false;
    }

    const expectedRole = route.data['role'];
    if (user.role !== expectedRole) {
      alert('Unauthorized access'); // ✅ Prevent role-based access
      this.router.navigate(['/login']);
      return false;
    }

    return true; // ✅ Allow access if authenticated
  }
}
