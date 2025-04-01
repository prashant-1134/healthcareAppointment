import { Injectable } from '@angular/core';
import { UrlConstants } from '../constants/url_constants';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
    private urlConstants: UrlConstants
  ) { }

  // Create new patient
  createPatient(patient: any): Observable<any> {
    return this.http.post(`${this.urlConstants.patient_baseUrl}/Create`, patient);
  }

  // Create new doctor
  createDoctor(doctor: any): Observable<any> {
    return this.http.post(`${this.urlConstants.doctor_baseUrl}/create`, doctor);
  }

  // ✅ Validate user and store user data
  validateUser(userCredential: any): Observable<any> {
    return this.http.post(`${this.urlConstants.auth_baseUrl}/login`, userCredential).pipe(
      tap(response => {
        if (response) {
          localStorage.setItem('user', JSON.stringify(response)); // Store user in localStorage
        }
      })
    );
  }

  // ✅ Get logged-in user from localStorage
  getLoggedInUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;

  }

  // ✅ Logout method to clear user session
  logout(): void {
    localStorage.removeItem('user');
  }
}
