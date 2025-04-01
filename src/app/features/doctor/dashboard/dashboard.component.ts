import { Component, OnInit } from '@angular/core';
import { DoctorService } from  '../../../core/services/doctor.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-doctor-appointments',
   templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  standalone:true,
  imports:[CommonModule]
})
export class DashboardComponent implements OnInit {
  doctorId: string = '5'; // Replace with dynamic ID if needed
  upcomingAppointments: any[] = [];

  constructor(private doctorService: DoctorService) {}

  ngOnInit(): void {
    this.getUpcomingAppointments();
  }

  getUpcomingAppointments(): void {
    this.doctorService.getUpcomingAppointmentsByPatientId(this.doctorId).subscribe(
      (data) => {
        this.upcomingAppointments = data;
      },
      (error) => {
        console.error('Error fetching upcoming appointments:', error);
      }
    );
  }
}

