import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ReportService } from '../../../services/report.service';
import { ActiveCertificateRecord } from '../../../models/active-certificate.model';

@Component({
  selector: 'app-active-certificates',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './active-certificates.html',
})
export class ActiveCertificatesComponent implements OnInit {
  private reportService = inject(ReportService);

  rows: ActiveCertificateRecord[] = [];
  searchTerm = '';
  statusFilter = 'All';
  loading = true;
  loadError = '';

  ngOnInit(): void {
    this.reportService.getActiveCertificates().subscribe({
      next: (data) => {
        this.rows = data;
        this.loading = false;
      },
      error: () => {
        this.loadError =
          'Unable to load active certificates. Ensure you are logged in and the API is running.';
        this.loading = false;
      },
    });
  }

  get filteredRows(): ActiveCertificateRecord[] {
    const term = this.searchTerm.trim().toLowerCase();
    return this.rows.filter((r) => {
      const matchesSearch =
        !term ||
        r.employeeCode.toLowerCase().includes(term) ||
        r.employeeName.toLowerCase().includes(term) ||
        r.certificateNumber.toLowerCase().includes(term);

      // API only returns active certs, status filter is informational only
      return matchesSearch;
    });
  }
}