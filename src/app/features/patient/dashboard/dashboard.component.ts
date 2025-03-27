import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';

interface Appointment {
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  location: string;
}

interface MedicalHistory {
  visitDate: string;
  doctor: string;
  diagnosis: string;
  prescription: string;
  report?: string;
}

interface Notification {
  type: string;
  message: string;
  date: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DatePipe, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  userName: string = "John Doe"; // Placeholder user name

  upcomingAppointments = [
    { doctor: "Dr. Amit Patel", specialty: "Cardiologist", date: "March 28, 2025", time: "10:00 AM", location: "MedCare Clinic, Mumbai" },
    { doctor: "Dr. Nisha Rao", specialty: "Neurologist", date: "April 3, 2025", time: "2:00 PM", location: "MedCare Clinic, Delhi" },
      { doctor: "Dr. Amit Patel", specialty: "Cardiologist", date: "March 28, 2025", time: "10:00 AM", location: "MedCare Clinic, Mumbai" },
      { doctor: "Dr. Nisha Rao", specialty: "Neurologist", date: "April 3, 2025", time: "2:00 PM", location: "MedCare Clinic, Delhi" },
        { doctor: "Dr. Amit Patel", specialty: "Cardiologist", date: "March 28, 2025", time: "10:00 AM", location: "MedCare Clinic, Mumbai" },
        { doctor: "Dr. Nisha Rao", specialty: "Neurologist", date: "April 3, 2025", time: "2:00 PM", location: "MedCare Clinic, Delhi" }
     
   
  ];

  medicalHistory = [
    { visitDate: "March 5, 2025", doctor: "Dr. Sneha Iyer", specialty: "Dermatologist", diagnosis: "Skin Allergy", prescription: "Anti-Allergy Tablets", reportUrl: "#" },
    { visitDate: "Feb 15, 2025", doctor: "Dr. Karan Mehta", specialty: "Orthopedic", diagnosis: "Knee Pain", prescription: "Painkillers & Physiotherapy", reportUrl: "#" }
  ];

  notifications = [
    { message: "Appointment confirmed with Dr. Vikram Reddy on March 29 at 11:30 AM", type: "new" },
    { message: "Take medication before breakfast (March 27, 8:00 AM)", type: "reminder" },
    { message: "Appointment confirmed with Dr. Vikram Reddy on March 29 at 11:30 AM", type: "new" },
    { message: "Take medication before breakfast (March 27, 8:00 AM)", type: "reminder" },
    { message: "Appointment confirmed with Dr. Vikram Reddy on March 29 at 11:30 AM", type: "new" },
    { message: "Take medication before breakfast (March 27, 8:00 AM)", type: "reminder" },
    { message: "Appointment confirmed with Dr. Vikram Reddy on March 29 at 11:30 AM", type: "new" },
    { message: "Take medication before breakfast (March 27, 8:00 AM)", type: "reminder" }
  ];

  rescheduleAppointment(index: number) {
    alert(`Rescheduling appointment: ${this.upcomingAppointments[index].doctor}`);
  }

  cancelAppointment(index: number) {
    alert(`Cancelling appointment: ${this.upcomingAppointments[index].doctor}`);
  }
}