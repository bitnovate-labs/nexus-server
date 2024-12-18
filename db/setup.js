import { db } from "../db.js";
import bcrypt from "bcryptjs";

const initializeDatabase = async () => {
  try {
    // Drop existing tables if they exist
    await db.query(`
      DROP TABLE IF EXISTS users CASCADE;
      DROP TABLE IF EXISTS agents CASCADE;
      DROP TABLE IF EXISTS branches CASCADE;
      DROP TABLE IF EXISTS designations CASCADE;
      DROP TABLE IF EXISTS banks CASCADE;
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
      DROP TABLE IF EXISTS images CASCADE;
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

    // Insert default user roles
    const defaultUserRoles = [
      { code: "ADMIN", name: "Administrator", active: true },
      { code: "MANAGER", name: "Manager", active: true },
      { code: "USER", name: "User", active: true },
    ];

    for (const role of defaultUserRoles) {
      await db.query(
        `INSERT INTO user_roles (code, name, active) VALUES ($1, $2, $3)`,
        [role.code, role.name, role.active]
      );
    }

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

    // Insert default branches
    const defaultBranches = [
      { name: "Kuala Lumpur", maxAgents: 100, active: true },
    ];

    for (const branch of defaultBranches) {
      await db.query(
        `INSERT INTO branches (name, max_agents, active) VALUES ($1, $2, $3)`,
        [branch.name, branch.maxAgents, branch.active]
      );
    }

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

    // Insert default designations
    const defaultDesignations = [
      { name: "Negotiator", rank: 1, active: true },
      { name: "Pre Leader", rank: 2, active: true },
      { name: "Team Leader", rank: 3, active: true },
      { name: "Senior Leader", rank: 4, active: true },
      { name: "Vice President", rank: 5, active: true },
      { name: "Management", rank: 6, active: true },
    ];

    for (const designation of defaultDesignations) {
      await db.query(
        `INSERT INTO designations (name, rank, active) VALUES ($1, $2, $3)`,
        [designation.name, designation.rank, designation.active]
      );
    }

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
        leader VARCHAR(255),
        recruiter VARCHAR(255),
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
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
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

    // Create projects table
    await db.query(`
      CREATE TABLE projects (
        id SERIAL PRIMARY KEY,
        company VARCHAR(255) NOT NULL,
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
        commission_type VARCHAR(50) NOT NULL CHECK (commission_type IN ('percentage', 'RM')),
        commission_value INTEGER NOT NULL,
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
        commission_scheme_id INTEGER REFERENCES project_commission_schemes(id) NOT NULL,
        sales_commission_type VARCHAR(50) NOT NULL CHECK (
          sales_commission_type IN ('project_overriding', 'upline_overriding')
        ),
        designation_id INTEGER REFERENCES designations(id),
        commission_type VARCHAR(50) NOT NULL CHECK (commission_type IN ('percentage', 'RM')),
        commission_value INTEGER NOT NULL,
        overriding BOOLEAN DEFAULT false,
        schedule_payment_type VARCHAR(50) CHECK (schedule_payment_type IN ('percentage', 'RM')),
        schedule_payment_value INTEGER,
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
        commission_scheme_id INTEGER REFERENCES project_commission_schemes(id) NOT NULL,
        from_date DATE NOT NULL,
        to_date DATE NOT NULL,
        commission_type VARCHAR(50) NOT NULL DEFAULT 'none' CHECK (
          commission_type IN ('none', 'project_manager_overriding')
        ),
        agent_id INTEGER REFERENCES agents(id) NOT NULL,
        commission_value_type VARCHAR(50) NOT NULL CHECK (commission_type IN ('percentage', 'RM')),
        commission_value INTEGER NOT NULL,
        overriding BOOLEAN NOT NULL,
        schedule_payment_type VARCHAR(50) CHECK (schedule_payment_type IN ('percentage', 'RM')),
        schedule_payment_value INTEGER,
        created_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        last_modified_by INTEGER REFERENCES users(id),
        last_modified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create project packages table
    await db.query(`
      CREATE TABLE project_packages (
        id SERIAL PRIMARY KEY,
        project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
        package_name VARCHAR(255) NOT NULL,
        date_from DATE NOT NULL,
        date_to DATE NOT NULL,
        deduct_from VARCHAR(50) NOT NULL DEFAULT 'none' CHECK (
          deduct_from IN ('none', 'gross', 'nett')
        ),
        amount_type VARCHAR(50) NOT NULL CHECK (amount_type IN ('percentage', 'RM')),
        amount_value INTEGER NOT NULL,
        deduct_type VARCHAR(50) NOT NULL DEFAULT 'none' CHECK (
          deduct_type IN ('none', 'rebate', 'discount')
        ),
        display_sequence INTEGER NOT NULL,
        created_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        last_modified_by INTEGER REFERENCES users(id),
        last_modified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

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

    console.log("Database initialized successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error initializing database:", error);
    process.exit(1);
  }
};

initializeDatabase();
