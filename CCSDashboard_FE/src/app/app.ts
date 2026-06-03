import { Component, signal } from '@angular/core';
import { LoginComponent } from './components/login/login';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LoginComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ccsdashboard');
}
