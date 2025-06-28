import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
    private fb: FormBuilder
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

      this.authService.login(credentials).subscribe(
        () => {
          const role = localStorage.getItem('role');
          console.log('role', role);

          if (role === 'admin') {
            this.router.navigate(['/admin/Dashboard']);
          } else {
            this.router.navigate(['/user/user-expenses']);
          }
        },
        (error) => {
          console.error('Login failed:', error);
          alert('Invalid credentials');
        }
      );
    }
  }
}
