"""
CCS Full Data Seeder
Generates 50+ realistic records per category for CMRL CCS.
Matches normalized FK schema: Departments, Designations, Contractors tables.

Run: python seed_ccs_full.py
"""

import psycopg2
from datetime import date, timedelta

# ─── CONFIG ──────────────────────────────────────────────────────────────────
DB = {
    "host":     "localhost",
    "port":     5432,
    "dbname":   "CCSDashboard",
    "user":     "postgres",
    "password": "password",
}

# ─── REFERENCE DATA ──────────────────────────────────────────────────────────

DEPARTMENTS = [
    "Track/P-Way",
    "Signalling",
    "Automatic Fare Collection",
    "Telecom",
    "Operations",
    "Rolling Stock",
    "Electrical (OHE)",
    "Civil",
    "OCC",
    "Station Operations",
]

DESIGNATIONS = [
    "Junior Engineer",
    "Section Engineer",
    "Senior Section Engineer",
    "Assistant Engineer",
    "Deputy Engineer",
    "Supervisor (Team Leader)",
    "Technician",
    "Senior Technician",
    "Manager",
    "Deputy Manager",
    "Assistant Manager",
    "Traffic Controller",
    "Station Controller",
    "Train Operator",
    "Gang Man",
    "Track Man",
]

CONTRACTORS = [
    ("CMRL",                 "",  ""),
    ("Xenovex",              "",  ""),
    ("Armtech",              "",  ""),
    ("AB & SONS",            "",  ""),
    ("A One",                "",  ""),
    ("Alstom",               "",  ""),
    ("Siemens",              "",  ""),
    ("L&T Metro",            "",  ""),
    ("Thales",               "",  ""),
    ("Bombardier",           "",  ""),
    ("Cubic Transportation", "",  ""),
    ("ITD Cementation",      "",  ""),
]

# Dept → competency areas
DEPT_AREAS = {
    "Track/P-Way": [
        "Supervisor/Section Engineer/Junior Engineer",
        "Technician",
        "Gangman/Trackman",
    ],
    "Signalling": [
        "Supervisor-IOH/PM/CM/Material Management",
        "Section Engineer/Junior Engineer/Techician",
        "Technician",
    ],
    "Automatic Fare Collection": [
        "Section Engineer/Junior Engineer/Techician",
        "Technician",
        "Supervisor-IOH/PM/CM/Material Management",
    ],
    "Telecom": [
        "Traffic Regulator",
        "Section Engineer/Junior Engineer/Techician",
        "Technician",
    ],
    "Operations": [
        "Technicain/Senior Technician/Electrical Supervisor and Equivalent Post",
        "Traffic Regulator",
        "Station Controller/Train Operator",
    ],
    "Rolling Stock": [
        "Section Engineer/Junior Engineer/Techician",
        "Technician",
        "Supervisor-IOH/PM/CM/Material Management",
    ],
    "Electrical (OHE)": [
        "Section Engineer/Junior Engineer/Techician",
        "Technician",
        "Supervisor/Section Engineer/Junior Engineer",
    ],
    "Civil": [
        "Supervisor/Section Engineer/Junior Engineer",
        "Section Engineer/Junior Engineer/Techician",
    ],
    "OCC": [
        "Station Controller/Train Operator",
        "Traffic Regulator",
        "Supervisor-IOH/PM/CM/Material Management",
    ],
    "Station Operations": [
        "Station Controller/Train Operator",
        "Traffic Regulator",
        "Technicain/Senior Technician/Electrical Supervisor and Equivalent Post",
    ],
}

DEPT_CERT_PREFIX = {
    "Track/P-Way":               "TKSE",
    "Signalling":                "STSP",
    "Automatic Fare Collection": "AFJE",
    "Telecom":                   "TETC",
    "Operations":                "OPMR",
    "Rolling Stock":             "RSJE",
    "Electrical (OHE)":          "ELOE",
    "Civil":                     "CVSE",
    "OCC":                       "OCCS",
    "Station Operations":        "SOPS",
}

NAMES = [
    "Brue", "Mani", "Alfred", "George", "Vinoth", "Raja", "Deva",
    "Arjun Krishnamurthy", "Suresh Babu", "Ramesh Kumar",
    "Karthik Rajan", "Murugan Selvam", "Senthil Nathan",
    "Vijay Anand", "Balaji Subramanian", "Ganesh Mohan",
    "Prakash Sundaram", "Dinesh Chandran", "Manikandan Pillai",
    "Sathish Kumar", "Arun Prabhu", "Sivakumar Natarajan",
    "Venkatesh Iyer", "Rajesh Pandian", "Pradeep Annamalai",
    "Govindarajan T", "Hariharan S", "Ilango Periasamy",
    "Jayakumar Velu", "Kannan Duraisamy", "Lakshmanan R",
    "Muthuraj Palanisamy", "Nandakumar C", "Pandi Arumugam",
    "Saravanan Thangavel", "Tamilselvan K", "Udhayakumar M",
    "Vasanth Ramalingam", "Yuvaraj Sekar", "Anbu Selvan",
    "Boopathi Raman", "Chelladurai V", "Durai Murugan",
    "Elavarasan P", "Feroz Khan", "Gnanasekaran A",
    "Hemalatha Devi", "Indira Priyadharshini", "Janaki Raman",
    "Kalaivani Suresh", "Lavanya Krishnan", "Meenakshi Sundar",
    "Nalini Rajendran", "Oviya Chandrasekaran", "Pavithra Moorthy",
    "Rekha Balakrishnan", "Sangeetha Murugan", "Thenmozhi K",
]


# ─── MASTER DATA SEED ────────────────────────────────────────────────────────

def seed_departments(cur):
    """Insert departments, return {name: id} map."""
    print("\nSeeding Departments...")
    for name in DEPARTMENTS:
        cur.execute("""
            INSERT INTO "Departments" ("Name", "IsActive")
            VALUES (%s, true)
            ON CONFLICT ("Name") DO NOTHING
        """, (name,))

    cur.execute("""SELECT "Id", "Name" FROM "Departments" """)
    result = {row[1]: row[0] for row in cur.fetchall()}
    print(f"  {len(result)} departments available")
    return result


def seed_designations(cur):
    """Insert designations, return {name: id} map."""
    print("\nSeeding Designations...")
    for name in DESIGNATIONS:
        cur.execute("""
            INSERT INTO "Designations" ("Name", "IsActive")
            VALUES (%s, true)
            ON CONFLICT ("Name") DO NOTHING
        """, (name,))

    cur.execute("""SELECT "Id", "Name" FROM "Designations" """)
    result = {row[1]: row[0] for row in cur.fetchall()}
    print(f"  {len(result)} designations available")
    return result


def seed_contractors(cur):
    """Insert contractors, return {name: id} map."""
    print("\nSeeding Contractors...")
    for name, contact, phone in CONTRACTORS:
        cur.execute("""
            INSERT INTO "Contractors" ("Name", "ContactPerson", "Phone", "IsActive")
            VALUES (%s, %s, %s, true)
            ON CONFLICT DO NOTHING
        """, (name, contact, phone))

    cur.execute("""SELECT "Id", "Name" FROM "Contractors" """)
    result = {row[1]: row[0] for row in cur.fetchall()}
    print(f"  {len(result)} contractors available")
    return result


# ─── EMPLOYEES ───────────────────────────────────────────────────────────────

def make_employees():
    dept_counts = {
        "Track/P-Way":               8,
        "Signalling":                7,
        "Automatic Fare Collection": 7,
        "Telecom":                   6,
        "Operations":                6,
        "Rolling Stock":             6,
        "Electrical (OHE)":          5,
        "Civil":                     4,
        "OCC":                       4,
        "Station Operations":        4,
    }

    contractor_pool = ["CMRL", "CMRL", "CMRL",  # weight CMRL higher
                       "Xenovex", "Armtech", "AB & SONS", "A One",
                       "Alstom", "Siemens", "L&T Metro", "Thales",
                       "Bombardier", "Cubic Transportation", "ITD Cementation"]

    desig_cycle = [
        "Junior Engineer", "Section Engineer", "Technician",
        "Senior Technician", "Supervisor (Team Leader)", "Assistant Engineer",
        "Deputy Engineer", "Traffic Controller", "Station Controller",
        "Manager", "Train Operator", "Gang Man",
    ]

    employees = []
    staff_counter = 300
    name_idx = 7  # skip first 7 already in DB

    for dept, count in dept_counts.items():
        for i in range(count):
            employees.append({
                "employee_code": f"{staff_counter:04d}",
                "name":          NAMES[name_idx % len(NAMES)],
                "designation":   desig_cycle[staff_counter % len(desig_cycle)],
                "department":    dept,
                "contractor":    contractor_pool[i % len(contractor_pool)],
            })
            staff_counter += 1
            name_idx += 1

    return employees


def seed_employees(cur, employees, dept_id_map, desig_id_map, contractor_id_map):
    print(f"\nSeeding {len(employees)} employees...")
    inserted = 0
    skipped = 0

    for e in employees:
        dept_id = dept_id_map.get(e["department"])
        desig_id = desig_id_map.get(e["designation"])
        contractor_id = contractor_id_map.get(e["contractor"])  # may be None — that's fine

        if dept_id is None:
            print(f"  SKIP {e['employee_code']}: department '{e['department']}' not found")
            skipped += 1
            continue
        if desig_id is None:
            print(f"  SKIP {e['employee_code']}: designation '{e['designation']}' not found")
            skipped += 1
            continue

        cur.execute("""
            INSERT INTO "Employees"
                ("EmployeeCode", "Name", "DepartmentId", "DesignationId", "ContractorId")
            VALUES (%s, %s, %s, %s, %s)
            ON CONFLICT ("EmployeeCode") DO NOTHING
        """, (
            e["employee_code"],
            e["name"],
            dept_id,
            desig_id,
            contractor_id,   # nullable FK — postgres accepts None as NULL
        ))
        if cur.rowcount:
            inserted += 1

    print(f"  Inserted {inserted} new employees ({skipped} skipped)")
    return inserted


# ─── BATCHES ─────────────────────────────────────────────────────────────────

def make_batches():
    return [
        # (code, course_name, dept, start, end)
        # Track/P-Way
        ("TK-IND-2401", "Induction Training",       "Track/P-Way",               date(2024, 1, 15), date(2024, 1, 30)),
        ("TK-REF-2404", "Refresher Training",        "Track/P-Way",               date(2024, 4, 3),  date(2024, 4, 18)),
        ("TK-IND-2407", "Induction Training",        "Track/P-Way",               date(2024, 7, 8),  date(2024, 7, 25)),
        ("TK-SKL-2409", "Special/Upskill Training",  "Track/P-Way",               date(2024, 9, 2),  date(2024, 9, 14)),
        ("TK-IND-2501", "Induction Training",        "Track/P-Way",               date(2025, 1, 6),  date(2025, 1, 24)),
        ("TK-REF-2504", "Refresher Training",        "Track/P-Way",               date(2025, 4, 7),  date(2025, 4, 22)),
        ("TK-CON-2506", "Conversion Training",       "Track/P-Way",               date(2025, 6, 2),  date(2025, 6, 16)),
        ("TK-IND-2601", "Induction Training",        "Track/P-Way",               date(2026, 1, 13), date(2026, 2, 3)),
        # Signalling
        ("SG-IND-2402", "Induction Training",        "Signalling",                date(2024, 2, 5),  date(2024, 2, 20)),
        ("SG-REF-2405", "Refresher Training",        "Signalling",                date(2024, 5, 6),  date(2024, 5, 21)),
        ("SG-SKL-2408", "Special/Upskill Training",  "Signalling",                date(2024, 8, 12), date(2024, 8, 24)),
        ("SG-IND-2501", "Induction Training",        "Signalling",                date(2025, 1, 20), date(2025, 2, 7)),
        ("SG-REF-2506", "Refresher Training",        "Signalling",                date(2025, 6, 9),  date(2025, 6, 25)),
        ("SG-IND-2601", "Induction Training",        "Signalling",                date(2026, 2, 3),  date(2026, 2, 21)),
        # AFC
        ("AF-IND-2401", "Induction Training",        "Automatic Fare Collection", date(2024, 1, 22), date(2024, 2, 6)),
        ("AF-REF-2406", "Refresher Training",        "Automatic Fare Collection", date(2024, 6, 3),  date(2024, 6, 17)),
        ("AF-SKL-2410", "Special/Upskill Training",  "Automatic Fare Collection", date(2024, 10, 7), date(2024, 10, 18)),
        ("AF-IND-2502", "Induction Training",        "Automatic Fare Collection", date(2025, 2, 10), date(2025, 2, 27)),
        ("AF-REF-2507", "Refresher Training",        "Automatic Fare Collection", date(2025, 7, 14), date(2025, 7, 29)),
        ("AF-IND-2602", "Induction Training",        "Automatic Fare Collection", date(2026, 2, 17), date(2026, 3, 7)),
        # Telecom
        ("TC-IND-2403", "Induction Training",        "Telecom",                   date(2024, 3, 4),  date(2024, 3, 18)),
        ("TC-REF-2407", "Refresher Training",        "Telecom",                   date(2024, 7, 1),  date(2024, 7, 15)),
        ("TC-IND-2503", "Induction Training",        "Telecom",                   date(2025, 3, 3),  date(2025, 3, 20)),
        ("TC-SKL-2508", "Special/Upskill Training",  "Telecom",                   date(2025, 8, 11), date(2025, 8, 22)),
        ("TC-IND-2603", "Induction Training",        "Telecom",                   date(2026, 3, 2),  date(2026, 3, 19)),
        # Operations
        ("OP-IND-2402", "Induction Training",        "Operations",                date(2024, 2, 19), date(2024, 3, 5)),
        ("OP-REF-2408", "Refresher Training",        "Operations",                date(2024, 8, 5),  date(2024, 8, 20)),
        ("OP-IND-2504", "Induction Training",        "Operations",                date(2025, 4, 14), date(2025, 5, 2)),
        ("OP-CON-2509", "Conversion Training",       "Operations",                date(2025, 9, 1),  date(2025, 9, 15)),
        ("OP-IND-2601", "Induction Training",        "Operations",                date(2026, 1, 20), date(2026, 2, 10)),
        # Rolling Stock
        ("RS-IND-2403", "Induction Training",        "Rolling Stock",             date(2024, 3, 18), date(2024, 4, 2)),
        ("RS-REF-2409", "Refresher Training",        "Rolling Stock",             date(2024, 9, 16), date(2024, 10, 1)),
        ("RS-SKL-2412", "Special/Upskill Training",  "Rolling Stock",             date(2024, 12, 2), date(2024, 12, 14)),
        ("RS-IND-2505", "Induction Training",        "Rolling Stock",             date(2025, 5, 5),  date(2025, 5, 22)),
        ("RS-REF-2510", "Refresher Training",        "Rolling Stock",             date(2025, 10, 6), date(2025, 10, 21)),
        ("RS-IND-2604", "Induction Training",        "Rolling Stock",             date(2026, 4, 1),  date(2026, 4, 18)),
        # Electrical
        ("EL-IND-2404", "Induction Training",        "Electrical (OHE)",          date(2024, 4, 22), date(2024, 5, 8)),
        ("EL-REF-2410", "Refresher Training",        "Electrical (OHE)",          date(2024, 10, 21),date(2024, 11, 5)),
        ("EL-IND-2506", "Induction Training",        "Electrical (OHE)",          date(2025, 6, 16), date(2025, 7, 3)),
        ("EL-SKL-2511", "Special/Upskill Training",  "Electrical (OHE)",          date(2025, 11, 3), date(2025, 11, 14)),
        ("EL-IND-2605", "Induction Training",        "Electrical (OHE)",          date(2026, 5, 4),  date(2026, 5, 22)),
        # Civil
        ("CV-IND-2405", "Induction Training",        "Civil",                     date(2024, 5, 13), date(2024, 5, 28)),
        ("CV-REF-2411", "Refresher Training",        "Civil",                     date(2024, 11, 11),date(2024, 11, 25)),
        ("CV-IND-2507", "Induction Training",        "Civil",                     date(2025, 7, 7),  date(2025, 7, 24)),
        ("CV-IND-2602", "Induction Training",        "Civil",                     date(2026, 2, 24), date(2026, 3, 13)),
        # OCC
        ("OC-IND-2406", "Induction Training",        "OCC",                       date(2024, 6, 17), date(2024, 7, 2)),
        ("OC-REF-2412", "Refresher Training",        "OCC",                       date(2024, 12, 9), date(2024, 12, 24)),
        ("OC-IND-2508", "Induction Training",        "OCC",                       date(2025, 8, 18), date(2025, 9, 4)),
        ("OC-IND-2603", "Induction Training",        "OCC",                       date(2026, 3, 16), date(2026, 4, 3)),
        # Station Operations
        ("SO-IND-2407", "Induction Training",        "Station Operations",        date(2024, 7, 29), date(2024, 8, 13)),
        ("SO-REF-2501", "Refresher Training",        "Station Operations",        date(2025, 1, 27), date(2025, 2, 11)),
        ("SO-IND-2509", "Induction Training",        "Station Operations",        date(2025, 9, 22), date(2025, 10, 9)),
        ("SO-IND-2604", "Induction Training",        "Station Operations",        date(2026, 4, 14), date(2026, 5, 2)),
        # Cross-dept
        ("CMRL-SAF-2403","OJT (On-the-Job Training)","Operations",                date(2024, 3, 25), date(2024, 4, 6)),
        ("CMRL-SAF-2503","OJT (On-the-Job Training)","Signalling",                date(2025, 3, 17), date(2025, 3, 29)),
    ]


def seed_batches(cur, batches):
    print(f"\nSeeding {len(batches)} batches...")
    inserted = 0
    for code, course, dept, start, end in batches:
        cur.execute("""
            INSERT INTO "Batches" ("BatchCode", "CourseName", "StartDate", "EndDate", "Trainer", "Venue")
            VALUES (%s, %s, %s, %s, %s, %s)
            ON CONFLICT ("BatchCode") DO NOTHING
        """, (code, course, start, end, "", "CMRL Training Centre, Chennai"))
        if cur.rowcount:
            inserted += 1
    print(f"  Inserted {inserted} new batches (skipped duplicates)")


# ─── CERTIFICATES ─────────────────────────────────────────────────────────────

def seed_certificates(cur, emp_id_map, batch_id_map, dept_name_map):
    """
    emp_id_map:   {employee_code: (db_id, dept_name)}
    batch_id_map: {batch_code: (db_id, dept_name, end_date)}
    dept_name_map: {employee_code: dept_name}  — to look up competency area
    """

    # Build dept → sorted list of (end_date, batch_code) for picking batches
    dept_batches = {}
    for code, (bid, dept, end_date) in batch_id_map.items():
        dept_batches.setdefault(dept, []).append((end_date, code))
    for dept in dept_batches:
        dept_batches[dept].sort()

    def pick_batch_id(dept, issue_date):
        candidates = [(ed, bc) for ed, bc in dept_batches.get(dept, []) if ed <= issue_date]
        batch_code = candidates[-1][1] if candidates else dept_batches.get(dept, [(None, None)])[0][1]
        if batch_code is None:
            # absolute fallback: any batch
            any_code = next(iter(batch_id_map))
            return batch_id_map[any_code][0]
        return batch_id_map[batch_code][0]

    cert_counters = {}

    def next_cert_no(dept, year):
        prefix = DEPT_CERT_PREFIX.get(dept, "GENL")
        yr = str(year)[2:]
        key = f"{prefix}{yr}"
        cert_counters[key] = cert_counters.get(key, 0) + 1
        return f"{key}{cert_counters[key]:03d}"

    # (employee_code, issue_date, status)
    cert_scenarios = [
        ("0300", date(2024, 3, 20), "Active"),
        ("0301", date(2024, 4, 5),  "Active"),
        ("0302", date(2024, 4, 18), "Active"),
        ("0303", date(2024, 5, 2),  "Active"),
        ("0304", date(2024, 5, 15), "Active"),
        ("0305", date(2024, 6, 3),  "Active"),
        ("0306", date(2024, 6, 17), "Active"),
        ("0307", date(2024, 7, 1),  "Active"),
        ("0308", date(2024, 7, 22), "Active"),
        ("0309", date(2024, 8, 5),  "Active"),
        ("0310", date(2024, 8, 19), "Active"),
        ("0311", date(2024, 9, 2),  "Active"),
        ("0312", date(2024, 9, 16), "Active"),
        ("0313", date(2024, 10, 7), "Active"),
        ("0314", date(2024, 10, 21),"Active"),
        ("0315", date(2024, 11, 4), "Active"),
        ("0316", date(2024, 11, 18),"Active"),
        ("0317", date(2024, 12, 2), "Active"),
        ("0318", date(2024, 12, 16),"Active"),
        ("0319", date(2025, 1, 8),  "Active"),
        ("0320", date(2025, 1, 22), "Active"),
        ("0321", date(2025, 2, 5),  "Active"),
        ("0322", date(2025, 2, 19), "Active"),
        ("0323", date(2025, 3, 5),  "Active"),
        ("0324", date(2025, 3, 19), "Active"),
        ("0325", date(2025, 4, 2),  "Active"),
        ("0326", date(2025, 4, 16), "Active"),
        ("0327", date(2025, 5, 7),  "Active"),
        ("0328", date(2025, 5, 21), "Active"),
        ("0329", date(2025, 6, 4),  "Active"),
        ("0330", date(2025, 6, 18), "Active"),
        ("0331", date(2025, 7, 2),  "Active"),
        ("0332", date(2025, 7, 16), "Active"),
        ("0333", date(2025, 7, 30), "Active"),
        ("0334", date(2025, 8, 13), "Active"),
        ("0335", date(2025, 8, 27), "Active"),
        ("0336", date(2025, 9, 10), "Active"),
        ("0337", date(2025, 9, 24), "Active"),
        ("0338", date(2025, 10, 8), "Active"),
        ("0339", date(2025, 10, 22),"Active"),
        ("0340", date(2025, 11, 5), "Active"),
        ("0341", date(2025, 11, 19),"Active"),
        ("0342", date(2025, 12, 3), "Active"),
        ("0343", date(2025, 12, 17),"Active"),
        ("0344", date(2026, 1, 7),  "Active"),
        ("0345", date(2026, 1, 21), "Active"),
        ("0346", date(2026, 2, 4),  "Active"),
        ("0347", date(2026, 2, 18), "Active"),
        ("0348", date(2026, 3, 4),  "Active"),
        ("0349", date(2026, 3, 18), "Active"),
        ("0350", date(2026, 4, 1),  "Active"),
        ("0351", date(2026, 4, 15), "Active"),
        ("0352", date(2026, 5, 6),  "Active"),
        ("0353", date(2026, 5, 20), "Active"),
    ]

    print(f"\nSeeding certificates...")
    inserted = 0
    skipped = 0

    for emp_code, issue_date, status in cert_scenarios:
        if emp_code not in emp_id_map:
            print(f"  SKIP cert for {emp_code}: employee not in DB")
            skipped += 1
            continue

        emp_db_id, dept = emp_id_map[emp_code]
        areas = DEPT_AREAS.get(dept, ["General Competency"])
        area = areas[int(emp_code) % len(areas)]

        cert_no = next_cert_no(dept, issue_date.year)
        expiry  = issue_date.replace(year=issue_date.year + 3) - timedelta(days=1)
        batch_db_id = pick_batch_id(dept, issue_date)

        cur.execute("""
            INSERT INTO "Certificates"
                ("CertificateNumber", "EmployeeId", "BatchId",
                 "IssueDate", "ExpiryDate", "Status", "CompetencyArea")
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT ("CertificateNumber") DO NOTHING
        """, (cert_no, emp_db_id, batch_db_id, issue_date, expiry, status, area))

        if cur.rowcount:
            inserted += 1

    print(f"  Inserted {inserted} new certificates ({skipped} skipped)")


# ─── MAIN ─────────────────────────────────────────────────────────────────────

def seed():
    conn = psycopg2.connect(**DB)
    cur  = conn.cursor()

    try:
        # 1. Master tables first — everything else depends on their IDs
        dept_id_map       = seed_departments(cur);  conn.commit()
        desig_id_map      = seed_designations(cur); conn.commit()
        contractor_id_map = seed_contractors(cur);  conn.commit()

        # 2. Employees — need dept/desig/contractor IDs
        employees = make_employees()
        seed_employees(cur, employees, dept_id_map, desig_id_map, contractor_id_map)
        conn.commit()

        # 3. Batches — independent of employees
        batches = make_batches()
        seed_batches(cur, batches)
        conn.commit()

        # 4. Build lookup maps for certificates
        cur.execute("""
            SELECT e."EmployeeCode", e."Id", d."Name"
            FROM "Employees" e
            JOIN "Departments" d ON d."Id" = e."DepartmentId"
        """)
        emp_id_map = {row[0]: (row[1], row[2]) for row in cur.fetchall()}

        cur.execute("""
            SELECT "BatchCode", "Id", "CourseName", "EndDate"
            FROM "Batches"
        """)
        # batch_id_map: {batch_code: (db_id, course_name, end_date)}
        # We need dept per batch — derive from code prefix
        raw_batches = cur.fetchall()

        # Rebuild dept from the make_batches list
        batch_dept_lookup = {code: dept for code, _, dept, _, _ in batches}
        batch_id_map = {}
        for code, bid, course, end_date in raw_batches:
            dept = batch_dept_lookup.get(code, "Operations")
            batch_id_map[code] = (bid, dept, end_date)

        # 5. Certificates
        seed_certificates(cur, emp_id_map, batch_id_map, {})
        conn.commit()

    except Exception as e:
        conn.rollback()
        print(f"\nFATAL: {e}")
        raise
    finally:
        # Summary
        cur.execute('SELECT COUNT(*) FROM "Departments"');  d = cur.fetchone()[0]
        cur.execute('SELECT COUNT(*) FROM "Designations"'); ds = cur.fetchone()[0]
        cur.execute('SELECT COUNT(*) FROM "Contractors"');  co = cur.fetchone()[0]
        cur.execute('SELECT COUNT(*) FROM "Employees"');    e = cur.fetchone()[0]
        cur.execute('SELECT COUNT(*) FROM "Batches"');      b = cur.fetchone()[0]
        cur.execute('SELECT COUNT(*) FROM "Certificates"'); c = cur.fetchone()[0]

        print(f"""
─────────────────────────────────────────
 DATABASE TOTALS AFTER SEEDING
─────────────────────────────────────────
 Departments  : {d}
 Designations : {ds}
 Contractors  : {co}
 Employees    : {e}
 Batches      : {b}
 Certificates : {c}
─────────────────────────────────────────
""")
        cur.close()
        conn.close()


if __name__ == "__main__":
    seed()