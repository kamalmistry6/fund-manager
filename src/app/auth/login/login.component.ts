import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm!: FormGroup;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private toastService: ToastService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      const credentials = { email, password };

      this.authService.login(credentials).subscribe({
        next: () => {
          const role = localStorage.getItem('role');
          console.log('role', role);

          this.toastService.showToast('Login successful!', 'success');

          if (role === 'admin') {
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.router.navigate(['/user/user-expenses']);
          }
        },
        error: (error) => {
          console.error('Login failed:', error);

          if (error.status === 404) {
            this.toastService.showToast('User not found.', 'error');
          } else if (error.status === 401) {
            this.toastService.showToast('Invalid credentials.', 'error');
          } else {
            this.toastService.showToast(
              'Something went wrong. Please try again.',
              'error'
            );
          }
        },
      });
    } else {
      this.toastService.showToast(
        'Please fill all required fields correctly.',
        'error'
      );
    }
  }
}
