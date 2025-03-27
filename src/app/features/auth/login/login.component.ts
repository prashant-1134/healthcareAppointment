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
      // TODO: Call your authentication service to send the login data to your backend.

      this.userService.validateUser(payload).subscribe({
        next: (response) => {
        console.log('User authenticated successfully and the role is :', response.role);
        // Set the user role in your application state
        this.userRole = response.role;
  
        // Optionally, navigate to another page or display a success message
        this.router.navigate(['/patient/dashboard']);
         },
        error: (error) => {
          console.error('Erron Authenticating user:', error.error);
          alert(error.message);
          // Optionally, display an error message to the user
         }
        });

    } else {
      console.log('❌ Invalid Form!');
    }
  }
}

