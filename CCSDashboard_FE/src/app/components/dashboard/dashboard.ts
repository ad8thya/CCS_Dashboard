import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

interface ActivityItem {
  matIcon: string;
  iconColor: string;
  iconBg: string;
  message: string;
  time: string;
}

interface DeptRow {
  name: string;
  count: number;
  pct: number;
}

interface ActivityApiItem {
  type: string;
  message: string;
  date: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private http = inject(HttpClient);
  private baseUrl = environment.apiBaseUrl;

  loading = true;

  today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  lastLogin = this.formatLastLogin(inject(AuthService).getLastLogin());

private formatLastLogin(raw: string | null): string {
  if (!raw) return 'First login';
  const d = new Date(raw);
  return d.toLocaleDateString('en-GB', {
    weekday: 'long', day: '2-digit', month: 'short', year: 'numeric'
  }) + '  ' + d.toLocaleTimeString('en-GB', {
    hour: '2-digit', minute: '2-digit', hour12: true
  }).toUpperCase();
}

  summary = {
  totalEmployees: 0,
  totalCertificates: 0,
  activeCertificates: 0,
  expiringIn30Days: 0,
  expiringIn90Days: 0,
  expiredCertificates: 0,
  totalBatches: 0,
  expiringIn7Days: 0,
  expiringIn15Days: 0,

  totalDepartments: 0,
  totalDesignations: 0,
  totalContractors: 0,
};

  get compliancePct(): number {
    if (!this.summary.totalCertificates) return 0;
    return Math.round(
      (this.summary.activeCertificates / this.summary.totalCertificates) * 100
    );
  }

  get expiringPct(): number {
    if (!this.summary.totalCertificates) return 0;
    return Math.round(
      (this.summary.expiringIn30Days / this.summary.totalCertificates) * 100
    );
  }

  get expiredPct(): number {
    if (!this.summary.totalCertificates) return 0;
    return Math.round(
      (this.summary.expiredCertificates / this.summary.totalCertificates) * 100
    );
  }

  get complianceLabel(): string {
    if (this.compliancePct >= 90) return 'Compliant';
    if (this.compliancePct >= 70) return 'Needs Attention';
    return 'Critical';
  }

  get complianceColor(): string {
    if (this.compliancePct >= 90) return 'green';
    if (this.compliancePct >= 70) return 'amber';
    return 'red';
  }

  recentActivity: ActivityItem[] = [];
  departments: DeptRow[] = [];

  ngOnInit(): void {
    forkJoin({
      summary:      this.http.get<any>(`${this.baseUrl}/reports/summary`),
      departments:  this.http.get<DeptRow[]>(`${this.baseUrl}/reports/department-distribution`),
      activity:     this.http.get<ActivityApiItem[]>(`${this.baseUrl}/reports/recent-activity`),
      
    }).subscribe({
      next: ({ summary, departments, activity }) => {
  this.summary.totalEmployees      = summary.totalEmployees;
  this.summary.totalCertificates   = summary.totalCertificates;
  this.summary.activeCertificates  = summary.activeCertificates;
  this.summary.expiringIn7Days     = summary.expiringIn7Days;
  this.summary.expiringIn15Days    = summary.expiringIn15Days;
  this.summary.expiringIn30Days    = summary.expiringIn30Days;
  this.summary.expiringIn90Days    = summary.expiringIn90Days;
  this.summary.expiredCertificates = summary.expiredCertificates;
  this.summary.totalBatches        = summary.totalBatches;
  this.summary.totalDepartments    = summary.totalDepartments;   // ← add
  this.summary.totalDesignations   = summary.totalDesignations;  // ← add
  this.summary.totalContractors    = summary.totalContractors;   // ← add

  this.departments = departments;
  this.recentActivity = activity.map(a => this.mapActivity(a));
  this.loading = false;
},
      error: () => {
        this.loading = false;
      },
    });
  }

  private mapActivity(a: ActivityApiItem): ActivityItem {
  const dateLabel = this.formatActivityDate(a.date);
  switch (a.type) {
    case 'batch_completed':
      return { matIcon: 'check_circle', iconColor: '#15803d', iconBg: '#dcfce7', message: a.message, time: dateLabel };
    case 'expiry_alert':
      return { matIcon: 'warning', iconColor: '#b45309', iconBg: '#fef3c7', message: a.message, time: dateLabel };
    case 'certificate_issued':
    default:
      return { matIcon: 'workspace_premium', iconColor: '#1d4ed8', iconBg: '#dbeafe', message: a.message, time: dateLabel };
  }
}

  private formatActivityDate(dateStr: string): string {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }
}