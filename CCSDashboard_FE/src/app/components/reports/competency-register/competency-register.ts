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
import { CompetencyRegisterRecord } from '../../../models/competency-register.model';

@Component({
  selector: 'app-competency-register',
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
  templateUrl: './competency-register.html',
  styleUrl: './competency-register.css',
})
export class CompetencyRegisterComponent implements OnInit, AfterViewInit {
  private reportService = inject(ReportService);

  displayedColumns = [
    'employeeCode',
    'employeeName',
    'department',
    'designation',
    'certificateNumber',
    'expiryDate',
  ];

  dataSource = new MatTableDataSource<CompetencyRegisterRecord>([]);
  loading = true;
  loadError = '';
  departmentFilter = 'All';

  readonly departmentOptions = [
    'All',
    'Operations',
    'Signalling',
    'Track/P-Way',
    'Telecom',
    'Automatic Fare Collection',
    'Rolling Stock',
    'Electrical',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.reportService.getCompetencyRegister().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.loading = false;
      },
      error: () => {
        this.loadError = 'Unable to load competency register.';
        this.loading = false;
      },
    });

    this.dataSource.filterPredicate = (record, filter) => {
      const parsed = JSON.parse(filter);
      const term = parsed.term.toLowerCase();
      const dept = parsed.dept;

      const matchesSearch =
        !term ||
        record.employeeCode.toLowerCase().includes(term) ||
        record.employeeName.toLowerCase().includes(term) ||
        record.certificateNumber.toLowerCase().includes(term);

      const matchesDept =
        dept === 'All' || record.department === dept;

      return matchesSearch && matchesDept;
    };
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilters(term: string): void {
    this.dataSource.filter = JSON.stringify({
      term,
      dept: this.departmentFilter,
    });
    this.dataSource.paginator?.firstPage();
  }

  applyDeptFilter(): void {
    this.dataSource.filter = JSON.stringify({
      term: '',
      dept: this.departmentFilter,
    });
    this.dataSource.paginator?.firstPage();
  }
}