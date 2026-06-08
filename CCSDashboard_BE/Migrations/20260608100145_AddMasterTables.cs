using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace CCSDashboard.Migrations
{
    /// <inheritdoc />
    public partial class AddMasterTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
{
    // 1. Create master tables
    migrationBuilder.CreateTable(
        name: "Departments",
        columns: table => new
        {
            Id       = table.Column<int>(nullable: false)
                           .Annotation("Npgsql:ValueGenerationStrategy",
                               NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
            Name     = table.Column<string>(nullable: false),
            IsActive = table.Column<bool>(nullable: false, defaultValue: true)
        },
        constraints: table => table.PrimaryKey("PK_Departments", x => x.Id));

    migrationBuilder.CreateTable(
        name: "Designations",
        columns: table => new
        {
            Id       = table.Column<int>(nullable: false)
                           .Annotation("Npgsql:ValueGenerationStrategy",
                               NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
            Name     = table.Column<string>(nullable: false),
            IsActive = table.Column<bool>(nullable: false, defaultValue: true)
        },
        constraints: table => table.PrimaryKey("PK_Designations", x => x.Id));

    migrationBuilder.CreateTable(
        name: "Contractors",
        columns: table => new
        {
            Id            = table.Column<int>(nullable: false)
                               .Annotation("Npgsql:ValueGenerationStrategy",
                                   NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
            Name          = table.Column<string>(nullable: false),
            ContactPerson = table.Column<string>(nullable: false, defaultValue: ""),
            Phone         = table.Column<string>(nullable: false, defaultValue: ""),
            IsActive      = table.Column<bool>(nullable: false, defaultValue: true)
        },
        constraints: table => table.PrimaryKey("PK_Contractors", x => x.Id));

    // 2. Seed distinct department names from existing employee rows
    migrationBuilder.Sql(@"
        INSERT INTO ""Departments"" (""Name"", ""IsActive"")
        SELECT DISTINCT ""Department"", true
        FROM ""Employees""
        WHERE ""Department"" IS NOT NULL AND ""Department"" <> '';
    ");

    // 3. Seed distinct designation names
    migrationBuilder.Sql(@"
        INSERT INTO ""Designations"" (""Name"", ""IsActive"")
        SELECT DISTINCT ""Designation"", true
        FROM ""Employees""
        WHERE ""Designation"" IS NOT NULL AND ""Designation"" <> '';
    ");

    // 4. Add FK columns as nullable first (required for the data copy step)
    migrationBuilder.AddColumn<int>(
        name: "DepartmentId",
        table: "Employees",
        nullable: true);

    migrationBuilder.AddColumn<int>(
        name: "DesignationId",
        table: "Employees",
        nullable: true);

    migrationBuilder.AddColumn<int>(
        name: "ContractorId",
        table: "Employees",
        nullable: true);

    // 5. Populate FK columns from the seeded master tables
    migrationBuilder.Sql(@"
        UPDATE ""Employees"" e
        SET ""DepartmentId"" = d.""Id""
        FROM ""Departments"" d
        WHERE d.""Name"" = e.""Department"";
    ");

    migrationBuilder.Sql(@"
        UPDATE ""Employees"" e
        SET ""DesignationId"" = d.""Id""
        FROM ""Designations"" d
        WHERE d.""Name"" = e.""Designation"";
    ");

    // 6. Now that FKs are populated, make them non-nullable
    migrationBuilder.AlterColumn<int>(
        name: "DepartmentId",
        table: "Employees",
        nullable: false,
        oldClrType: typeof(int),
        oldNullable: true);

    migrationBuilder.AlterColumn<int>(
        name: "DesignationId",
        table: "Employees",
        nullable: false,
        oldClrType: typeof(int),
        oldNullable: true);

    // 7. Drop the old string columns
    migrationBuilder.DropColumn(name: "Department",  table: "Employees");
    migrationBuilder.DropColumn(name: "Designation", table: "Employees");

    // 8. Add FK constraints
    migrationBuilder.AddForeignKey(
        name: "FK_Employees_Departments_DepartmentId",
        table: "Employees",
        column: "DepartmentId",
        principalTable: "Departments",
        principalColumn: "Id",
        onDelete: ReferentialAction.Restrict);

    migrationBuilder.AddForeignKey(
        name: "FK_Employees_Designations_DesignationId",
        table: "Employees",
        column: "DesignationId",
        principalTable: "Designations",
        principalColumn: "Id",
        onDelete: ReferentialAction.Restrict);

    migrationBuilder.AddForeignKey(
        name: "FK_Employees_Contractors_ContractorId",
        table: "Employees",
        column: "ContractorId",
        principalTable: "Contractors",
        principalColumn: "Id",
        onDelete: ReferentialAction.SetNull);

    // 9. Indexes
    migrationBuilder.CreateIndex(
        name: "IX_Departments_Name",
        table: "Departments",
        column: "Name",
        unique: true);

    migrationBuilder.CreateIndex(
        name: "IX_Designations_Name",
        table: "Designations",
        column: "Name",
        unique: true);

    migrationBuilder.CreateIndex(
        name: "IX_Employees_DepartmentId",
        table: "Employees",
        column: "DepartmentId");

    migrationBuilder.CreateIndex(
        name: "IX_Employees_DesignationId",
        table: "Employees",
        column: "DesignationId");
}

        /// <inheritdoc />
       protected override void Down(MigrationBuilder migrationBuilder)
{
    migrationBuilder.AddColumn<string>(name: "Department",  table: "Employees", nullable: false, defaultValue: "");
    migrationBuilder.AddColumn<string>(name: "Designation", table: "Employees", nullable: false, defaultValue: "");

    migrationBuilder.Sql(@"
        UPDATE ""Employees"" e SET ""Department""  = d.""Name"" FROM ""Departments""  d WHERE d.""Id"" = e.""DepartmentId"";
        UPDATE ""Employees"" e SET ""Designation"" = d.""Name"" FROM ""Designations"" d WHERE d.""Id"" = e.""DesignationId"";
    ");

    migrationBuilder.DropForeignKey(name: "FK_Employees_Departments_DepartmentId",  table: "Employees");
    migrationBuilder.DropForeignKey(name: "FK_Employees_Designations_DesignationId", table: "Employees");
    migrationBuilder.DropForeignKey(name: "FK_Employees_Contractors_ContractorId",   table: "Employees");
    migrationBuilder.DropColumn(name: "DepartmentId",  table: "Employees");
    migrationBuilder.DropColumn(name: "DesignationId", table: "Employees");
    migrationBuilder.DropColumn(name: "ContractorId",  table: "Employees");
    migrationBuilder.DropTable(name: "Departments");
    migrationBuilder.DropTable(name: "Designations");
    migrationBuilder.DropTable(name: "Contractors");
}
    }
}
