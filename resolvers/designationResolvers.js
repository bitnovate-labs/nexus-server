export const designationResolvers = {
  Query: {
    designations: async (_, __, { db, req }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      try {
        const result = await db.query(`
          SELECT id, name, rank, active
          FROM designations
          ORDER BY rank ASC
        `);
        return result.rows;
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to fetch designations");
      }
    },

    designation: async (_, { id }, { db, req }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      try {
        const result = await db.query(
          `
          SELECT id, name, rank, active
          FROM designations
          WHERE id = $1
        `,
          [id]
        );
        return result.rows[0];
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to fetch designation");
      }
    },
  },

  Mutation: {
    createDesignation: async (_, { name, rank, active }, { db, req }) => {
      if (!req.user || req.user.role !== "ADMIN") {
        throw new Error("Not authorized");
      }

      try {
        const result = await db.query(
          `
          INSERT INTO designations (name, rank, active)
          VALUES ($1, $2, $3)
          RETURNING id, name, rank, active
        `,
          [name, rank, active]
        );
        return result.rows[0];
      } catch (error) {
        if (error.code === "23505") {
          // Unique violation
          throw new Error("Designation name already exists");
        }
        console.error("Database error:", error);
        throw new Error("Failed to create designation");
      }
    },

    updateDesignation: async (_, { id, name, rank, active }, { db, req }) => {
      if (!req.user || req.user.role !== "ADMIN") {
        throw new Error("Not authorized");
      }

      try {
        const result = await db.query(
          `
          UPDATE designations
          SET 
            name = COALESCE($1, name),
            rank = COALESCE($2, rank),
            active = COALESCE($3, active)
          WHERE id = $4
          RETURNING id, name, rank, active
        `,
          [name, rank, active, id]
        );

        if (result.rows.length === 0) {
          throw new Error("Designation not found");
        }

        return result.rows[0];
      } catch (error) {
        if (error.code === "23505") {
          // Unique violation
          throw new Error("Designation name already exists");
        }
        console.error("Database error:", error);
        throw new Error("Failed to update designation");
      }
    },

    deleteDesignation: async (_, { ids }, { db, req }) => {
      if (!req.user || req.user.role !== "ADMIN") {
        throw new Error("Not authorized");
      }

      try {
        // First check if any agents are using these designations
        const usageCheck = await db.query(
          `
          SELECT COUNT(*) 
          FROM agents 
          WHERE designation_id = ANY($1)
        `,
          [ids]
        );

        if (parseInt(usageCheck.rows[0].count) > 0) {
          throw new Error(
            "Cannot delete designations that are assigned to agents"
          );
        }

        // If no agents are using the designations, proceed with deletion
        const result = await db.query(
          `
          DELETE FROM designations 
          WHERE id = ANY($1)
          RETURNING id
        `,
          [ids]
        );

        return result.rowCount > 0;
      } catch (error) {
        console.error("Database error:", error);
        if (error.message.includes("Cannot delete")) {
          throw error;
        }
        throw new Error("Failed to delete designations");
      }
    },
  },
};
