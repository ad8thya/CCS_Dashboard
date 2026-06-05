import { Component, OnInit, inject, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource } from '@angular/material/table';
import { ReportService } from '../../../services/report.service';
import { BatchSummaryRecord } from '../../../models/batch-summary.model';

@Component({
  selector: 'app-batch-summary',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './batch-summary.html',
  styleUrl: './batch-summary.css',
})
export class BatchSummaryComponent implements OnInit, AfterViewInit {
  private reportService = inject(ReportService);

  displayedColumns = [
    'batchCode',
    'courseName',
    'startDate',
    'endDate',
    'totalParticipants',
    'activeCertificates',
    'expiredCertificates',
  ];

  dataSource = new MatTableDataSource<BatchSummaryRecord>([]);
  loading = true;
  loadError = '';
  yearFilter = 'All';

  readonly yearOptions = ['All', '2026', '2025', '2024'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.reportService.getBatchSummary().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.loading = false;
      },
      error: () => {
        this.loadError = 'Unable to load batch summary.';
        this.loading = false;
      },
    });

    this.dataSource.filterPredicate = (record, filter) => {
      const parsed = JSON.parse(filter);
      const term = parsed.term.toLowerCase();
      const year = parsed.year;

      const matchesSearch =
        !term ||
        record.batchCode.toLowerCase().includes(term) ||
        record.courseName.toLowerCase().includes(term);

      const matchesYear =
        year === 'All' || record.startDate.startsWith(year);

      return matchesSearch && matchesYear;
    };
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilters(term = ''): void {
    this.dataSource.filter = JSON.stringify({
      term,
      year: this.yearFilter,
    });
    this.dataSource.paginator?.firstPage();
  }
}