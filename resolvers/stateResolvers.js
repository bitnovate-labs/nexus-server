export const stateResolvers = {
  Query: {
    states: async (_, __, { db, req }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      try {
        const result = await db.query(`
            SELECT id, name, code, country
            FROM states
            ORDER BY name ASC
          `);
        return result.rows;
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to fetch states");
      }
    },

    state: async (_, { id }, { db, req }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      try {
        const result = await db.query(
          `
            SELECT id, name, code, country
            FROM states
            WHERE id = $1
          `,
          [id]
        );
        return result.rows[0];
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to fetch state");
      }
    },
  },

  Mutation: {
    createState: async (_, { name, code, country }, { db, req }) => {
      if (!req.user || req.user.role !== "ADMIN") {
        throw new Error("Not authorized");
      }

      try {
        const result = await db.query(
          `
            INSERT INTO states (name, code, country)
            VALUES ($1, $2, $3)
            RETURNING id, name, code, country
          `,
          [name, code, country]
        );
        return result.rows[0];
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to create state");
      }
    },

    updateState: async (_, { id, name, code, country }, { db, req }) => {
      if (!req.user || req.user.role !== "ADMIN") {
        throw new Error("Not authorized");
      }

      try {
        const result = await db.query(
          `
            UPDATE states
            SET 
              name = COALESCE($1, name),
              code = COALESCE($2, code),
              country = COALESCE($3, country)
            WHERE id = $4
            RETURNING id, name, code, country
          `,
          [name, code, country, id]
        );
        return result.rows[0];
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to update state");
      }
    },

    deleteStates: async (_, { ids }, { db, req }) => {
      if (!req.user || req.user.role !== "ADMIN") {
        throw new Error("Not authorized");
      }

      try {
        await db.query("DELETE FROM states WHERE id = ANY($1)", [ids]);
        return true;
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to delete states");
      }
    },
  },
};
