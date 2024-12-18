import { db } from "./db.js";
import fs from "fs";

const loadMockData = async () => {
  try {
    // Read and parse the categorized mock data
    const mockData = JSON.parse(fs.readFileSync("./mock_data.json", "utf-8"));

    console.log("Loading categorized mock data into the database...");

    // Load agents
    if (mockData.agents) {
      for (const agent of mockData.agents) {
        await db.query(
          `INSERT INTO agents (name, display_name, nric_passport, email, mobile, address, payee_name, payee_nric, payee_nric_type, ren_no, ren_license, ren_expired_date, bank_account_no, commission_percentage, join_date, resign_date, income_tax_no, withholding_tax, leaderboard, active, remark) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)`,
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
            agent.ren_no,
            agent.ren_license,
            agent.ren_expired_date,
            agent.bank_account_no,
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
      console.log("Developers loaded successfully.");
    }

    // Load developers
    if (mockData.developers) {
      for (const developer of mockData.developers) {
        await db.query(
          `INSERT INTO developers (name, registration_no, address, contact_person, contact_no) VALUES ($1, $2, $3, $4, $5)`,
          [
            developer.name,
            developer.registration_no,
            developer.address,
            developer.contact_person,
            developer.contact_no,
          ]
        );
      }
      console.log("Developers loaded successfully.");
    }

    // Load projects
    if (mockData.projects) {
      for (const project of mockData.projects) {
        await db.query(
          `INSERT INTO projects (company, name, developer_pay_tax, description, active) VALUES ($1, $2, $3, $4, $5)`,
          [
            project.company,
            project.name,
            project.developer_pay_tax,
            project.description,
            project.active,
          ]
        );
      }
      console.log("Projects loaded successfully.");
    }

    // Load states
    if (mockData.states) {
      for (const state of mockData.states) {
        await db.query(
          `INSERT INTO states (name, code, country) VALUES ($1, $2, $3)`,
          [state.name, state.code, state.country]
        );
      }
      console.log("States loaded successfully.");
    }

    // Load banks
    if (mockData.banks) {
      for (const bank of mockData.banks) {
        await db.query(
          `INSERT INTO banks (name, swift_code, active) VALUES ($1, $2, $3)`,
          [bank.name, bank.swift_code, bank.active]
        );
      }
      console.log("States loaded successfully.");
    }

    console.log("All mock data loaded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error loading mock data:", error);
    process.exit(1);
  }
};

loadMockData();
