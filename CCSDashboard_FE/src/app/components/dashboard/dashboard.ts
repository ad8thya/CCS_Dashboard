import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  private http = inject(HttpClient);
  loading = true;

  summary = {
    totalEmployees:     0,
    totalCertificates:  0,
    activeCertificates: 0,
    expiringIn30Days:   0,
    expiringIn90Days:   0,
    expiredCertificates:0,
    totalBatches:       0,
  };

  ngOnInit(): void {
    this.http.get<any>('http://localhost:5266/api/reports/summary')
      .subscribe({
        next: (data) => {
  this.summary.totalEmployees      = data.totalEmployees;
  this.summary.totalCertificates   = data.totalCertificates;
  this.summary.activeCertificates  = data.activeCertificates;
  this.summary.expiringIn30Days    = data.expiringIn30Days;
  this.summary.expiringIn90Days    = data.expiringIn90Days;
  this.summary.expiredCertificates = data.expiredCertificates;
  this.summary.totalBatches        = data.totalBatches;
  this.loading = false;
},
error: (err) => {
  console.error('SUMMARY ERROR:', err.status, err.message);
  this.loading = false;
}
      });
      
  }
  
}