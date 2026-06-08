import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

interface ActivityItem {
  icon: string;
  iconColor: string;
  message: string;
  time: string;
}

interface DeptRow {
  name: string;
  count: number;
  pct: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private http = inject(HttpClient);

  loading = true;

  today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  lastLogin = 'Monday, 09 Jun 2026  08:42 AM';

  summary = {
    totalEmployees:      0,
    totalCertificates:   0,
    activeCertificates:  0,
    expiringIn30Days:    0,
    expiringIn90Days:    0,
    expiredCertificates: 0,
    totalBatches:        0,
  };

  // Computed compliance values
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

  // Mock data — replace with API when available
  recentActivity: ActivityItem[] = [
    {
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      iconColor: 'text-green-600',
      message: 'Batch B2026-03 completed — 3 certificates generated',
      time: 'Today, 10:14 AM',
    },
    {
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      iconColor: 'text-amber-500',
      message: '2 certificates expiring within 15 days flagged for review',
      time: 'Today, 09:30 AM',
    },
    {
      icon: 'M12 4v16m8-8H4',
      iconColor: 'text-blue-600',
      message: 'New induction batch initiated — Signalling dept',
      time: 'Yesterday, 04:15 PM',
    },
    {
      icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4',
      iconColor: 'text-indigo-600',
      message: 'Competency Register exported by Administrator',
      time: 'Yesterday, 02:00 PM',
    },
    {
      icon: 'M5 13l4 4L19 7',
      iconColor: 'text-green-600',
      message: 'Certificate TKSE26003 approved and issued to Deva',
      time: '06 Jun 2026, 11:45 AM',
    },
  ];

  departments: DeptRow[] = [
    { name: 'Track / P-Way',            count: 3, pct: 37 },
    { name: 'Signalling',               count: 2, pct: 25 },
    { name: 'Automatic Fare Collection',count: 1, pct: 13 },
    { name: 'Telecom',                  count: 1, pct: 13 },
    { name: 'Operations',               count: 1, pct: 12 },
  ];

  ngOnInit(): void {
    this.http.get<any>('http://localhost:5266/api/reports/summary').subscribe({
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
      error: () => {
        this.loading = false;
      },
    });
  }
}