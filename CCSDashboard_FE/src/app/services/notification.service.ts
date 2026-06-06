import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private snackBar = inject(MatSnackBar);

  success(message: string): void {
    this.snackBar.open(message, 'Dismiss', {
      duration: 3500,
      panelClass: ['snack-success'],
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  error(message: string): void {
    this.snackBar.open(message, 'Dismiss', {
      duration: 6000,
      panelClass: ['snack-error'],
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  info(message: string): void {
    this.snackBar.open(message, 'Dismiss', {
      duration: 4000,
      panelClass: ['snack-info'],
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }
}