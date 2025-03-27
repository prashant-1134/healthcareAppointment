import { Injectable } from '@angular/core';
import { UrlConstants } from '../constants/url_constants';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http : HttpClient,
    private urlConstants : UrlConstants
  ) { }

  // This method sends a POST request to create a new patient
  createPatient(patient: any): Observable<any> {
    return this.http.post(`${this.urlConstants.patient_baseUrl}/Create`, patient);
  }

   // This method sends a POST request to create a new Doctor
   createDoctor(doctor : any): Observable<any> {
    return this.http.post(`${this.urlConstants.doctor_baseUrl}/create`, doctor);
  }


  // This method sends a POST request to validate user
  validateUser(userCredentail : any): Observable<any> {
    return this.http.post(`${this.urlConstants.auth_baseUrl}/login`, userCredentail);
  }

}
