import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CompetencyRegisterRecord } from '../models/competency-register.model';
import { ActiveCertificateRecord } from '../models/active-certificate.model';
import { BatchSummaryRecord } from '../models/batch-summary.model';
import { NotificationService } from './notification.service';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReportService {
  private http = inject(HttpClient);
  private notify = inject(NotificationService);
  private baseUrl = environment.apiBaseUrl;

  getCompetencyRegister() {
    return this.http.get<CompetencyRegisterRecord[]>(
      `${this.baseUrl}/reports/competency-register`
    );
  }

  getActiveCertificates() {
    return this.http.get<ActiveCertificateRecord[]>(
      `${this.baseUrl}/reports/active-certificates`
    );
  }

  getBatchSummary() {
    return this.http.get<BatchSummaryRecord[]>(
      `${this.baseUrl}/reports/batch-summary`
    );
  }

  exportCompetencyRegister(): void {
    this.notify.info('Preparing download…');
    this.http.get(`${this.baseUrl}/reports/competency-register/export`, {
      responseType: 'blob',
    }).subscribe({
      next: (blob) => {
        this.triggerDownload(blob, `competency-register-${this.today()}.csv`);
        this.notify.success('Competency Register exported successfully.');
      },
      error: () => {
        this.notify.error('Export failed. Please try again.');
      },
    });
  }

  exportActiveCertificates(): void {
    this.notify.info('Preparing download…');
    this.http.get(`${this.baseUrl}/reports/active-certificates/export`, {
      responseType: 'blob',
    }).subscribe({
      next: (blob) => {
        this.triggerDownload(blob, `active-certificates-${this.today()}.csv`);
        this.notify.success('Active Certificates exported successfully.');
      },
      error: () => {
        this.notify.error('Export failed. Please try again.');
      },
    });
  }

  exportBatchSummary(): void {
    this.notify.info('Preparing download…');
    this.http.get(`${this.baseUrl}/reports/batch-summary/export`, {
      responseType: 'blob',
    }).subscribe({
      next: (blob) => {
        this.triggerDownload(blob, `batch-summary-${this.today()}.csv`);
        this.notify.success('Batch Summary exported successfully.');
      },
      error: () => {
        this.notify.error('Export failed. Please try again.');
      },
    });
  }

  private triggerDownload(blob: Blob, filename: string): void {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  private today(): string {
    return new Date().toISOString().slice(0, 10);
  }
}