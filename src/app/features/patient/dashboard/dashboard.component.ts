import { Component, Inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { AppointmentService } from '../../../core/services/appointment.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AppointmentComponent } from '../appointment/appointment.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ CommonModule, DatePipe, MatDialogModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  userName: string = "John Doe"; // Placeholder user name

  // store upcoming appointments
  upcomingAppointments : any ;

  // store past appointments
  pastAppointments : any ;

  // store reminders
  reminders : any ;

  // store the patient ID
  patientId : any = '';

  // show dialog information
  dialogRef : any;

  // for initization of services and component
  constructor(
    private appointmentService: AppointmentService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ){

  }
  
  ngOnInit(): void {

    // get the patient ID from the route params
    this.patientId = this.route.snapshot.paramMap.get('patientId');

    this.getUpcomingAppointments();
    this.getPastAppointments();
    this.getReminders();
      
  }

 // method to fetch upcoming appointments 
  getUpcomingAppointments(){
    this.appointmentService.getUpcomingAppointmentsByPatientId(this.patientId)
    .subscribe({
      next: (data) => {
        this.upcomingAppointments = data;
        console.log('Upcoming Appointments:', this.upcomingAppointments);
      },
      error: (error) => {
        console.error('Error fetching appointments:', error);
      }
    });
  }

  //method to fetch past appointments
  getPastAppointments(){
    this.appointmentService.getPastAppointmentsByPatientId(this.patientId)
      .subscribe({
        next: (data) => {
          this.pastAppointments = data;
          console.log('Past Appointments:', this.pastAppointments);
        },
        error: (error) => {
          console.error('Error fetching appointments:', error);
        }
      });
  }

  // method to fetch reminders
  getReminders(){
    this.appointmentService.getRemindersByPatientId(this.patientId).subscribe({
      next: (data) => {
        this.reminders = data;
        console.log('Reminders:', this.reminders);
      },
      error: (err) => {
        console.error('Error fetching reminders:', err);
      }
    });
  }
  //open dialog to book new appointment
  openAppointmentDialog() {
    this.dialog.open(AppointmentComponent, {
      width: '400px',  
      height: '460px',  
      position: {
        top: '100px',   // Distance from the top
      },
      data: {},   // Pass any data you want to send to the dialog component
      disableClose: false  // Allow closing by clicking outside
    });
  }

  /* method for rescheduling the appointment 
  * @param appointmentId  - the id of the appointment
  */
  rescheduleAppointment(index: number) {
    alert(`Rescheduling appointment: ${this.upcomingAppointments[index].doctor}`);
  }

  /* method for cancel the appointment 
  * @param appointmentId  - the id of the appointment
  */
  cancelAppointment(index: number) {
    alert(`Cancelling appointment: ${this.upcomingAppointments[index].doctor}`);
  }
}