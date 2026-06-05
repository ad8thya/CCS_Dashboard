import { Component, OnInit, inject, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource } from '@angular/material/table';
import { ReportService } from '../../../services/report.service';
import { ActiveCertificateRecord } from '../../../models/active-certificate.model';

@Component({
  selector: 'app-active-certificates',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatChipsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './active-certificates.html',
  styleUrl: './active-certificates.css',
})
export class ActiveCertificatesComponent implements OnInit, AfterViewInit {
  private reportService = inject(ReportService);

  displayedColumns = [
    'certificateNumber',
    'employeeCode',
    'employeeName',
    'department',
    'competencyArea',
    'issueDate',
    'expiryDate',
    'daysToExpiry',
  ];

  dataSource = new MatTableDataSource<ActiveCertificateRecord>([]);
  loading = true;
  loadError = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.reportService.getActiveCertificates().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.loading = false;
      },
      error: () => {
        this.loadError = 'Unable to load active certificates.';
        this.loading = false;
      },
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applySearch(term: string): void {
    this.dataSource.filter = term.trim().toLowerCase();
    this.dataSource.paginator?.firstPage();
  }

  expiryClass(days: number): string {
    if (days <= 30) return 'chip-red';
    if (days <= 90) return 'chip-yellow';
    return 'chip-green';
  }

  expiryLabel(days: number): string {
    if (days <= 30) return `⚠ ${days}d left`;
    if (days <= 90) return `${days}d left`;
    return `✓ ${days}d left`;
  }
}