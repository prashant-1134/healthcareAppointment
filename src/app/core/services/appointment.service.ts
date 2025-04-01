import { Injectable } from '@angular/core';
import { UrlConstants } from '../constants/url_constants';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  constructor(
    private http : HttpClient,
    private urlConstants : UrlConstants
  ) { }

  // Mthod to book a new appointment
  bookAppointment(appointment: any): Observable<any> {
    return this.http.post<any>(`${this.urlConstants.appointment_baseUrl}/create`,appointment);
  }

  // Method to get upcoming appointments for a specific patient
  getUpcomingAppointmentsByPatientId(patientId: string): Observable<any> {
    const url = `${this.urlConstants.appointment_baseUrl}/patient/upcoming/${patientId}`;
    return this.http.get<any>(url);
  }

  // Method to get upcoming appointments for a specific patient
  getPastAppointmentsByPatientId(patientId: string): Observable<any> {
    const url = `${this.urlConstants.appointment_baseUrl}/patient/past/${patientId}`;
    return this.http.get<any>(url);
  }

  // Method to get reminders by patient ID
  getRemindersByPatientId(patientId: string): Observable<any> {
    const url = `${this.urlConstants.reminder_baseUrl}/patient/${patientId}`;
    return this.http.get<any>(url);
  }

  // Method to get reminders by patient ID
  getUpcomingSchedule(doctorId: string, Date : string): Observable<any> {
    const url = `${this.urlConstants.schedule_baseUrl}/doctor/${doctorId}/unbooked/${Date}`;
    return this.http.get<any>(url);
  }
}
