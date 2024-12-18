export const branchResolvers = {
  Query: {
    branches: async (_, __, { db, req }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      try {
        const result = await db.query(`
            SELECT id, name, max_agents as "maxAgents", active
            FROM branches
            ORDER BY name ASC
          `);
        return result.rows;
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to fetch branches");
      }
    },

    branch: async (_, { id }, { db, req }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      try {
        const result = await db.query(
          `
            SELECT id, name, max_agents as "maxAgents", active
            FROM branches
            WHERE id = $1
          `,
          [id]
        );
        return result.rows[0];
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to fetch branch");
      }
    },
  },

  Mutation: {
    createBranch: async (_, { name, maxAgents, active }, { db, req }) => {
      if (!req.user || req.user.role !== "ADMIN") {
        throw new Error("Not authorized");
      }

      try {
        const result = await db.query(
          `
            INSERT INTO branches (name, max_agents, active)
            VALUES ($1, $2, $3)
            RETURNING id, name, max_agents as "maxAgents", active
          `,
          [name, maxAgents, active]
        );
        return result.rows[0];
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to create branch");
      }
    },
  },
};
