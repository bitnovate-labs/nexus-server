import { db } from "../db.js";
import bcrypt from "bcryptjs";

const initializeDatabase = async () => {
  try {
    // Drop existing tables if they exist
    await db.query(`
      DROP TABLE IF EXISTS users CASCADE;
      DROP TABLE IF EXISTS agents CASCADE;
      DROP TABLE IF EXISTS companies CASCADE;
      DROP TABLE IF EXISTS branches CASCADE;
      DROP TABLE IF EXISTS designations CASCADE;
      DROP TABLE IF EXISTS banks CASCADE;
      DROP TABLE IF EXISTS bank_accounts CASCADE;
      DROP TABLE IF EXISTS developers CASCADE;
      DROP TABLE IF EXISTS states CASCADE;
      DROP TABLE IF EXISTS user_roles CASCADE;
      DROP TABLE IF EXISTS projects CASCADE;
      DROP TABLE IF EXISTS project_users CASCADE;
      DROP TABLE IF EXISTS project_unit_types CASCADE;
      DROP TABLE IF EXISTS project_attachments CASCADE;
      DROP TABLE IF EXISTS project_schedules CASCADE;
      DROP TABLE IF EXISTS project_commission_schemes CASCADE;
      DROP TABLE IF EXISTS agent_commissions CASCADE;
      DROP TABLE IF EXISTS project_manager_commissions CASCADE;
      DROP TABLE IF EXISTS project_packages CASCADE;
      DROP TABLE IF EXISTS purchasers CASCADE;
      DROP TABLE IF EXISTS images CASCADE;
      DROP TABLE IF EXISTS events CASCADE;
      DROP TABLE IF EXISTS event_attachments CASCADE;
      DROP TABLE IF EXISTS memos CASCADE;
      DROP TABLE IF EXISTS memo_attachments CASCADE;
      DROP TABLE IF EXISTS taxes CASCADE;
      DROP TABLE IF EXISTS sales_stages CASCADE;
    `);

    // Create images table
    await db.query(`
      CREATE TABLE images (
        id SERIAL PRIMARY KEY,
        data BYTEA NOT NULL,
        mime_type VARCHAR(255) NOT NULL,
        filename VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create user_roles table first
    await db.query(`
      CREATE TABLE user_roles (
        id SERIAL PRIMARY KEY,
        code VARCHAR(50) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // ---------------------------------------------------------------------
    // Insert default user roles
    const defaultUserRoles = [
      { code: "MANAGEMENT", name: "Management", active: true },
      { code: "SENIOR_LEADER", name: "Senior Leader", active: true },
      { code: "LEADER", name: "Leader", active: true },
      { code: "PRE_LEADER", name: "Pre Leader", active: true },
      { code: "AGENT", name: "Agent", active: true },
      { code: "CREATE_SALES_ADMIN", name: "Create Sales Admin", active: true },
      { code: "ADMIN", name: "Super Admin", active: true },
    ];

    for (const role of defaultUserRoles) {
      await db.query(
        `INSERT INTO user_roles (code, name, active) VALUES ($1, $2, $3)`,
        [role.code, role.name, role.active]
      );
    }
    // ---------------------------------------------------------------------

    // Create users table with role reference
    await db.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        mobile VARCHAR(50),
        role VARCHAR(50) NOT NULL REFERENCES user_roles(code),
        active BOOLEAN DEFAULT true,
        avatar_id INTEGER REFERENCES images(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create branches table
    await db.query(`
      CREATE TABLE branches (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        max_agents INTEGER,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create designations table
    await db.query(`
      CREATE TABLE designations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        rank INTEGER NOT NULL,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create agents table
    await db.query(`
      CREATE TABLE agents (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        display_name VARCHAR(255),
        nric_passport VARCHAR(255),
        email VARCHAR(255),
        mobile VARCHAR(50),
        address TEXT,
        payee_name VARCHAR(255),
        payee_nric VARCHAR(255),
        payee_nric_type VARCHAR(50),
        bank VARCHAR(255),
        bank_account_no VARCHAR(255),
        swift_code VARCHAR(255),
        ren_no VARCHAR(255),
        ren_license VARCHAR(255),
        ren_expired_date DATE,
        branch_id INTEGER REFERENCES branches(id),
        leader_id INTEGER REFERENCES agents(id),
        recruiter_id INTEGER REFERENCES agents(id),
        designation_id INTEGER REFERENCES designations(id),
        commission_percentage DECIMAL(5,2),
        join_date DATE NOT NULL,
        resign_date DATE,
        income_tax_no VARCHAR(255),
        withholding_tax BOOLEAN DEFAULT false,
        leaderboard BOOLEAN DEFAULT false,
        active BOOLEAN DEFAULT true,
        remark TEXT,
        avatar_id INTEGER REFERENCES images(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        created_by INTEGER REFERENCES users(id),
        last_modified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        last_modified_by INTEGER REFERENCES users(id)
      );
    `);

    // Create companies table
    await db.query(`
      CREATE TABLE companies (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        display_name VARCHAR(255) NOT NULL,
        registration_no VARCHAR(255),
        license_no VARCHAR(255),
        income_tax_no VARCHAR(255),
        address TEXT NOT NULL,
        contact_no VARCHAR(50),
        fax VARCHAR(50),
        email VARCHAR(255),
        website VARCHAR(255),
        sst BOOLEAN NOT NULL DEFAULT true,
        sst_no VARCHAR(255),
        person_in_charge VARCHAR(255),
        person_in_charge_nric VARCHAR(50),
        person_in_charge_designation VARCHAR(50),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        created_by INTEGER REFERENCES users(id),
        last_modified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        last_modified_by INTEGER REFERENCES users(id)
      );  
    `);

    // Create banks table
    await db.query(`
      CREATE TABLE banks (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        swift_code VARCHAR(255),
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create bank accounts table
    await db.query(`
      CREATE TABLE bank_accounts (
        id SERIAL PRIMARY KEY,
        company_id INTEGER REFERENCES companies(id) NOT NULL,
        bank_id INTEGER REFERENCES banks(id) NOT NULL,
        name VARCHAR(255) NOT NULL UNIQUE,
        bank_account_no VARCHAR(255),
        bank_account_type VARCHAR(50) NOT NULL,
        payment BOOLEAN NOT NULL,
        receipt BOOLEAN NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        created_by INTEGER REFERENCES users(id),
        last_modified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        last_modified_by INTEGER REFERENCES users(id)
      );
    `);

    // Create developers table
    await db.query(`
      CREATE TABLE developers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        registration_no VARCHAR(255),
        address TEXT,
        contact_person VARCHAR(255),
        contact_no VARCHAR(50),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create states table
    await db.query(`
      CREATE TABLE states (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        code VARCHAR(50) NOT NULL UNIQUE,
        country VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create taxes table
    await db.query(`
      CREATE TABLE taxes (
        id SERIAL PRIMARY KEY,
        code VARCHAR(50) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        tax_type VARCHAR(50) NOT NULL,
        rate DECIMAL(5,2) NOT NULL,
        tax_default BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        created_by INTEGER REFERENCES users(id),
        last_modified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        last_modified_by INTEGER REFERENCES users(id)
      );
    `);

    // Create projects table
    await db.query(`
      CREATE TABLE projects (
        id SERIAL PRIMARY KEY,
        company_id INTEGER REFERENCES companies(id) NOT NULL,
        name VARCHAR(255) NOT NULL,
        developer_id INTEGER REFERENCES developers(id),
        developer_pay_tax BOOLEAN DEFAULT false,
        state_id INTEGER REFERENCES states(id),
        description TEXT,
        active BOOLEAN DEFAULT true,
        created_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        last_modified_by INTEGER REFERENCES users(id),
        last_modified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create project_users table for many-to-many relationship
    await db.query(`
      CREATE TABLE project_users (
        id SERIAL PRIMARY KEY,
        project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(project_id, user_id)
      );
    `);

    // Create project unit types table
    await db.query(`
      CREATE TABLE project_unit_types (
        id SERIAL PRIMARY KEY,
        project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        created_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        last_modified_by INTEGER REFERENCES users(id),
        last_modified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create project schedules table
    await db.query(`
      CREATE TABLE project_schedules (
        id SERIAL PRIMARY KEY,
        project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        sequence INTEGER NOT NULL,
        created_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        last_modified_by INTEGER REFERENCES users(id),
        last_modified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create project commission schemes table
    await db.query(`
      CREATE TABLE project_commission_schemes (
        id SERIAL PRIMARY KEY,
        project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
        unit_type_id INTEGER REFERENCES project_unit_types(id),
        from_date DATE NOT NULL,
        to_date DATE NOT NULL,
        min_unit INTEGER NOT NULL,
        max_unit INTEGER NOT NULL,
        commission_type VARCHAR(50) NOT NULL CHECK (commission_type IN ('PERCENTAGE', 'RM')),
        commission_value DECIMAL(10,2) NOT NULL,
        created_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        last_modified_by INTEGER REFERENCES users(id),
        last_modified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create agent commissions table
    await db.query(`
      CREATE TABLE agent_commissions (
        id SERIAL PRIMARY KEY,
        project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
        commission_scheme_id INTEGER REFERENCES project_commission_schemes(id),
        sales_commission_type VARCHAR(50) NOT NULL CHECK (
          sales_commission_type IN ('PROJECT_OVERRIDING', 'UPLINE_OVERRIDING')
        ),
        designation_id INTEGER REFERENCES designations(id),
        commission_type VARCHAR(50) NOT NULL CHECK (commission_type IN ('PERCENTAGE', 'RM')),
        commission_value DECIMAL(10,2) NOT NULL,
        overriding BOOLEAN DEFAULT false,
        schedule_payment_type VARCHAR(50) CHECK (schedule_payment_type IN ('PERCENTAGE', 'RM')),
        schedule_payment_value DECIMAL(10,2),
        created_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        last_modified_by INTEGER REFERENCES users(id),
        last_modified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create project manager commissions table
    await db.query(`
      CREATE TABLE project_manager_commissions (
        id SERIAL PRIMARY KEY,
        project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
        commission_scheme_id INTEGER REFERENCES project_commission_schemes(id),
        from_date DATE NOT NULL,
        to_date DATE NOT NULL,
        sales_commission_type VARCHAR(50) NOT NULL DEFAULT 'NONE' CHECK (
          sales_commission_type IN ('NONE', 'PROJECT_MANAGER_OVERRIDING')
        ),
        agent_id INTEGER REFERENCES agents(id) NOT NULL,
        commission_type VARCHAR(50) NOT NULL CHECK (commission_type IN ('PERCENTAGE', 'RM')),
        commission_value DECIMAL(10,2) NOT NULL,
        overriding BOOLEAN DEFAULT false,
        schedule_payment_type VARCHAR(50) CHECK (schedule_payment_type IN ('PERCENTAGE', 'RM')),
        schedule_payment_value DECIMAL(10,2),
        created_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        last_modified_by INTEGER REFERENCES users(id),
        last_modified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // ---------------------------------------------------------------------
    // Create default admin user
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await db.query(
      `INSERT INTO users (name, username, password, email, role, active)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        "Admin User",
        "admin",
        hashedPassword,
        "admin@example.com",
        "ADMIN",
        true,
      ]
    );
    // ---------------------------------------------------------------------

    // Create purchasers table
    await db.query(`
      CREATE TABLE purchasers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        registration_no VARCHAR(255) NOT NULL,
        address TEXT,
        contact_person VARCHAR(255),
        contact_no VARCHAR(50),
        email VARCHAR(255) UNIQUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        created_by INTEGER REFERENCES users(id),
        last_modified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        last_modified_by INTEGER REFERENCES users(id)
      );
    `);

    // Create events table
    await db.query(`
      CREATE TABLE events (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        date DATE NOT NULL,
        time TIME,
        venue VARCHAR(255),
        speaker VARCHAR(50),
        topic VARCHAR(255),
        limit_pax INTEGER,
        designation_id INTEGER REFERENCES user_roles(id),
        branch_id INTEGER REFERENCES branches(id),
        description TEXT,
        created_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        last_modified_by INTEGER REFERENCES users(id),
        last_modified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create memos table
    await db.query(`
      CREATE TABLE memos (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL,
        title VARCHAR(255) NOT NULL,
        validity_from DATE,
        validity_to DATE,
        description TEXT,
        branch_id INTEGER REFERENCES branches(id),
        designation_id INTEGER REFERENCES designations(id),
        created_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        last_modified_by INTEGER REFERENCES users(id),
        last_modified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create memo attachments table
    await db.query(`
      CREATE TABLE memo_attachments (
        id SERIAL PRIMARY KEY,
        memo_id INTEGER REFERENCES memos(id) ON DELETE CASCADE,
        filename VARCHAR(255) NOT NULL,
        content_type VARCHAR(255) NOT NULL,
        size BIGINT NOT NULL,
        url VARCHAR(255) NOT NULL,
        created_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        last_modified_by INTEGER REFERENCES users(id),
        last_modified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create sales_stages table
    await db.query(`
      CREATE TABLE sales_stages (
        id SERIAL PRIMARY KEY,
        sales_type VARCHAR(50) NOT NULL CHECK (sales_type IN ('NONE', 'SUBSALES', 'RENT', 'PROJECT')),
        name VARCHAR(255) NOT NULL,
        level INTEGER NOT NULL,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        created_by INTEGER REFERENCES users(id),
        last_modified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        last_modified_by INTEGER REFERENCES users(id)
      );
    `);

    console.log("Database initialized successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error initializing database:", error);
    process.exit(1);
  }
};

initializeDatabase();
