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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Certificate → Employee (many-to-one)
            modelBuilder.Entity<Certificate>()
                .HasOne(c => c.Employee)
                .WithMany(e => e.Certificates)
                .HasForeignKey(c => c.EmployeeId)
                .OnDelete(DeleteBehavior.Restrict);

            // Certificate → Batch (many-to-one)
            modelBuilder.Entity<Certificate>()
                .HasOne(c => c.Batch)
                .WithMany(b => b.Certificates)
                .HasForeignKey(c => c.BatchId)
                .OnDelete(DeleteBehavior.Restrict);

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
        }
    }
}