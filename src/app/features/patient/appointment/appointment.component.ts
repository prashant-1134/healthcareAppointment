import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { UrlConstants } from '../../../core/constants/url_constants';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { AppointmentService } from '../../../core/services/appointment.service';
import { TimeFormatPipe } from '../../../shared/pipes/time-format.pipe';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    NgxMatTimepickerModule,
    TimeFormatPipe
  ],
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss']
})
export class AppointmentComponent {

  appointmentForm: any;
  doctors: any;
  availableTimes: any;

  constructor(
    private dialogRef: MatDialogRef<AppointmentComponent>,
    private fb: FormBuilder,
    private http: HttpClient,
    private urlConstants: UrlConstants,
    private appointmentService: AppointmentService,
    private toastr: ToastrService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.appointmentForm = this.fb.group({
      doctorId: [null, Validators.required],
      appointmentDate: [null, Validators.required],
      appointmentTime: [null, Validators.required]
    });

    this.fetchDoctors();
  }

  fetchDoctors(): void {
    this.http.get<any[]>(`${this.urlConstants.doctor_baseUrl}/getAllDoctors`).subscribe(
      (data) => {
        this.doctors = data;
      },
      (error) => {
        console.error('Error fetching doctors:', error);
      }
    );
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  // Book appointment
  bookAppointment(): void {
    if (this.appointmentForm.invalid) return;

    const formData = this.appointmentForm.value;

    // Convert appointmentDate to YYYY-MM-DD
    const formattedDate = this.formatDate(formData.appointmentDate);

    // Convert appointmentTime to 24-hour HH:mm:ss
    const formattedTime = this.convertTo24Hour(formData.appointmentTime);

    const appointment = {
      doctor: { doctorId: formData.doctorId },
      appointmentDate: formattedDate,
      appointmentTime: formattedTime
    };

    this.appointmentService.bookAppointment(appointment).subscribe({
      next: (response) => {
        this.snackBar.open('Appointment booked successfully!', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right'
        });
        this.dialogRef.close(response);
      },
      error: (error) => {
        this.snackBar.open(error.error.message, 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right'
        });
      }
    });
  }

  // Fetch available (unbooked) time slots for a specific doctor on a specific date
  fetchAvailableTimes(): void {
    const doctorId = this.appointmentForm.value.doctorId;
    const appointmentDate = this.formatDate(this.appointmentForm.value.appointmentDate);

    if (doctorId && appointmentDate) {
      this.appointmentService.getUpcomingSchedule(doctorId, appointmentDate).subscribe(
        (data : any) => {
          this.availableTimes = data.map((schedule : any) => {
            const startTime = schedule.startTime;
            return `${startTime.hours}:${startTime.minutes}`; // Format it as HH:mm
          });
        },
        (error : any) => {
          console.error('Error fetching available schedules:', error);
        }
      );
    }
  }

  // Function to format Date to YYYY-MM-DD
  formatDate(date: any): string {
    if (!date || isNaN(new Date(date).getTime())) {
      console.error("Invalid appointmentDate:", date);
      return "";
    }
    return new Date(date).toISOString().split("T")[0]; // Extract YYYY-MM-DD
  }

  // Function to convert 12-hour time to 24-hour format HH:mm:ss
  convertTo24Hour(time: string): string {
    if (!time) {
      console.error("Invalid time input:", time);
      return "00:00:00";
    }

    const match = time.match(/(\d+):(\d+) (\w+)/);
    if (!match) {
      console.error("Invalid time format:", time);
      return "00:00:00";
    }

    let [hour, minute, period] = match.slice(1);
    let hours = parseInt(hour, 10);

    if (period.toLowerCase() === "pm" && hours !== 12) {
      hours += 12;
    }
    if (period.toLowerCase() === "am" && hours === 12) {
      hours = 0;
    }

    return `${hours.toString().padStart(2, "0")}:${minute}:00`; // Format HH:mm:ss
  }

  formatTime(time: string): string {
    const [hours, minutes] = time.split(':');
    return `${hours.padStart(2, '0')}:${minutes}:00`;  // Ensures "HH:mm:ss"
  }
}
