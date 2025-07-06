import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  registerForm!: FormGroup;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.initializeForm();
  }

  initializeForm(): void {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      alert('Please fill all required fields correctly.');
      return;
    }

    const registerData = this.registerForm.value;

    this.authService.register(registerData).subscribe({
      next: (response) => {
        alert('User Register successfully!');
        this.router.navigate(['/auth/login']);
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        alert('Failed to register User. Please try again.');
      },
    });
  }
  
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
