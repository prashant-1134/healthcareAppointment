import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UrlConstants } from '../constants/url_constants';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  constructor(
    private http: HttpClient,
    private urlConstants: UrlConstants
  ) { }


    // Method to get upcoming appointments for a specific Doctor
    getUpcomingAppointmentsByPatientId(doctorId: string): Observable<any> {
      const url = `${this.urlConstants.appointment_baseUrl}/doctor/upcoming/${doctorId}`;
      return this.http.get<any>(url);
    }



}
