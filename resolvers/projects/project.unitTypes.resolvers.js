export const projectUnitTypeResolvers = {
  Query: {
    projectUnitTypes: async (_, { projectId }, { db, req }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      try {
        const result = await db.query(
          `SELECT 
                put.id,
                put.project_id AS "projectId",
                put.name,
                put.created_by AS "createdById",
                put.last_modified_by AS "lastModifiedById"
            FROM project_unit_types put
            WHERE put.project_id = $1
            ORDER BY put.name ASC
            `,
          [projectId]
        );

        return result.rows.map((row) => ({
          id: row.id,
          projectId: row.projectId,
          name: row.name,
        }));
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to fetch projects");
      }
    },

    projectUnitType: async (_, { id }, { db, req }) => {
      if (!req.user || !id) {
        throw new Error("Not authenticated");
      }

      try {
        const result = await db.query(
          `SELECT 
            put.id,
            put.project_id AS "projectId",
            put.name,
            put.created_by AS "createdById",
            put.last_modified_by AS "lastModifiedById"
        FROM project_unit_types put
        WHERE put.id = $1
        `,
          [id]
        );

        if (result.rows.length === 0) {
          throw new Error("Project unit type not found");
        }

        return result.rows[0];
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to fetch project");
      }
    },
  },

  Mutation: {
    createProjectUnitType: async (_, args, { db, req }) => {
      if (!req.user) {
        throw new Error("User is not authenticated");
      }

      const { projectId, name } = args;

      try {
        const result = await db.query(
          `
            INSERT INTO project_unit_types (
              project_id,
              name, 
              created_by,
              last_modified_by
            )
            VALUES ($1, $2, $3, $3)
            RETURNING
              id,
              project_id AS "projectId",
              name,
              created_by AS "createdById",
              last_modified_by AS "lastModifiedById"
          `,
          [projectId, name, req.user.id]
        );

        return result.rows[0];
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to create project: " + error.message);
      }
    },

    updateProjectUnitType: async (_, args, { db, req }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      const { id, name } = args;

      try {
        const result = await db.query(
          `
            UPDATE project_unit_types
            SET 
                name = COALESCE($1, name),
                last_modified_by = $2,
                last_modified_at = CURRENT_TIMESTAMP
            WHERE id = $3
            RETURNING 
                id, 
                name,
                last_modified_by AS "lastModifiedById",
                last_modified_at AS "lastModifiedAt"    
          `,
          [name, req.user.id, id]
        );

        if (result.rows.length === 0) {
          throw new Error("Project unit type not found");
        }

        return result.rows[0];
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to update unit type");
      }
    },

    deleteProjectUnitType: async (_, { id }, { db, req }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      try {
        const result = await db.query(
          "DELETE FROM project_unit_types WHERE id = $1 RETURNING id",
          [id]
        );

        return result.rowCount > 0;
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to delete unit type");
      }
    },
  },

  ProjectUnitType: {
    project: async (parent, _, { db }) => {
      if (!parent.projectId) {
        throw new Error(
          "Missing projectId for the project unit type in resolvers"
        );
      }

      try {
        const result = await db.query(
          `
          SELECT id, name FROM projects WHERE id = $1`,
          [parent.projectId]
        );

        if (result.rows.length === 0) {
          throw new Error("Project not found");
        }

        return result.rows[0];
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to fetch project");
      }
    },
  },
};
