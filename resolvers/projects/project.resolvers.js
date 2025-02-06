export const projectResolvers = {
  Query: {
    projects: async (_, __, { db, req }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      try {
        const result = await db.query(
          `
          SELECT 
            p.id,
            p.company_id AS "companyId",
            p.name,
            p.developer_id AS "developerId",
            p.developer_pay_tax as "developerPayTax",
            p.state_id AS "stateId",
            p.description,
            p.active,
            p.created_by AS "createdById",
            TO_CHAR(p.created_at, 'YYYY-MM-DD hh:mm:ss') AS "createdAt",
            p.last_modified_by AS "lastModifiedById",
            TO_CHAR(p.last_modified_at, 'YYYY-MM-DD hh:mm:ss') AS "lastModifiedAt"
          FROM projects p
          ORDER BY p.name ASC
        `
        );

        return result.rows;
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to fetch projects");
      }
    },

    project: async (_, { id }, { db, req }) => {
      if (!req.user || !id) {
        throw new Error("Not authenticated");
      }

      try {
        const result = await db.query(
          `
          SELECT
            p.id,
            p.company_id AS "companyId",
            p.name,
            p.developer_id AS "developerId",
            p.developer_pay_tax as "developerPayTax",
            p.state_id AS "stateId",
            p.description,
            p.active,
            p.created_by AS "createdById",
            TO_CHAR(p.created_at, 'YYYY-MM-DD hh:mm:ss') AS "createdAt",
            p.last_modified_by AS "lastModifiedById",
            TO_CHAR(p.last_modified_at, 'YYYY-MM-DD hh:mm:ss') AS "lastModifiedAt"
          FROM projects p
          WHERE p.id = $1
        `,
          [id]
        );

        if (!result.rows[0]) {
          console.log(`Project with ID ${id} not found`);
          throw new Error("Project not found");
        }

        return result.rows[0] || [];
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to fetch project");
      }
    },
  },

  Mutation: {
    createProject: async (_, args, { db, req }) => {
      if (!req.user) {
        throw new Error("User is not authenticated");
      }

      const {
        companyId,
        name,
        developerId,
        developerPayTax,
        stateId,
        description,
        active,
      } = args;

      try {
        const result = await db.query(
          `
          INSERT INTO projects (
            company_id,
            name,
            developer_id,
            developer_pay_tax,
            state_id,
            description,
            active,
            created_by,
            last_modified_by
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $8)
          RETURNING
            id,
            company_id AS "companyId",
            name,
            developer_id AS "developerId",
            developer_pay_tax AS "developerPayTax",
            state_id AS "stateId",
            description,
            active,
            created_by AS "createdById",
            last_modified_by AS "lastModifiedById"
        `,
          [
            companyId,
            name,
            developerId,
            developerPayTax,
            stateId,
            description,
            active,
            req.user.id,
          ]
        );

        const createdProject = result.rows[0];

        if (!createdProject) {
          throw new Error("Failed to create project");
        }

        return createdProject;
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to create project: " + error.message);
      }
    },

    updateProject: async (_, args, { db, req }) => {
      if (!req.user) {
        throw new Error("User is not authenticated");
      }

      const {
        id,
        companyId,
        name,
        developerId,
        developerPayTax,
        stateId,
        description,
        active,
      } = args;

      try {
        const result = await db.query(
          `
                UPDATE projects
                SET
                  company_id = COALESCE($1, company_id),
                  name = COALESCE($2, name),
                  developer_id = COALESCE($3, developer_id),
                  developer_pay_tax = COALESCE($4, developer_pay_tax),
                  state_id = COALESCE($5, state_id),
                  description = COALESCE($6, description),
                  active = COALESCE($7, active),
                  last_modified_by = $8,
                  last_modified_at = CURRENT_TIMESTAMP
                WHERE id = $9
                RETURNING
                  id,
                  company_id AS "companyId",
                  name,
                  developer_id AS "developerId",
                  developer_pay_tax AS "developerPayTax",
                  state_id AS "stateId",
                  description,
                  active,
                  created_by AS "createdById",
                  last_modified_by AS "lastModifiedById"
              `,
          [
            companyId,
            name,
            developerId,
            developerPayTax,
            stateId,
            description,
            active,
            req.user.id,
            id,
          ]
        );

        if (result.rows.length === 0) {
          throw new Error("Project not found");
        }

        return result.rows[0];
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to update project: " + error.message);
      }
    },

    deleteProjects: async (_, { ids }, { db, req }) => {
      if (!req.user) {
        throw new Error("User is not authenticated");
      }

      try {
        const result = await db.query(
          `
                DELETE FROM projects
                WHERE id = ANY($1)
                RETURNING id
              `,
          [ids]
        );

        return result.rowCount > 0;
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to delete projects: " + error.message);
      }
    },
  },

  Project: {
    company: async (parent, _, { db }) => {
      if (!parent.companyId) {
        throw new Error("Missing companyId for project type");
      }

      try {
        const result = await db.query(
          `
        SELECT id, name FROM companies WHERE id = $1`,
          [parent.companyId]
        );

        if (result.rows.length === 0) {
          throw new Error("Company for project type not found");
        }

        return result.rows[0] || null;
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to fetch project");
      }
    },
    developer: async (parent, _, { db }) => {
      if (!parent.developerId) {
        throw new Error("Missing developerId for project type");
      }

      try {
        const result = await db.query(
          `
        SELECT id, name, registration_no AS "registrationNo" FROM developers WHERE id = $1`,
          [parent.developerId]
        );

        if (result.rows.length === 0) {
          throw new Error("Developer for project type not found");
        }

        return result.rows[0] || null;
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to fetch project");
      }
    },
    state: async (parent, _, { db }) => {
      if (!parent.stateId) {
        throw new Error("Missing stateId for project type");
      }

      try {
        const result = await db.query(
          `
        SELECT id, name FROM states WHERE id = $1`,
          [parent.stateId]
        );

        if (result.rows.length === 0) {
          throw new Error("State for project type not found");
        }

        return result.rows[0] || null;
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to fetch project");
      }
    },
    unitTypes: async (parent, _, { db }) => {
      if (!parent.id) {
        throw new Error("Missing parent.id for project type");
      }

      try {
        const result = await db.query(
          `SELECT 
            id,
            name,
            project_id
        FROM project_unit_types 
        WHERE project_id = $1`,
          [parent.id]
        );

        return result.rows || null;
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to fetch unit types");
      }
    },
    schedules: async (parent, _, { db }) => {
      if (!parent.id) {
        throw new Error("Missing parent.id for project type");
      }

      try {
        const result = await db.query(
          `SELECT 
            id,
            name,
            sequence,
            project_id
        FROM project_schedules 
        WHERE project_id = $1`,
          [parent.id]
        );

        return result.rows || null;
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to fetch schedules");
      }
    },
    commissionSchemes: async (parent, _, { db }) => {
      if (!parent.id) {
        throw new Error(
          "Missing parent.id for project type - commmissionSchemes"
        );
      }

      try {
        const result = await db.query(
          `SELECT 
            id,
            unit_type_id AS "unitTypeId",
            TO_CHAR(from_date, 'YYYY-MM-DD') AS "fromDate",
            TO_CHAR(to_date, 'YYYY-MM-DD') AS "toDate",
            min_unit AS "minUnit",
            max_unit AS "maxUnit",
            commission_type AS "commissionType", 
            commission_value AS "commissionValue",
            project_id
        FROM project_commission_schemes 
        WHERE project_id = $1`,
          [parent.id]
        );

        return result.rows || null;
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to fetch unit types");
      }
    },
    agentCommissions: async (parent, _, { db }) => {
      if (!parent.id) {
        throw new Error(
          "Missing parent.id for project type - agentCommissions"
        );
      }

      try {
        const result = await db.query(
          `SELECT 
          ac.id,
          ac.project_id AS "projectId",
          ac.commission_scheme_id AS "commissionSchemeId",
          ac.sales_commission_type AS "salesCommissionType",
          ac.designation_id AS "designationId",
          ac.commission_type AS "commissionType",
          ac.commission_value AS "commissionValue",
          ac.overriding,
          ac.schedule_payment_type AS "schedulePaymentType",
          ac.schedule_payment_value AS "schedulePaymentValue"
        FROM agent_commissions ac
        WHERE ac.project_id = $1`,
          [parent.id]
        );

        return result.rows || null;
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to fetch unit types");
      }
    },
    managerCommissions: async (parent, _, { db }) => {
      if (!parent.id) {
        throw new Error(
          "Missing parent.id for project type - projectManagerCommissions"
        );
      }

      try {
        const result = await db.query(
          `SELECT 
          pmc.id,
          pmc.project_id AS "projectId",
          pmc.commission_scheme_id AS "commissionSchemeId",
          pmc.from_date AS "fromDate",
          pmc.to_date AS "toDate",
          pmc.sales_commission_type AS "salesCommissionType",
          pmc.agent_id AS "agentId",
          pmc.commission_type AS "commissionType",
          pmc.commission_value AS "commissionValue",
          pmc.overriding,
          pmc.schedule_payment_type AS "schedulePaymentType",
          pmc.schedule_payment_value AS "schedulePaymentValue"
        FROM project_manager_commissions pmc
        WHERE pmc.project_id = $1`,
          [parent.id]
        );

        return result.rows || null;
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to fetch unit types");
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
