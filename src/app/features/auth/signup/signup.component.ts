import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  signupForm: FormGroup;
  userType: string = 'patient';

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.signupForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      userType: ['patient', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]],
      dateOfBirth: [''],
      gender: [''],
      medicalHistory: [''],
      specialty: ['']
    });
  }

  onUserTypeChange(type: string) {
    this.userType = type;
    this.signupForm.get('userType')?.setValue(type);

    if (type === 'patient') {
      this.signupForm.get('specialty')?.setValue('');
    } else {
      this.signupForm.get('dateOfBirth')?.setValue('');
      this.signupForm.get('gender')?.setValue('');
      this.signupForm.get('medicalHistory')?.setValue('');
    }
  }

  onSubmit() {
    if (this.signupForm.valid) {
      console.log('✅ Form Data:', this.signupForm.value);
      const payload = this.signupForm.value;


      // Send the form data to your backend API here

      // send new patient data
      if(this.userType === 'patient') {
          
          this.userService.createPatient(payload).subscribe({
          next: (response) => {
          console.log('Patient created successfully:', response);
          // Optionally, navigate to another page or display a success message
           },
          error: (error) => {
            console.error('Error creating patient:', error);
            // Optionally, display an error message to the user
           }
          });
      }

      // send new doctor data
      if(this.userType === 'doctor') {
          
        this.userService.createDoctor(payload).subscribe({
        next: (response) => {
        console.log('Doctor created successfully:', response);
        // Optionally, navigate to another page or display a success message
         },
        error: (error) => {
          console.error('Error creating patient:', error);
          // Optionally, display an error message to the user
         }
        });
    }

      
    } else {
      console.log('❌ Invalid Form!');
    }
  }
}
