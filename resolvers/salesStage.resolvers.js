export const salesStageResolvers = {
  Query: {
    salesStages: async (_, __, { db, req }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      try {
        const result = await db.query(
          `
            SELECT 
              s.id,
              s.sales_type AS "salesType",
              s.name,
              s.level,
              s.active
            FROM sales_stages s
            ORDER BY s.id ASC
          `
        );

        return result.rows;
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to fetch sales stages");
      }
    },

    salesStage: async (_, { id }, { db, req }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      try {
        const result = await db.query(
          `
              SELECT 
                s.id,
                s.sales_type AS "salesType",
                s.name,
                s.level,
                s.active
              FROM sales_stages s
              WHERE s.id = $1
            `,
          [id]
        );

        return result.rows[0];
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to fetch sales stage");
      }
    },
  },

  Mutation: {
    createSalesStage: async (_, args, { db, req }) => {
      if (!req.user) {
        throw new Error("Not authorized");
      }

      const { salesType, name, level, active } = args;

      try {
        const result = await db.query(
          `
              INSERT INTO sales_stages (
                sales_type,
                name, 
                level, 
                active,
                created_by,
                last_modified_by 
              )
              VALUES ($1, $2, $3, $4, $5, $5)
              RETURNING 
                id,
                sales_type AS "salesType", 
                name, 
                level, 
                active,
                created_by AS "createdBy",
                last_modified_by AS "lastModifiedBy"
            `,
          [salesType, name, level, active, req.user.id]
        );

        if (!result.rows.length) {
          throw new Error("Failed to create sales stage");
        }

        return result.rows[0];
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to create sales stage");
      }
    },

    updateSalesStage: async (_, args, { db, req }) => {
      if (!req.user) {
        throw new Error("Not authorized");
      }

      const { id, salesType, name, level, active } = args;

      try {
        const result = await db.query(
          `
                UPDATE sales_stages
                SET 
                  sales_type = COALESCE($1, sales_type),
                  name = COALESCE($2, name),
                  level = COALESCE($3, level),
                  active = COALESCE($4, active),
                  last_modified_by = $5
                WHERE id = $6
                RETURNING 
                    id, 
                    sales_type AS "salesType", 
                    name, 
                    level, 
                    active,
                    last_modified_by AS "lastModifiedBy"
              `,
          [salesType, name, level, active, req.user.id, id]
        );

        if (!result.rows.length) {
          throw new Error("Failed to update sales stage");
        }

        return result.rows[0];
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to update sales stage");
      }
    },

    deleteSalesStages: async (_, { ids }, { db, req }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      try {
        const result = await db.query(
          "DELETE FROM sales_stages WHERE id = ANY($1)",
          [ids]
        );

        return result.rowCount > 0;
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to delete sales stage");
      }
    },
  },

  SalesStage: {
    createdBy: async (parent, _, { db }) => {
      if (!parent.createdBy) {
        return null;
      }

      try {
        const result = await db.query(
          `SELECT id, name FROM users WHERE id = $1`,
          [parent.createdBy]
        );

        return result.rows[0] || null;
      } catch (error) {
        console.error("Database error (createdBy):", error);
        throw new Error("Failed to fetch createdBy user");
      }
    },

    lastModifiedBy: async (parent, _, { db }) => {
      if (!parent.lastModifiedBy) {
        return null;
      }

      try {
        const result = await db.query(
          `SELECT id, name FROM users WHERE id = $1`,
          [parent.lastModifiedBy]
        );

        return result.rows[0] || null;
      } catch (error) {
        console.error("Database error (lastModifiedBy):", error);
        throw new Error("Failed to fetch lastModifiedBy user");
      }
    },
  },
};
