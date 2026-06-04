import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html'
})
export class LoginComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

  username = '';
  password = '';

  login() {
    this.authService
      .login(this.username, this.password)
      .subscribe({
        next: (response) => {

          localStorage.setItem(
            'token',
            response.token
          );
          this.router.navigate(['/dashboard']);

          
        },
        error: (err) => {
          console.error(err);
        }
      });
  }
}