export const bankResolvers = {
  Query: {
    banks: async (_, __, { db, req }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      try {
        const result = await db.query(`
            SELECT id, name, swift_code as "swiftCode", active
            FROM banks
            ORDER BY name ASC
          `);
        return result.rows;
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to fetch banks");
      }
    },

    bank: async (_, { id }, { db, req }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      try {
        const result = await db.query(
          `
            SELECT id, name, swift_code as "swiftCode", active
            FROM banks
            WHERE id = $1
          `,
          [id]
        );
        return result.rows[0];
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to fetch bank");
      }
    },
  },

  Mutation: {
    createBank: async (_, { name, swiftCode, active }, { db, req }) => {
      if (!req.user || req.user.role !== "ADMIN") {
        throw new Error("Not authorized");
      }

      try {
        const result = await db.query(
          `
            INSERT INTO banks (name, swift_code, active)
            VALUES ($1, $2, $3)
            RETURNING id, name, swift_code as "swiftCode", active
          `,
          [name, swiftCode, active]
        );
        return result.rows[0];
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to create bank");
      }
    },

    updateBank: async (_, { id, name, swiftCode, active }, { db, req }) => {
      if (!req.user || req.user.role !== "ADMIN") {
        throw new Error("Not authorized");
      }

      try {
        const result = await db.query(
          `
            UPDATE banks
            SET 
              name = COALESCE($1, name),
              swift_code = COALESCE($2, swift_code),
              active = COALESCE($3, active)
            WHERE id = $4
            RETURNING id, name, swift_code as "swiftCode", active
          `,
          [name, swiftCode, active, id]
        );
        return result.rows[0];
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to update bank");
      }
    },

    deleteBanks: async (_, { ids }, { db, req }) => {
      if (!req.user || req.user.role !== "ADMIN") {
        throw new Error("Not authorized");
      }

      try {
        await db.query("DELETE FROM banks WHERE id = ANY($1)", [ids]);
        return true;
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to delete banks");
      }
    },
  },
};
