import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CompetencyRegisterRecord } from '../models/competency-register.model';
import { ActiveCertificateRecord } from '../models/active-certificate.model';
import { BatchSummaryRecord } from '../models/batch-summary.model';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private http = inject(HttpClient);

  private readonly reportsUrl = `${environment.apiBaseUrl}/reports`;

  getCompetencyRegister() {
    return this.http.get<CompetencyRegisterRecord[]>(
      `${this.reportsUrl}/competency-register`,
    );
  }

  getActiveCertificates() {
    return this.http.get<ActiveCertificateRecord[]>(
      `${this.reportsUrl}/active-certificates`,
    );
  }

  getBatchSummary() {
    return this.http.get<BatchSummaryRecord[]>(
      `${this.reportsUrl}/batch-summary`,
    );
  }
}
