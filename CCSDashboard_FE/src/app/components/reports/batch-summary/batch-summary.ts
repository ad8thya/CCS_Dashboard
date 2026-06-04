import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ReportService } from '../../../services/report.service';
import { BatchSummaryRecord } from '../../../models/batch-summary.model';

@Component({
  selector: 'app-batch-summary',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './batch-summary.html',
})
export class BatchSummaryComponent implements OnInit {
  private reportService = inject(ReportService);

  rows: BatchSummaryRecord[] = [];
  searchTerm = '';
  yearFilter = 'All';
  loading = true;
  loadError = '';

  readonly yearOptions = ['All', '2026', '2025', '2024'];

  ngOnInit(): void {
    this.reportService.getBatchSummary().subscribe({
      next: (data) => {
        this.rows = data;
        this.loading = false;
      },
      error: () => {
        this.loadError =
          'Unable to load batch summary. Ensure you are logged in and the API is running.';
        this.loading = false;
      },
    });
  }

  get filteredRows(): BatchSummaryRecord[] {
    const term = this.searchTerm.trim().toLowerCase();
    return this.rows.filter((r) => {
      const matchesSearch =
        !term ||
        r.batchCode.toLowerCase().includes(term) ||
        r.courseName.toLowerCase().includes(term);

      const matchesYear =
        this.yearFilter === 'All' ||
        r.startDate.startsWith(this.yearFilter);

      return matchesSearch && matchesYear;
    });
  }
}