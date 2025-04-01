import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent {
  loginForm: FormGroup;

  userRole : string  = '';

  patientId : string = '';
  doctorId: string = '';


  patientName : string = '';
  doctorName: string = '';
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('✅ Form Data:', this.loginForm.value);
  
      const payload = this.loginForm.value;
  
      this.userService.validateUser(payload).subscribe({
        next: (response) => {
          this.patientId = response.id;
          this.doctorId = response.id;

          this.patientName = response.first_name;
          this.doctorName = response.id;

          this.userRole = response.role;
  
          console.log(response);
          console.log('User authenticated successfully and the role is:', this.userRole);
  
          // Navigate based on the user role
          if (this.userRole === 'doctor') {
            this.router.navigate(['/doctor/dashboard', this.doctorId]); // Doctor's Dashboard
          } else if (this.userRole === 'patient') {
            this.router.navigate(['/patient/dashboard', this.patientId]); // Patient's Dashboard
          } else {
            console.error('Unknown role:', this.userRole);
            alert('Unauthorized role');
          }
        },
        error: (error) => {
          console.error('Error Authenticating user:', error.error);
          alert(error.message);
        }
      });
  
    } else {
      console.log('❌ Invalid Form!');
    }
  }
  
}

