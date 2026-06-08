using Microsoft.EntityFrameworkCore;
using CCSDashboard.Models;

namespace CCSDashboard.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(
            DbContextOptions<ApplicationDbContext> options
        ) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<Certificate> Certificates { get; set; }
        public DbSet<Batch> Batches { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<Designation> Designations { get; set; }
        public DbSet<Contractor> Contractors { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Certificate → Employee
            modelBuilder.Entity<Certificate>()
                .HasOne(c => c.Employee)
                .WithMany(e => e.Certificates)
                .HasForeignKey(c => c.EmployeeId)
                .OnDelete(DeleteBehavior.Restrict);

            // Certificate → Batch
            modelBuilder.Entity<Certificate>()
                .HasOne(c => c.Batch)
                .WithMany(b => b.Certificates)
                .HasForeignKey(c => c.BatchId)
                .OnDelete(DeleteBehavior.Restrict);

            // Employee → Department
            modelBuilder.Entity<Employee>()
                .HasOne(e => e.Department)
                .WithMany(d => d.Employees)
                .HasForeignKey(e => e.DepartmentId)
                .OnDelete(DeleteBehavior.Restrict);

            // Employee → Designation
            modelBuilder.Entity<Employee>()
                .HasOne(e => e.Designation)
                .WithMany(d => d.Employees)
                .HasForeignKey(e => e.DesignationId)
                .OnDelete(DeleteBehavior.Restrict);

            // Employee → Contractor (optional)
            modelBuilder.Entity<Employee>()
                .HasOne(e => e.Contractor)
                .WithMany(c => c.Employees)
                .HasForeignKey(e => e.ContractorId)
                .OnDelete(DeleteBehavior.SetNull);

            // Indexes
            modelBuilder.Entity<Employee>()
                .HasIndex(e => e.EmployeeCode)
                .IsUnique();

            modelBuilder.Entity<Certificate>()
                .HasIndex(c => c.CertificateNumber)
                .IsUnique();

            modelBuilder.Entity<Batch>()
                .HasIndex(b => b.BatchCode)
                .IsUnique();

            modelBuilder.Entity<Department>()
                .HasIndex(d => d.Name)
                .IsUnique();

            modelBuilder.Entity<Designation>()
                .HasIndex(d => d.Name)
                .IsUnique();
        }
    }
}