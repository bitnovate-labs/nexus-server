export const userRoleResolvers = {
  Query: {
    userRoles: async (_, __, { db, req }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      if (req.user.role !== "ADMIN") {
        throw new Error("Not authorized");
      }

      try {
        const result = await db.query(`
            SELECT id, code, name, active
            FROM user_roles
            ORDER BY code ASC
          `);
        return result.rows;
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to fetch user roles");
      }
    },

    userRole: async (_, { id }, { db, req }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      if (req.user.role !== "ADMIN") {
        throw new Error("Not authorized");
      }

      try {
        const result = await db.query(
          `
            SELECT id, code, name, active
            FROM user_roles
            WHERE id = $1
          `,
          [id]
        );
        return result.rows[0];
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to fetch user role");
      }
    },
  },

  Mutation: {
    createUserRole: async (_, { code, name, active }, { db, req }) => {
      if (!req.user || req.user.role !== "ADMIN") {
        throw new Error("Not authorized");
      }

      try {
        const result = await db.query(
          `
            INSERT INTO user_roles (code, name, active)
            VALUES ($1, $2, $3)
            RETURNING id, code, name, active
          `,
          [code, name, active]
        );
        return result.rows[0];
      } catch (error) {
        if (error.code === "23505") {
          // Unique violation
          throw new Error("Code already exists");
        }
        console.error("Database error:", error);
        throw new Error("Failed to create user role");
      }
    },

    updateUserRole: async (_, { id, code, name, active }, { db, req }) => {
      if (!req.user || req.user.role !== "ADMIN") {
        throw new Error("Not authorized");
      }

      try {
        const result = await db.query(
          `
            UPDATE user_roles
            SET 
              code = COALESCE($1, code),
              name = COALESCE($2, name),
              active = COALESCE($3, active)
            WHERE id = $4
            RETURNING id, code, name, active
          `,
          [code, name, active, id]
        );

        if (result.rows.length === 0) {
          throw new Error("User role not found");
        }

        return result.rows[0];
      } catch (error) {
        if (error.code === "23505") {
          // Unique violation
          throw new Error("Code already exists");
        }
        console.error("Database error:", error);
        throw new Error("Failed to update user role");
      }
    },

    deleteUserRoles: async (_, { ids }, { db, req }) => {
      if (!req.user || req.user.role !== "ADMIN") {
        throw new Error("Not authorized");
      }

      try {
        const result = await db.query(
          "DELETE FROM user_roles WHERE id = ANY($1)",
          [ids]
        );
        return result.rowCount > 0;
      } catch (error) {
        if (error.code === "23503") {
          // Foreign key violation
          throw new Error("Cannot delete user roles that are in use");
        }
        console.error("Database error:", error);
        throw new Error("Failed to delete user roles");
      }
    },
  },
};
