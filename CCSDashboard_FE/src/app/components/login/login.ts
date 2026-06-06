import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, MatSnackBarModule],
  templateUrl: './login.html',
})
export class LoginComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

  username = '';
  password = '';
  loginError = '';
  loading = false;

  login() {
    if (!this.username.trim() || !this.password.trim()) {
      this.loginError = 'Please enter both username and password.';
      return;
    }

    this.loginError = '';
    this.loading = true;

    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        this.authService.storeToken(response.token);
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
  console.log('ERROR HANDLER REACHED');
  console.log('Status:', err.status);
  console.log('Full error:', err);
  this.loading = false;
  if (err.status === 401) {
    this.loginError = 'Incorrect username or password. Please try again.';
  } else if (err.status === 0) {
    this.loginError = 'Cannot reach the server. Please check your connection.';
  } else {
    this.loginError = `Login failed (error ${err.status}). Please try again.`;
  }
},
    });
  }
}