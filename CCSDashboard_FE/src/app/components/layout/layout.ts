import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

interface NavItem {
  label: string;
  icon: string;
  route?: string;
  children?: NavItem[];
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class LayoutComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

  sidebarOpen = signal(true);
  expandedGroups = signal<Set<string>>(new Set(['certificates', 'reports']));

  navGroups = [
    {
      id: 'certificates',
      label: 'Certificates',
      items: [
        { label: 'Initialisation', icon: 'M12 4v16m8-8H4', route: '/certificates/init' },
        { label: 'Approval', icon: 'M5 13l4 4L19 7', route: '/certificates/approval' },
        { label: 'Generate/View/Download', icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4', route: '/certificates/generate' },
      ],
    },
    {
      id: 'reports',
      label: 'Reports',
      items: [
        { label: 'Competency Register', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', route: '/reports/competency-register' },
        { label: 'Training Batch Report', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2', route: '/reports/batch-summary' },
        { label: 'Training Status Report', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', route: '/reports/active-certificates' },
      ],
    },
    {
      id: 'masters',
      label: 'Masters',
      items: [
        { label: 'Department', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16', route: '/masters/department' },
        { label: 'Designation', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', route: '/masters/designation' },
        { label: 'Category', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z', route: '/masters/category' },
        { label: 'Contractor', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', route: '/masters/contractor' },
        { label: 'Employee', icon: 'M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m4-4a4 4 0 100-8 4 4 0 000 8z', route: '/masters/employee' },
      ],
    },
    {
      id: 'security',
      label: 'Security',
      items: [
        { label: 'Pages', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', route: '/security/pages' },
        { label: 'Roles', icon: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z', route: '/security/roles' },
        { label: 'Role/Page/Control', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01', route: '/security/role-page' },
        { label: 'User Info', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', route: '/security/users' },
        { label: 'Medical Fitness', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z', route: '/security/medical' },
      ],
    },
  ];

  toggleSidebar(): void {
    this.sidebarOpen.update(v => !v);
  }

  toggleGroup(id: string): void {
    this.expandedGroups.update(groups => {
      const next = new Set(groups);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  isGroupExpanded(id: string): boolean {
    return this.expandedGroups().has(id);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getCurrentPageTitle(): string {
    const url = this.router.url;
    if (url.includes('dashboard')) return 'Dashboard';
    if (url.includes('competency-register')) return 'Competency Register';
    if (url.includes('active-certificates')) return 'Training Status Report';
    if (url.includes('batch-summary')) return 'Training Batch Report';
    if (url.includes('reports')) return 'Reports';
    return 'Dashboard';
  }
}