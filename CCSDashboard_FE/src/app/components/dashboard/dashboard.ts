import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface KpiCard {
  label: string;
  value: number;
  note: string;
}

interface ActivityItem {
  date: string;
  description: string;
  reference: string;
}

interface QuickLink {
  label: string;
  route: string;
  description: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  readonly kpiCards: KpiCard[] = [
    { label: 'Total Employees', value: 245, note: 'Registered in CCS' },
    { label: 'Active Certificates', value: 198, note: 'Currently valid' },
    { label: 'Expiring Soon', value: 17, note: 'Within 90 days' },
    { label: 'Training Batches', value: 12, note: 'Open or in progress' },
  ];

  readonly recentActivity: ActivityItem[] = [
    {
      date: '03-Jun-2026',
      description: 'Certificate AFJE25001 renewed',
      reference: 'Staff ID 0225',
    },
    {
      date: '02-Jun-2026',
      description: 'Batch TRN-2026-04 marked complete',
      reference: '18 trainees',
    },
    {
      date: '01-Jun-2026',
      description: 'Competency register exported',
      reference: 'Operations Dept.',
    },
    {
      date: '31-May-2026',
      description: 'Medical fitness validity updated',
      reference: 'Staff ID 0198',
    },
    {
      date: '30-May-2026',
      description: 'New certificate issued',
      reference: 'AFMG25002',
    },
  ];

  readonly quickLinks: QuickLink[] = [
    {
      label: 'Competency Register',
      route: '/reports/competency-register',
      description: 'View employee competency records',
    },
    {
      label: 'Active Certificates',
      route: '/reports/active-certificates',
      description: 'List of valid certificates',
    },
    {
      label: 'Batch Summary',
      route: '/reports/batch-summary',
      description: 'Training batch status overview',
    },
    {
      label: 'All Reports',
      route: '/reports',
      description: 'Open reports module',
    },
  ];
}
