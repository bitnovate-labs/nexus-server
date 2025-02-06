export const taxResolvers = {
  Query: {
    taxes: async (_, __, { db, req }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      try {
        const result = await db.query(`
            SELECT 
                  t.id,
                  t.code,
                  t.name,
                  t.tax_type AS "taxType",
                  t.rate,
                  t.tax_default AS "taxDefault",
                  u1.id as "createdById",
                  u1.name as "createdByName",
                  u2.id as "lastModifiedById",
                  u2.name as "lastModifiedByName"            
              FROM taxes t
              LEFT JOIN users u1 ON t.created_by = u1.id
              LEFT JOIN users u2 ON t.last_modified_by = u2.id
              ORDER BY t.created_at DESC
          `);

        return result.rows.map((row) => ({
          ...row,
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
        throw new Error("Failed to fetch taxes");
      }
    },

    tax: async (_, { id }, { db, req }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      try {
        const result = await db.query(
          `
                SELECT 
                    t.id,
                    t.code,
                    t.name,
                    t.tax_type AS "taxType",
                    t.rate,
                    t.tax_default AS "taxDefault",
                    u1.id as "createdById",
                    u1.name as "createdByName",
                    u2.id as "lastModifiedById",
                    u2.name as "lastModifiedByName"            
                FROM taxes t
                LEFT JOIN users u1 ON t.created_by = u1.id
                LEFT JOIN users u2 ON t.last_modified_by = u2.id
                WHERE t.id = $1
                `,
          [id]
        );

        // If no record is found, return null
        const row = result.rows[0];
        if (!row) return null;

        // Return the memo with createdBy and lastModifiedBy transformed
        return {
          ...row,
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
        throw new Error("Failed to fetch tax");
      }
    },
  },

  Mutation: {
    createTax: async (_, args, { req, db }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      const { code, name, taxType, rate, taxDefault } = args;

      // Validate required fields
      if (!code || !name || !taxType || !rate || taxDefault === undefined) {
        throw new UserInputError("Missing required fields");
      }

      try {
        const result = await db.query(
          `
                INSERT INTO taxes (
                    code,
                    name,
                    tax_type,
                    rate,
                    tax_default,
                    created_by,
                    last_modified_by
                ) VALUES ($1, $2, $3, $4, $5, $6, $6)
                RETURNING 
                  id,
                  code,
                  name,
                  tax_type AS "taxType",
                  rate,
                  tax_default AS "taxDefault",
                  created_by AS "createdById",
                  last_modified_by AS "lastModifiedById"
                `,
          [code, name, taxType, rate, taxDefault, req.user.id]
        );

        const createdTax = result.rows[0];

        if (!createdTax) {
          throw new Error("Failed to create tax");
        }

        // Fetch user details for createdBy field
        const userResult = await db.query(
          `SELECT id, name FROM users WHERE id = $1`,
          [req.user.id]
        );

        const createdBy = userResult.rows[0];

        return {
          ...createdTax,
          createdBy,
          lastModifiedBy: createdBy,
        };
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to create tax: " + error.message);
      }
    },

    updateTax: async (_, args, { req, db }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      const { id, code, name, taxType, rate, taxDefault } = args;

      try {
        const result = await db.query(
          `
                UPDATE taxes
                SET
                    code  = COALESCE($2, code),
                    name  = COALESCE($3, name),
                    tax_type  = COALESCE($4, tax_type),
                    rate  = COALESCE($5, rate),
                    tax_default  = COALESCE($6, tax_default),
                    last_modified_by = $7
                WHERE id = $1
                RETURNING 
                    id,
                    code,
                    name,
                    tax_type AS "taxType",
                    rate,
                    tax_default AS "taxDefault",
                    created_by AS "createdById",
                    last_modified_by AS "lastModifiedById"
                `,
          [id, code, name, taxType, rate, taxDefault, req.user.id]
        );

        if (result.rows.length === 0) {
          throw new Error("Tax not found");
        }

        const tax = result.rows[0];

        // Return the updated tax
        return {
          id: tax.id,
          code: tax.code,
          name: tax.name,
          taxType: tax.taxType,
          rate: tax.rate,
          taxDefault: tax.taxDefault,
          createdBy: {
            id: tax.createdById,
            name: req.user.name || "Unknown User",
          },
          lastModifiedBy: {
            id: tax.lastModifiedById,
            name: req.user.name,
          },
        };
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to update tax");
      }
    },

    deleteTaxes: async (_, { ids }, { req, db }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      if (!Array.isArray(ids) || ids.length === 0) {
        throw new UserInputError("At least one ID must be provided");
      }

      try {
        const result = await db.query("DELETE FROM taxes WHERE id = ANY($1)", [
          ids,
        ]);

        return result.rowCount > 0;
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to delete taxes");
      }
    },
  },
};
