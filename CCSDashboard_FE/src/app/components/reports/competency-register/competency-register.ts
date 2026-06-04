import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ReportService } from '../../../services/report.service';
import { CompetencyRegisterRecord } from '../../../models/competency-register.model';

@Component({
  selector: 'app-competency-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './competency-register.html',
})
export class CompetencyRegisterComponent implements OnInit {
  private reportService = inject(ReportService);

  records: CompetencyRegisterRecord[] = [];
  filteredRecords: CompetencyRegisterRecord[] = [];
  searchTerm = '';
  departmentFilter = 'All';
  loading = true;
  loadError = '';

  readonly departmentOptions = [
    'All',
    'Operations',
    'Signalling',
    'Rolling Stock',
    'Electrical',
  ];

  ngOnInit(): void {
    this.reportService.getCompetencyRegister().subscribe({
      next: (data) => {
        this.records = data;
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.loadError =
          'Unable to load competency register. Ensure you are logged in and the API is running.';
        this.loading = false;
      },
    });
  }

  applyFilters(): void {
  const term = this.searchTerm.trim().toLowerCase();
  const dept = this.departmentFilter;

  this.filteredRecords = this.records.filter((r) => {
    const matchesSearch =
      !term ||
      r.employeeCode.toLowerCase().includes(term) ||
      r.employeeName.toLowerCase().includes(term) ||
      r.certificateNumber.toLowerCase().includes(term);

    const matchesDept =
      dept === 'All' || r.department === dept;

    return matchesSearch && matchesDept;
  });
}

  exportCsv(): void {
    // Placeholder for Step 2 export endpoint
  }
}
