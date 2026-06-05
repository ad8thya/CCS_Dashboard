import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CompetencyRegisterRecord } from '../models/competency-register.model';
import { ActiveCertificateRecord } from '../models/active-certificate.model';
import { BatchSummaryRecord } from '../models/batch-summary.model';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:5266/api';

  getCompetencyRegister() {
    return this.http.get<CompetencyRegisterRecord[]>(
      `${this.baseUrl}/reports/competency-register`,
    );
  }

  getActiveCertificates() {
    return this.http.get<ActiveCertificateRecord[]>(
      `${this.baseUrl}/reports/active-certificates`,
    );
  }

  getBatchSummary() {
    return this.http.get<BatchSummaryRecord[]>(
      `${this.baseUrl}/reports/batch-summary`,
    );
  }

  exportCompetencyRegister(): void {
    this.http.get(`${this.baseUrl}/reports/competency-register/export`, {
      responseType: 'blob',
    }).subscribe(blob => {
      this.triggerDownload(blob, `competency-register-${this.today()}.csv`);
    });
  }

  exportActiveCertificates(): void {
    this.http.get(`${this.baseUrl}/reports/active-certificates/export`, {
      responseType: 'blob',
    }).subscribe(blob => {
      this.triggerDownload(blob, `active-certificates-${this.today()}.csv`);
    });
  }

  exportBatchSummary(): void {
    this.http.get(`${this.baseUrl}/reports/batch-summary/export`, {
      responseType: 'blob',
    }).subscribe(blob => {
      this.triggerDownload(blob, `batch-summary-${this.today()}.csv`);
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