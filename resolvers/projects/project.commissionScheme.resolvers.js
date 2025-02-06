export const projectCommissionSchemeResolvers = {
  Query: {
    projectCommissionSchemes: async (_, { projectId }, { db, req }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      try {
        const result = await db.query(
          `SELECT 
                  pcs.id,
                  pcs.project_id AS "projectId",
                  pcs.unit_type_id AS "unitTypeId",
                  pcs.from_date AS "fromDate",
                  pcs.to_date AS "toDate",
                  pcs.min_unit AS "minUnit",
                  pcs.max_unit AS "maxUnit",
                  pcs.commission_type AS "commissionType",
                  pcs.commission_value AS "commissionValue",
                  pcs.created_by AS "createdById",
                  pcs.last_modified_by AS "lastModifiedById"
              FROM project_commission_schemes pcs
              WHERE pcs.project_id = $1
              ORDER BY pcs.id ASC
              `,
          [projectId]
        );

        return result.rows;
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to fetch projects");
      }
    },

    projectCommissionScheme: async (_, { id }, { db, req }) => {
      if (!req.user || !id) {
        throw new Error("Not authenticated");
      }

      try {
        const result = await db.query(
          `SELECT 
            pcs.id,
            pcs.project_id AS "projectId",
            pcs.unit_type_id AS "unitTypeId",
            pcs.from_date AS "fromDate",
            pcs.to_date AS "toDate",
            pcs.min_unit AS "minUnit",
            pcs.max_unit AS "maxUnit",
            pcs.commission_type AS "commissionType",
            pcs.commission_value AS "commissionValue",
            pcs.created_by AS "createdById",
            pcs.last_modified_by AS "lastModifiedById"
          FROM project_commission_schemes pcs
          WHERE pcs.id = $1
          `,
          [id]
        );

        if (result.rows.length === 0) {
          throw new Error("Project commission schemes not found");
        }

        return result.rows[0];
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to fetch project");
      }
    },
  },

  Mutation: {
    createProjectCommissionScheme: async (_, args, { db, req }) => {
      if (!req.user) {
        throw new Error("User is not authenticated");
      }

      const {
        projectId,
        unitTypeId,
        fromDate,
        toDate,
        minUnit,
        maxUnit,
        commissionType,
        commissionValue,
      } = args;

      try {
        const result = await db.query(
          `
              INSERT INTO project_commission_schemes (
                project_id,
                unit_type_id,
                from_date,
                to_date,
                min_unit,
                max_unit,
                commission_type,
                commission_value,
                created_by,
                last_modified_by
              )
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $9)
              RETURNING
                id,
                project_id AS "projectId",
                unit_type_id AS "unitTypeId",
                from_date AS "fromDate",
                to_date AS "toDate",
                min_unit AS "minUnit",
                max_unit AS "maxUnit",
                commission_type AS "commissionType",
                commission_value AS "commissionValue",
                created_by AS "createdById",
                last_modified_by AS "lastModifiedById"
            `,
          [
            projectId,
            unitTypeId,
            fromDate,
            toDate,
            minUnit,
            maxUnit,
            commissionType,
            commissionValue,
            req.user.id,
          ]
        );

        return result.rows[0];
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to create project: " + error.message);
      }
    },

    updateProjectCommissionScheme: async (_, args, { db, req }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      const {
        id,
        unitTypeId,
        fromDate,
        toDate,
        minUnit,
        maxUnit,
        commissionType,
        commissionValue,
      } = args;

      try {
        const result = await db.query(
          `
              UPDATE project_commission_schemes
              SET 
                  unit_type_id = COALESCE($1, unit_type_id),
                  from_date = COALESCE($2, from_date),
                  to_date = COALESCE($3, to_date),
                  min_unit = COALESCE($4, min_unit),
                  max_unit = COALESCE($5, max_unit),
                  commission_type = COALESCE($6, commission_type),
                  commission_value = COALESCE($7, commission_value),
                  last_modified_by = $8,
                  last_modified_at = CURRENT_TIMESTAMP
              WHERE id = $9   
              RETURNING 
                id, 
                unit_type_id AS "unitTypeId",
                from_date AS "fromDate",
                to_date AS "toDate",
                min_unit AS "minUnit",
                max_unit AS "maxUnit",
                commission_type AS "commissionType",
                commission_value AS "commissionValue",
                last_modified_by AS "lastModifiedById",
                last_modified_at AS "lastModifiedAt"    
            `,
          [
            unitTypeId,
            fromDate,
            toDate,
            minUnit,
            maxUnit,
            commissionType,
            commissionValue,
            req.user.id,
            id,
          ]
        );

        if (result.rows.length === 0) {
          throw new Error("Project commission scheme not found");
        }

        return result.rows[0];
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to update project commission scheme");
      }
    },

    deleteProjectCommissionScheme: async (_, { id }, { db, req }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      try {
        const result = await db.query(
          "DELETE FROM project_commission_schemes WHERE id = $1 RETURNING id",
          [id]
        );

        return result.rowCount > 0;
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to delete project commission scheme");
      }
    },
  },

  // CUSTOM RESOLVER
  ProjectCommissionScheme: {
    project: async (parent, _, { db }) => {
      if (!parent.projectId) {
        throw new Error(
          "Missing projectId for the project commission scheme in resolvers"
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
    unitType: async (parent, _, { db }) => {
      if (!parent.unitTypeId) {
        throw new Error(
          "Missing unitTypeId for the project commission scheme in resolvers"
        );
      }
      if (!parent.id) {
        throw new Error("Missing parent.id for project type");
      }

      try {
        const result = await db.query(
          `
              SELECT id, name FROM project_unit_types WHERE id = $1`,
          [parent.unitTypeId]
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
    createdBy: async (parent, _, { db }) => {
      if (!parent.createdById) {
        return null; // Return null if createdById is not set
      }

      try {
        const result = await db.query(
          `
            SELECT id, name 
            FROM users 
            WHERE id = $1
            `,
          [parent.createdById]
        );

        return result.rows[0] || null; // Return the user or null if not found
      } catch (error) {
        console.error("Database error (createdBy):", error);
        throw new Error("Failed to fetch createdBy user");
      }
    },
    lastModifiedBy: async (parent, _, { db }) => {
      if (!parent.lastModifiedById) {
        return null; // Return null if lastModifiedById is not set
      }

      try {
        const result = await db.query(
          `
            SELECT id, name 
            FROM users 
            WHERE id = $1
            `,
          [parent.lastModifiedById]
        );

        return result.rows[0] || null;
      } catch (error) {
        console.error("Database error (lastModifiedBy):", error);
        throw new Error("Failed to fetch lastModifiedBy user");
      }
    },
  },
};
