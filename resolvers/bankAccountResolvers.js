export const bankAccountResolvers = {
  Query: {
    bankAccounts: async (_, __, { db, req }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      try {
        const result = await db.query(`
              SELECT 
                ba.id,
                ba.company_id AS "companyId",
                c.name AS "companyName",
                ba.bank_id AS "bankId",  
                b.name AS "bankName",  
                ba.name,
                ba.bank_account_no AS "bankAccountNo",
                ba.bank_account_type AS "bankAccountType",
                ba.payment,
                ba.receipt,
                u1.id as "createdById",
                u1.name as "createdByName",
                u2.id as "lastModifiedById",
                u2.name as "lastModifiedByName"            
            FROM bank_accounts ba
            LEFT JOIN users u1 ON ba.created_by = u1.id
            LEFT JOIN users u2 ON ba.last_modified_by = u2.id
            LEFT JOIN companies c ON ba.company_id = c.id   
            LEFT JOIN banks b ON ba.bank_id = b.id
            ORDER BY ba.created_at DESC
        `);

        return result.rows.map((row) => ({
          ...row,
          company: row.companyId
            ? { id: row.companyId, name: row.companyName }
            : null,
          bank: row.bankId ? { id: row.bankId, name: row.bankName } : null,
          createdBy: row.createdById
            ? {
                id: row.createdById,
                name: row.createdByName,
              }
            : null,
          lastModifiedBy: row.lastModifiedById
            ? {
                id: row.lastModifiedById,
                name: row.lastModifiedByName,
              }
            : null,
        }));
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to fetch bank accounts");
      }
    },

    bankAccount: async (_, { id }, { db, req }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      try {
        const result = await db.query(
          `
                SELECT 
                ba.id,
                ba.company_id AS "companyId",
                c.name AS "companyName",
                ba.bank_id AS "bankId",  
                b.name AS "bankName",  
                ba.name,
                ba.bank_account_no AS "bankAccountNo",
                ba.bank_account_type AS "bankAccountType",
                ba.payment,
                ba.receipt,
                u1.id as "createdById",
                u1.name as "createdByName",
                u2.id as "lastModifiedById",
                u2.name as "lastModifiedByName"            
              FROM bank_accounts ba
              LEFT JOIN users u1 ON ba.created_by = u1.id
              LEFT JOIN users u2 ON ba.last_modified_by = u2.id
              LEFT JOIN companies c ON ba.company_id = c.id
              LEFT JOIN banks b ON ba.bank_id = b.id
              WHERE ba.id = $1
              `,
          [id]
        );

        // If no record is found, return null
        const row = result.rows[0];
        if (!row) return null;

        // Return the memo with createdBy and lastModifiedBy transformed
        return {
          ...row,
          company: row.companyId
            ? { id: row.companyId, name: row.companyName }
            : null,
          bank: row.bankId ? { id: row.bankId, name: row.bankName } : null,
          createdBy: row.createdById
            ? {
                id: row.createdById,
                name: row.createdByName,
              }
            : null,
          lastModifiedBy: row.lastModifiedById
            ? {
                id: row.lastModifiedById,
                name: row.lastModifiedByName,
              }
            : null,
        };
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to fetch bank account");
      }
    },
  },

  Mutation: {
    createBankAccount: async (_, args, { req, db }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      const {
        companyId,
        bankId,
        name,
        bankAccountNo,
        bankAccountType,
        payment,
        receipt,
      } = args;

      // Validate required fields
      if (
        !companyId ||
        !bankId ||
        !name ||
        !bankAccountType ||
        payment === undefined ||
        receipt === undefined
      ) {
        throw new UserInputError("Missing required fields");
      }

      try {
        const result = await db.query(
          `
              INSERT INTO bank_accounts (
                company_id,
                bank_id,
                name,
                bank_account_no,
                bank_account_type,
                payment,
                receipt,
                created_by,
                last_modified_by
              ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $8)
              RETURNING 
                id,
                company_id AS "companyId",
                bank_id AS "bankId",
                name,
                bank_account_no AS "bankAccountNo",
                bank_account_type AS "bankAccountType",
                payment,
                receipt,
                created_by AS "createdById",
                last_modified_by AS "lastModifiedById"
              `,
          [
            companyId,
            bankId,
            name,
            bankAccountNo,
            bankAccountType,
            payment,
            receipt,
            req.user.id,
          ]
        );

        const createdBankAccount = result.rows[0];

        if (!createdBankAccount) {
          throw new Error("Failed to create bank account");
        }

        // Fetch user details for createdBy field
        const userResult = await db.query(
          `SELECT id, name FROM users WHERE id = $1`,
          [req.user.id]
        );

        const createdBy = userResult.rows[0];

        return {
          ...createdBankAccount,
          createdBy,
          lastModifiedBy: createdBy,
        };
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to create bank account: " + error.message);
      }
    },

    updateBankAccount: async (_, args, { req, db }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      const {
        id,
        companyId,
        bankId,
        name,
        bankAccountNo,
        bankAccountType,
        payment,
        receipt,
      } = args;

      try {
        const result = await db.query(
          `
              UPDATE bank_accounts
              SET
                company_id = COALESCE($2, company_id),
                bank_id = COALESCE($3, bank_id),
                name = COALESCE($4, name),
                bank_account_no = COALESCE($5, bank_account_no),
                bank_account_type = COALESCE($6, bank_account_type),
                payment = COALESCE($7, payment),
                receipt = COALESCE($8, receipt),
                last_modified_by = $9
              WHERE id = $1
              RETURNING 
                id,
                company_id AS "companyId",
                bank_id AS "bankId",
                name,
                bank_account_no AS "bankAccountNo",
                bank_account_type AS "bankAccountType",
                payment,
                receipt,
                created_by AS "createdById",
                last_modified_by AS "lastModifiedById"
              `,
          [
            id,
            companyId,
            bankId,
            name,
            bankAccountNo,
            bankAccountType,
            payment,
            receipt,
            req.user.id,
          ]
        );

        if (result.rows.length === 0) {
          throw new Error("Bank Account not found");
        }

        const bankAccount = result.rows[0];

        // Fetch company and bank details if needed
        const company = bankAccount.companyId
          ? await db
              .query(`SELECT id, name FROM companies WHERE id = $1`, [
                bankAccount.companyId,
              ])
              .then((res) => res.rows[0])
          : null;

        const bank = bankAccount.bankId
          ? await db
              .query(`SELECT id, name FROM banks WHERE id = $1`, [
                bankAccount.bankId,
              ])
              .then((res) => res.rows[0])
          : null;

        // Return the updated bank account
        return {
          id: bankAccount.id,
          company: company ? { id: company.id, name: company.name } : null,
          bank: bank ? { id: bank.id, name: bank.name } : null,
          name: bankAccount.name,
          bankAccountNo: bankAccount.bankAccountNo,
          bankAccountType: bankAccount.bankAccountType,
          payment: bankAccount.payment,
          receipt: bankAccount.receipt,
          createdBy: {
            id: bankAccount.createdById,
            name: req.user.name || "Unknown User",
          },
          lastModifiedBy: {
            id: bankAccount.lastModifiedById,
            name: req.user.name,
          },
        };
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to update bank account");
      }
    },

    deleteBankAccounts: async (_, { ids }, { req, db }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      if (!Array.isArray(ids) || ids.length === 0) {
        throw new UserInputError("At least one ID must be provided");
      }

      try {
        const result = await db.query(
          "DELETE FROM bank_accounts WHERE id = ANY($1)",
          [ids]
        );

        return result.rowCount > 0;
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to delete bank accounts");
      }
    },
  },
};
