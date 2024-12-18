import { finished } from "stream/promises";

const validateRequiredFields = (args) => {
  const requiredFields = [
    { field: "name", message: "Name is required" },
    { field: "displayName", message: "Display name is required" },
    { field: "email", message: "Email is required" },
    { field: "mobile", message: "Mobile number is required" },
    { field: "branch", message: "Branch is required" },
    { field: "designation", message: "Designation is required" },
    { field: "joinDate", message: "Join date is required" },
  ];

  for (const { field, message } of requiredFields) {
    if (!args[field]) {
      throw new Error(message);
    }
  }
};

const getEntityId = async (db, tableName, name, defaultName = null) => {
  const entityName = name || defaultName;
  if (!entityName) return null;

  const result = await db.query(`SELECT id FROM ${tableName} WHERE name = $1`, [
    entityName,
  ]);

  if (!result.rows[0]) {
    throw new Error(`Invalid ${tableName.slice(0, -1)}: ${entityName}`);
  }

  return result.rows[0].id;
};

export const agentResolvers = {
  Query: {
    agents: async (_, __, { db, req }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      try {
        const result = await db.query(`
          SELECT 
            a.id,
            a.name,
            a.display_name as "displayName",
            a.nric_passport as "nricPassport",
            a.email,
            a.mobile,
            a.address,
            a.payee_name as "payeeName",
            a.payee_nric as "payeeNric",
            a.payee_nric_type as "payeeNricType",
            a.bank,
            a.bank_account_no as "bankAccountNo",
            a.swift_code as "swiftCode",
            a.ren_no as "renNo",
            a.ren_license as "renLicense",
            TO_CHAR(a.ren_expired_date, 'YYYY-MM-DD') as "renExpiredDate",
            b.name as branch,
            a.leader,
            a.recruiter,
            d.name as designation,
            a.commission_percentage as "commissionPercentage",
            TO_CHAR(a.join_date, 'YYYY-MM-DD') as "joinDate",
            TO_CHAR(a.resign_date, 'YYYY-MM-DD') as "resignDate",
            a.income_tax_no as "incomeTaxNo",
            a.withholding_tax as "withholdingTax",
            a.leaderboard,
            a.active,
            a.remark,
            a.avatar_id,
            CASE 
              WHEN i.data IS NOT NULL THEN 
                concat('data:', i.mime_type, ';base64,', encode(i.data, 'base64'))
              ELSE NULL 
            END as "avatarUrl"
          FROM agents a
          LEFT JOIN branches b ON a.branch_id = b.id
          LEFT JOIN designations d ON a.designation_id = d.id
          LEFT JOIN images i ON a.avatar_id = i.id
          ORDER BY a.name ASC
        `);

        if (!result.rows) {
          throw new Error("No data returned from query");
        }

        return result.rows;
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to fetch agents");
      }
    },

    agent: async (_, { id }, { db, req }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      try {
        const result = await db.query(
          `
          SELECT 
            a.id,
            a.name,
            a.display_name as "displayName",
            a.nric_passport as "nricPassport",
            a.email,
            a.mobile,
            a.address,
            a.payee_name as "payeeName",
            a.payee_nric as "payeeNric",
            a.payee_nric_type as "payeeNricType",
            a.bank,
            a.bank_account_no as "bankAccountNo",
            a.swift_code as "swiftCode",
            a.ren_no as "renNo",
            a.ren_license as "renLicense",
            TO_CHAR(a.ren_expired_date, 'YYYY-MM-DD') as "renExpiredDate",
            b.name as branch,
            a.leader,
            a.recruiter,
            d.name as designation,
            a.commission_percentage as "commissionPercentage",
            TO_CHAR(a.join_date, 'YYYY-MM-DD') as "joinDate",
            TO_CHAR(a.resign_date, 'YYYY-MM-DD') as "resignDate",
            a.income_tax_no as "incomeTaxNo",
            a.withholding_tax as "withholdingTax",
            a.leaderboard,
            a.active,
            a.remark,
            a.avatar_id,
            CASE 
              WHEN i.data IS NOT NULL THEN 
                concat('data:', i.mime_type, ';base64,', encode(i.data, 'base64'))
              ELSE NULL 
            END as "avatarUrl"
          FROM agents a
          LEFT JOIN branches b ON a.branch_id = b.id
          LEFT JOIN designations d ON a.designation_id = d.id
          LEFT JOIN images i ON a.avatar_id = i.id
          WHERE a.id = $1
        `,
          [id]
        );

        if (!result.rows[0]) {
          throw new Error("Agent not found");
        }

        return result.rows[0];
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to fetch agent");
      }
    },
  },

  Mutation: {
    uploadAgentAvatar: async (_, { id, file }, { db, req }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      try {
        const { createReadStream, filename, mimetype } = await file;
        const stream = createReadStream();

        // Read file into buffer
        const chunks = [];
        for await (const chunk of stream) {
          chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);

        // Start a transaction
        await db.query("BEGIN");

        try {
          // Insert image into images table
          const imageResult = await db.query(
            `INSERT INTO images (data, mime_type, filename)
             VALUES ($1, $2, $3)
             RETURNING id`,
            [buffer, mimetype, filename]
          );

          // Update agent's avatar_id
          const result = await db.query(
            `
            UPDATE agents 
            SET avatar_id = $1
            WHERE id = $2
            RETURNING 
              id, 
              name,
              (
                SELECT concat('data:', mime_type, ';base64,', encode(data, 'base64'))
                FROM images 
                WHERE id = $1
              ) as "avatarUrl"`,
            [imageResult.rows[0].id, id]
          );

          if (!result.rows[0]) {
            throw new Error("Agent not found");
          }

          await db.query("COMMIT");
          return result.rows[0];
        } catch (error) {
          await db.query("ROLLBACK");
          throw error;
        }
      } catch (error) {
        console.error("Upload error:", error);
        throw new Error("Failed to upload avatar");
      }
    },

    createAgent: async (_, args, { req, db }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      validateRequiredFields(args);

      try {
        // Get branch_id and designation_id
        const branchId = await getEntityId(
          db,
          "branches",
          args.branch,
          "Kuala Lumpur"
        );
        const designationId = await getEntityId(
          db,
          "designations",
          args.designation,
          "Agent"
        );

        if (!branchId || !designationId) {
          throw new Error("Invalid branch or designation");
        }

        // Start transaction
        await db.query("BEGIN");

        try {
          const result = await db.query(
            `
            WITH inserted_agent AS (
              INSERT INTO agents (
                name, display_name, nric_passport, email, mobile, address,
                payee_name, payee_nric, payee_nric_type, bank, bank_account_no, swift_code,
                ren_no, ren_license, ren_expired_date,
                branch_id, leader, recruiter, designation_id, commission_percentage,
                join_date, resign_date, income_tax_no, withholding_tax, leaderboard,
                active, remark
              ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, 
                $15::date, $16, $17, $18, $19, $20, $21::date, $22::date,
                $23, $24, $25, $26, $27
              )
              RETURNING *
            )
            SELECT 
              a.*,
              b.name as branch,
              d.name as designation,
              CASE 
                WHEN i.data IS NOT NULL THEN 
                  concat('data:', i.mime_type, ';base64,', encode(i.data, 'base64'))
                ELSE NULL 
              END as "avatarUrl"
            FROM inserted_agent a
            LEFT JOIN branches b ON a.branch_id = b.id
            LEFT JOIN designations d ON a.designation_id = d.id
            LEFT JOIN images i ON a.avatar_id = i.id`,
            [
              args.name,
              args.displayName,
              args.nricPassport,
              args.email,
              args.mobile,
              args.address,
              args.payeeName,
              args.payeeNric,
              args.payeeNricType,
              args.bank,
              args.bankAccountNo,
              args.swiftCode,
              args.renNo,
              args.renLicense,
              args.renExpiredDate,
              branchId,
              args.leader,
              args.recruiter,
              designationId,
              args.commissionPercentage || 70,
              args.joinDate,
              args.resignDate,
              args.incomeTaxNo,
              args.withholdingTax ?? false,
              args.leaderboard ?? false,
              args.active ?? true,
              args.remark,
            ]
          );

          if (!result.rows[0]) {
            throw new Error("Failed to create agent");
          }

          await db.query("COMMIT");
          return result.rows[0];
        } catch (error) {
          await db.query("ROLLBACK");
          throw error;
        }
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to create agent: " + error.message);
      }
    },

    updateAgent: async (_, { id, ...args }, { req, db }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      try {
        // Get branch_id and designation_id if provided
        const branchId = args.branch
          ? await getEntityId(db, "branches", args.branch)
          : null;
        const designationId = args.designation
          ? await getEntityId(db, "designations", args.designation)
          : null;

        // Start transaction
        await db.query("BEGIN");

        try {
          const result = await db.query(
            `
            WITH updated_agent AS (
              UPDATE agents
              SET
                name = COALESCE($1, name),
                display_name = COALESCE($2, display_name),
                nric_passport = $3,
                email = COALESCE($4, email),
                mobile = COALESCE($5, mobile),
                address = $6,
                payee_name = $7,
                payee_nric = $8,
                payee_nric_type = $9,
                bank = $10,
                bank_account_no = $11,
                swift_code = $12,
                ren_no = $13,
                ren_license = $14,
                ren_expired_date = $15::date,
                branch_id = COALESCE($16, branch_id),
                leader = $17,
                recruiter = $18,
                designation_id = COALESCE($19, designation_id),
                commission_percentage = $20,
                join_date = COALESCE($21::date, join_date),
                resign_date = $22::date,
                income_tax_no = $23,
                withholding_tax = COALESCE($24, withholding_tax),
                leaderboard = COALESCE($25, leaderboard),
                active = COALESCE($26, active),
                remark = $27
              WHERE id = $28
              RETURNING id
            )
            SELECT 
              a.*,
              b.name as branch,
              d.name as designation,
              CASE 
                WHEN i.data IS NOT NULL THEN 
                  concat('data:', i.mime_type, ';base64,', encode(i.data, 'base64'))
                ELSE NULL 
              END as "avatarUrl"
            FROM updated_agent ua
            JOIN agents a ON a.id = ua.id
            LEFT JOIN branches b ON a.branch_id = b.id
            LEFT JOIN designations d ON a.designation_id = d.id
            LEFT JOIN images i ON a.avatar_id = i.id`,
            [
              args.name,
              args.displayName,
              args.nricPassport,
              args.email,
              args.mobile,
              args.address,
              args.payeeName,
              args.payeeNric,
              args.payeeNricType,
              args.bank,
              args.bankAccountNo,
              args.swiftCode,
              args.renNo,
              args.renLicense,
              args.renExpiredDate,
              branchId,
              args.leader,
              args.recruiter,
              designationId,
              args.commissionPercentage,
              args.joinDate,
              args.resignDate,
              args.incomeTaxNo,
              args.withholdingTax,
              args.leaderboard,
              args.active,
              args.remark,
              id,
            ]
          );

          if (!result.rows[0]) {
            throw new Error("Agent not found");
          }

          await db.query("COMMIT");
          return result.rows[0];
        } catch (error) {
          await db.query("ROLLBACK");
          throw error;
        }
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to update agent: " + error.message);
      }
    },

    deleteAgents: async (_, { ids }, { req, db }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      try {
        const result = await db.query(
          "DELETE FROM agents WHERE id = ANY($1) RETURNING id",
          [ids]
        );
        return result.rowCount > 0;
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to delete agents");
      }
    },
  },
};
