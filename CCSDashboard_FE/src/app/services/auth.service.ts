import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);

  private apiUrl =
    'http://localhost:5266/api/auth/login';

  login(username: string, password: string) {

    return this.http.post<any>(
      this.apiUrl,
      {
        username,
        password
      }
    );
  }
}