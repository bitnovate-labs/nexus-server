import { db } from "./db.js";
import fs from "fs";

const loadMockData = async () => {
  try {
    // Read and parse the categorized mock data
    // const mockData = JSON.parse(fs.readFileSync("./mock_data.json", "utf-8"));
    const mockData = JSON.parse(fs.readFileSync("./agent_data.json", "utf-8"));

    console.log("Loading categorized mock data into the database...");

    // Load agents
    if (mockData.agents) {
      for (const agent of mockData.agents) {
        await db.query(
          `INSERT INTO agents (
                name,
                display_name,
                nric_passport,
                email,
                mobile,
                address,
                payee_name,
                payee_nric,
                payee_nric_type,
                bank,
                swift_code,
                ren_no,
                ren_license,
                ren_expired_date,
                bank_account_no,
                branch_id,
                leader_id,
                recruiter_id,
                designation_id,
                commission_percentage,
                join_date,
                resign_date,
                income_tax_no,
                withholding_tax,
                leaderboard,
                active,
                remark
              ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27)`,
          [
            agent.name,
            agent.display_name,
            agent.nric_passport,
            agent.email,
            agent.mobile,
            agent.address,
            agent.payee_name,
            agent.payee_nric,
            agent.payee_nric_type,
            agent.bank,
            agent.swift_code,
            agent.ren_no,
            agent.ren_license,
            agent.ren_expired_date,
            agent.bank_account_no,
            agent.branch_id,
            // agent.leader_id,
            null,
            // agent.recruiter_id,
            null,
            agent.designation_id,
            agent.commission_percentage,
            agent.join_date,
            agent.resign_date,
            agent.income_tax_no,
            agent.withholding_tax,
            agent.leaderboard,
            agent.active,
            agent.remark,
          ]
        );
      }

      // Second pass: Update agents with their leader_ids
      for (const agent of mockData.agents) {
        if (agent.leader_id) {
          await db.query(
            `UPDATE agents
             SET leader_id = $1,
                 recruiter_id = $2
             WHERE nric_passport = $3`,
            [agent.leader_id, agent.recruiter_id, agent.nric_passport]
          );
        }
      }

      console.log("Agents loaded successfully.");
    }

    // // Load banks
    // if (mockData.banks) {
    //   for (const bank of mockData.banks) {
    //     await db.query(
    //       `INSERT INTO banks (name, swift_code, active) VALUES ($1, $2, $3)`,
    //       [bank.name, bank.swift_code, bank.active]
    //     );
    //   }
    //   console.log("Banks loaded successfully.");
    // }
    // // Load branches
    // if (mockData.branches) {
    //   for (const branch of mockData.branches) {
    //     await db.query(
    //       `INSERT INTO branches (name, max_agents, active) VALUES ($1, $2, $3)`,
    //       [branch.name, branch.maxAgents, branch.active]
    //     );
    //   }
    //   console.log("Branches loaded successfully.");
    // }
    // // Load companies
    // if (mockData.companies) {
    //   for (const company of mockData.companies) {
    //     await db.query(
    //       `INSERT INTO companies (
    //           name,
    //           display_name,
    //           registration_no,
    //           license_no,
    //           income_tax_no,
    //           address,
    //           contact_no,
    //           fax,
    //           email,
    //           website,
    //           sst,
    //           sst_no,
    //           person_in_charge,
    //           person_in_charge_nric,
    //           person_in_charge_designation,
    //           created_by,
    //           last_modified_by
    //         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $16)`,
    //       [
    //         company.name,
    //         company.displayName || company.name, // Fallback to name if displayName is not provided
    //         company.registrationNo || null,
    //         company.licenseNo || null,
    //         company.incomeTaxNo || null,
    //         company.address || null,
    //         company.contactNo || null,
    //         company.fax || null,
    //         company.email || null,
    //         company.website || null,
    //         company.sst || false,
    //         company.sstNo || null,
    //         company.personInCharge || null,
    //         company.personInChargeNric || null,
    //         company.personInChargeDesignation || null,
    //         company.createdBy || null,
    //       ]
    //     );
    //   }
    //   console.log("Companies loaded successfully.");
    // }
    // // Load designations
    // if (mockData.designations) {
    //   for (const designation of mockData.designations) {
    //     await db.query(
    //       `INSERT INTO designations (name, rank, active) VALUES ($1, $2, $3)`,
    //       [designation.name, designation.rank, designation.active]
    //     );
    //   }
    //   console.log("Designations loaded successfully.");
    // }
    // // Load developers
    // if (mockData.developers) {
    //   for (const developer of mockData.developers) {
    //     await db.query(
    //       `INSERT INTO developers (name, registration_no, address, contact_person, contact_no) VALUES ($1, $2, $3, $4, $5)`,
    //       [
    //         developer.name,
    //         developer.registration_no,
    //         developer.address,
    //         developer.contact_person,
    //         developer.contact_no,
    //       ]
    //     );
    //   }
    //   console.log("Developers loaded successfully.");
    // }
    // // Load sales stages
    // if (mockData.sales_stages) {
    //   for (const salesStage of mockData.sales_stages) {
    //     await db.query(
    //       `INSERT INTO sales_stages (sales_type, name, level, active) VALUES ($1, $2, $3, $4)`,
    //       [
    //         salesStage.sales_type,
    //         salesStage.name,
    //         salesStage.level,
    //         salesStage.active,
    //       ]
    //     );
    //   }
    //   console.log("Sales stages loaded successfully.");
    // }
    // // Load states
    // if (mockData.states) {
    //   for (const state of mockData.states) {
    //     await db.query(
    //       `INSERT INTO states (name, code, country) VALUES ($1, $2, $3)`,
    //       [state.name, state.code, state.country]
    //     );
    //   }
    //   console.log("States loaded successfully.");
    // }
    // // Load projects
    // if (mockData.projects) {
    //   for (const project of mockData.projects) {
    //     await db.query(
    //       `INSERT INTO projects (company_id, name, developer_id, developer_pay_tax, state_id, description, active) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    //       [
    //         project.company_id,
    //         project.name,
    //         project.developer_id,
    //         project.developer_pay_tax,
    //         project.state_id,
    //         project.description,
    //         project.active,
    //       ]
    //     );
    //   }
    //   console.log("Projects loaded successfully.");
    // }
    // // Load taxes
    // if (mockData.taxes) {
    //   for (const tax of mockData.taxes) {
    //     await db.query(
    //       `INSERT INTO taxes (code, name, tax_type, rate, tax_default, created_by, last_modified_by) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    //       [
    //         tax.code,
    //         tax.name,
    //         tax.tax_type,
    //         tax.rate,
    //         tax.tax_default,
    //         tax.created_by,
    //         tax.last_modified_by,
    //       ]
    //     );
    //   }
    //   console.log("Taxes loaded successfully.");
    // }
    console.log("All mock data loaded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error loading mock data:", error);
    process.exit(1);
  }
};

loadMockData();
