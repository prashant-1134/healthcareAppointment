import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { UrlConstants } from '../../../core/constants/url_constants';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { AppointmentService } from '../../../core/services/appointment.service';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';

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
  ],
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss']
})
export class AppointmentComponent {
  appointmentForm!: FormGroup;
  doctors: any[] = [];
  availableTimes: string[] = [];
  today: Date = new Date(); // Sets today's date as the minimum date

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

    // Fetch doctors list on load
    this.fetchDoctors();

    // Automatically fetch available times when doctor or date changes
    this.appointmentForm.get('doctorId')?.valueChanges.subscribe(() => {
      this.fetchAvailableTimes();
    });

    this.appointmentForm.get('appointmentDate')?.valueChanges.subscribe(() => {
      this.fetchAvailableTimes();
    });
  }

  // Fetch list of doctors
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

  // Fetch available (unbooked) time slots for a doctor on a specific date
  fetchAvailableTimes(): void {
    const doctorId = this.appointmentForm.value.doctorId;
    const rawDate = this.appointmentForm.value.appointmentDate;
    const appointmentDate = rawDate ? this.formatDate(rawDate) : null;

    if (doctorId && appointmentDate) {
      this.appointmentService.getUpcomingSchedule(doctorId, appointmentDate).subscribe(
        (data: any) => {
          console.log("✅ API Response:", data);

          this.availableTimes = data
            .filter((schedule: any) => schedule?.startTime)  // ✅ Ignore invalid entries
            .map((schedule: any) => this.formatTime(schedule.startTime));

          console.log("⏳ Available Time Slots:", this.availableTimes);
        },
        (error: any) => {
          console.error("❌ Error fetching available schedules:", error);
          this.availableTimes = [];
        }
      );
    } else {
      console.warn("⚠️ Doctor or Date not selected yet");
      this.availableTimes = [];
    }
  }

  // Book appointment
  bookAppointment(): void {
    if (this.appointmentForm.invalid) {
      console.log('❌ Appointment form is invalid:', this.appointmentForm.errors);
      return;
    }

    const formData = this.appointmentForm.value;
    console.log('📋 Form Data:', formData);

    if (!formData.appointmentTime) {
      console.error('❌ Appointment time is missing!');
      return;
    }

    const formattedDate = this.formatDate(formData.appointmentDate);
    const formattedTime = this.convertTo24Hour(formData.appointmentTime);

    console.log('📅 Formatted Date:', formattedDate);
    console.log('⏳ Formatted Time:', formattedTime);

    const appointment = {
      doctor: { doctorId: formData.doctorId },
      patient: { patientId: this.getCurrentPatientId() },
      appointmentDate: formattedDate,
      appointmentTime: formattedTime
    };

    console.log('🔵 Appointment Object:', appointment);

    this.appointmentService.bookAppointment(appointment).subscribe({
      next: (response) => {
        console.log('✅ Appointment booked successfully:', response);

        this.snackBar.open('✅ Appointment booked successfully!', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right'
        });
     
        this.dialogRef.close(response);
      },
      error: (error) => {
        console.error('❌ Error booking appointment:', error);
        this.snackBar.open(error.error.message || "Something went wrong!", 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right'
        });
      }
    });
  }

  // Function to format Date to YYYY-MM-DD
  formatDate(date: any): string {
    if (!date || isNaN(new Date(date).getTime())) {
      console.error("❌ Invalid appointmentDate:", date);
      return "";
    }

    const localDate = new Date(date);

    const year = localDate.getFullYear();
    const month = (localDate.getMonth() + 1).toString().padStart(2, "0");
    const day = localDate.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  // Function to format Time as HH:mm
  formatTime(startTime: string): string {
    if (!startTime || typeof startTime !== "string") {
      console.warn("⚠️ Invalid startTime received:", startTime);
      return "Invalid Time";
    }

    const [hours, minutes] = startTime.split(":");
    return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  getCurrentPatientId(): number {
    return 1; // Replace with actual logic to get logged-in patient ID
  }

  convertTo24Hour(time: string): string {
    if (!time) {
      console.error('❌ Time value is missing:', time);
      return ''; // Handle the error case
    }
  
    // Check if the time format includes AM or PM
    if (time.includes('AM') || time.includes('PM')) {
      let [hours, minutes] = time.split(':');
      let period = time.slice(-2).toUpperCase();  // Extract AM or PM
  
      // Convert hours to a number for comparison
      let hoursNum = parseInt(hours, 10);  // Convert hours to a number
  
      // If the period is PM and the hour is less than 12, add 12 to convert to 24-hour format
      if (period === 'PM' && hoursNum < 12) {
        hoursNum += 12;
      } 
      // If the period is AM and the hour is 12 (midnight), set it to 0
      else if (period === 'AM' && hoursNum === 12) {
        hoursNum = 0;
      }
  
      // Ensure the returned time is in HH:mm format (24-hour)
      // Convert hoursNum back to a string and ensure two digits for hours and minutes
      return `${hoursNum.toString().padStart(2, '0')}:${minutes}`;
    } else {
      // If time does not have AM/PM, assume it's already in 24-hour format
      return time;  // No conversion needed
    }
  }
  
}
