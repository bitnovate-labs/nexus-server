export const projectScheduleResolvers = {
  Query: {
    projectSchedules: async (_, { projectId }, { db, req }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      try {
        const result = await db.query(
          `SELECT 
                ps.id,
                ps.project_id AS "projectId",
                ps.name,
                ps.sequence,
                ps.created_by AS "createdById",
                ps.last_modified_by AS "lastModifiedById"
            FROM project_schedules ps
            WHERE ps.project_id = $1
            ORDER BY ps.name ASC
            `,
          [projectId]
        );

        return result.rows.map((row) => ({
          id: row.id,
          projectId: row.projectId,
          name: row.name,
          sequence: row.sequence,
        }));
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to fetch projects");
      }
    },

    projectSchedule: async (_, { id }, { db, req }) => {
      if (!req.user || !id) {
        throw new Error("Not authenticated");
      }

      try {
        const result = await db.query(
          `SELECT 
                ps.id,
                ps.project_id AS "projectId",
                ps.name,
                ps.sequence,
                ps.created_by AS "createdById",
                ps.last_modified_by AS "lastModifiedById"
          FROM project_schedules ps
          WHERE ps.id = $1
          `,
          [id]
        );

        if (result.rows.length === 0) {
          throw new Error("Project schedule not found");
        }

        return result.rows[0];
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to fetch project");
      }
    },
  },

  Mutation: {
    createProjectSchedule: async (_, args, { db, req }) => {
      if (!req.user) {
        throw new Error("User is not authenticated");
      }

      const { projectId, name, sequence } = args;

      try {
        const result = await db.query(
          `
              INSERT INTO project_schedules (
                project_id,
                name, 
                sequence,
                created_by,
                last_modified_by
              )
              VALUES ($1, $2, $3, $4, $4)
              RETURNING
                id,
                project_id AS "projectId",
                name,
                sequence,
                created_by AS "createdById",
                last_modified_by AS "lastModifiedById"
            `,
          [projectId, name, sequence, req.user.id]
        );

        if (result.rows.length === 0) {
          throw new Error("Project schedule not found");
        }

        return result.rows[0];
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to create project: " + error.message);
      }
    },

    updateProjectSchedule: async (_, args, { db, req }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      const { id, name, sequence } = args;

      try {
        const result = await db.query(
          `
              UPDATE project_schedules
              SET 
                  name = COALESCE($1, name),
                  sequence = COALESCE($2, sequence),
                  last_modified_by = $3,
                  last_modified_at = CURRENT_TIMESTAMP
              WHERE id = $4
              RETURNING 
                  id, 
                  name,
                  sequence,
                  last_modified_by AS "lastModifiedById",
                  last_modified_at AS "lastModifiedAt"    
            `,
          [name, sequence, req.user.id, id]
        );

        if (result.rows.length === 0) {
          throw new Error("Project schedule not found");
        }

        return result.rows[0];
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to update schedule");
      }
    },

    deleteProjectSchedule: async (_, { id }, { db, req }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      try {
        const result = await db.query(
          "DELETE FROM project_schedules WHERE id = $1 RETURNING id",
          [id]
        );

        return result.rowCount > 0;
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to delete schedule");
      }
    },
  },

  ProjectSchedule: {
    project: async (parent, _, { db }) => {
      if (!parent.projectId) {
        throw new Error(
          "Missing projectId for the project schedule in resolvers"
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
