export const projectManagerCommissionResolvers = {
  Query: {
    projectManagerCommissions: async (
      _,
      { projectId, agentId, salesCommissionType },
      { db, req }
    ) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      try {
        let query = `
            SELECT 
              pmc.id,
              pmc.project_id AS "projectId",
              pmc.commission_scheme_id AS "commissionSchemeId",
              TO_CHAR(pmc.from_date, 'YYYY-MM-DD') AS "fromDate",
              TO_CHAR(pmc.to_date, 'YYYY-MM-DD') AS "toDate",
              pmc.sales_commission_type AS "salesCommissionType",
              pmc.agent_id AS "agentId",
              pmc.commission_type AS "commissionType",
              pmc.commission_value AS "commissionValue",
              pmc.overriding,
              pmc.schedule_payment_type AS "schedulePaymentType",
              pmc.schedule_payment_value AS "schedulePaymentValue",
              pmc.created_by AS "createdById",
              pmc.last_modified_by AS "lastModifiedById",
              TO_CHAR(pmc.created_at, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS "createdAt",
              TO_CHAR(pmc.last_modified_at, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS "lastModifiedAt"
            FROM project_manager_commissions pmc
            WHERE pmc.project_id = $1
          `;

        const params = [projectId];
        let paramCount = 1;

        if (agentId) {
          paramCount++;
          query += ` AND pmc.agent_id = $${paramCount}`;
          params.push(agentId);
        }

        if (salesCommissionType) {
          paramCount++;
          query += ` AND pmc.sales_commission_type = $${paramCount}`;
          params.push(salesCommissionType);
        }

        query += ` ORDER BY pmc.id ASC`;

        const result = await db.query(query, params);
        return result.rows;
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to fetch project manager commissions");
      }
    },

    projectManagerCommission: async (_, { id }, { db, req }) => {
      if (!req.user || !id) {
        throw new Error("Not authenticated");
      }

      try {
        const result = await db.query(
          `SELECT 
              pmc.id,
              pmc.project_id AS "projectId",
              pmc.commission_scheme_id AS "commissionSchemeId",
              TO_CHAR(pmc.from_date, 'YYYY-MM-DD') AS "fromDate",
              TO_CHAR(pmc.to_date, 'YYYY-MM-DD') AS "toDate",
              pmc.sales_commission_type AS "salesCommissionType",
              pmc.agent_id AS "agentId",
              pmc.commission_type AS "commissionType",
              pmc.commission_value AS "commissionValue",
              pmc.overriding,
              pmc.schedule_payment_type AS "schedulePaymentType",
              pmc.schedule_payment_value AS "schedulePaymentValue",
              pmc.created_by AS "createdById",
              pmc.last_modified_by AS "lastModifiedById",
              TO_CHAR(pmc.created_at, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS "createdAt",
              TO_CHAR(pmc.last_modified_at, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS "lastModifiedAt"
            FROM project_manager_commissions pmc
            WHERE pmc.id = $1`,
          [id]
        );

        if (result.rows.length === 0) {
          throw new Error("Project manager commission not found");
        }

        return result.rows[0];
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to fetch project manager commission");
      }
    },
  },

  Mutation: {
    createProjectManagerCommission: async (_, args, { db, req }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      const {
        projectId,
        commissionSchemeId,
        fromDate,
        toDate,
        salesCommissionType,
        agentId,
        commissionType,
        commissionValue,
        overriding,
        schedulePaymentType,
        schedulePaymentValue,
      } = args;

      try {
        const result = await db.query(
          `INSERT INTO project_manager_commissions (
              project_id,
              commission_scheme_id,
              from_date,
              to_date, 
              sales_commission_type,
              agent_id,
              commission_type,
              commission_value,
              overriding,
              schedule_payment_type,
              schedule_payment_value,
              created_by,
              last_modified_by
            )
            VALUES ($1, NULLIF($2, 0), $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $12)
            RETURNING 
              id,
              project_id AS "projectId",
              commission_scheme_id AS "commissionSchemeId",
              from_date AS "fromDate",
              to_date AS "toDate",
              sales_commission_type AS "salesCommissionType",
              agent_id AS "agentId",
              commission_type AS "commissionType",
              commission_value AS "commissionValue",
              overriding,
              schedule_payment_type AS "schedulePaymentType",
              schedule_payment_value AS "schedulePaymentValue",
              created_by AS "createdById",
              last_modified_by AS "lastModifiedById",
              TO_CHAR(created_at, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS "createdAt",
              TO_CHAR(last_modified_at, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS "lastModifiedAt"`,
          [
            projectId,
            commissionSchemeId,
            fromDate,
            toDate,
            salesCommissionType,
            agentId,
            commissionType,
            commissionValue,
            overriding,
            schedulePaymentType,
            schedulePaymentValue,
            req.user.id,
          ]
        );

        return result.rows[0];
      } catch (error) {
        console.error("Database error:", error);
        throw new Error(
          "Failed to create project manager commission: " + error.message
        );
      }
    },

    updateProjectManagerCommission: async (_, args, { db, req }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      const {
        id,
        projectId,
        commissionSchemeId,
        fromDate,
        toDate,
        salesCommissionType,
        agentId,
        commissionType,
        commissionValue,
        overriding,
        schedulePaymentType,
        schedulePaymentValue,
      } = args;

      try {
        // Convert commissionSchemeId to null if it's 0 (invalid foreign key value)
        const validCommissionSchemeId =
          commissionSchemeId === 0 ? null : commissionSchemeId;

        const result = await db.query(
          `UPDATE project_manager_commissions
            SET 
              project_id = COALESCE($1, project_id),
              commission_scheme_id = NULLIF($2, 0),
              from_date = COALESCE($3, from_date),
              to_date = COALESCE($4, to_date),
              sales_commission_type = COALESCE($5, sales_commission_type),
              agent_id = COALESCE($6, agent_id),
              commission_type = COALESCE($7, commission_type),
              commission_value = COALESCE($8, commission_value),
              overriding = COALESCE($9, overriding),
              schedule_payment_type = COALESCE($10, schedule_payment_type),
              schedule_payment_value = COALESCE($11, schedule_payment_value),
              last_modified_by = $12,
              last_modified_at = CURRENT_TIMESTAMP
            WHERE id = $13
            RETURNING 
              id,
              project_id AS "projectId",
              commission_scheme_id AS "commissionSchemeId",
              from_date AS "fromDate",
              to_date AS "toDate",
              sales_commission_type AS "salesCommissionType",
              agent_id AS "agentId",
              commission_type AS "commissionType",
              commission_value AS "commissionValue",
              overriding,
              schedule_payment_type AS "schedulePaymentType",
              schedule_payment_value AS "schedulePaymentValue",
              last_modified_by AS "lastModifiedById",
              TO_CHAR(last_modified_at, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS "lastModifiedAt"`,
          [
            projectId,
            validCommissionSchemeId,
            fromDate,
            toDate,
            salesCommissionType,
            agentId,
            commissionType,
            commissionValue,
            overriding,
            schedulePaymentType,
            schedulePaymentValue,
            req.user.id,
            id,
          ]
        );

        if (result.rows.length === 0) {
          throw new Error("Project manager commission not found");
        }

        return result.rows[0];
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to update project manager commission");
      }
    },

    deleteProjectManagerCommission: async (_, { id }, { db, req }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      try {
        const result = await db.query(
          "DELETE FROM project_manager_commissions WHERE id = $1 RETURNING id",
          [id]
        );

        return result.rowCount > 0;
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to delete project manager commission");
      }
    },
  },

  ProjectManagerCommission: {
    project: async (parent, _, { db }) => {
      if (!parent.projectId) {
        throw new Error(
          "Missing projectId for the project manager commission in resolvers"
        );
      }

      try {
        const result = await db.query(
          `SELECT id, name FROM projects WHERE id = $1`,
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

    commissionScheme: async (parent, _, { db }) => {
      if (!parent.commissionSchemeId || parent.commissionSchemeId === 0) {
        return null;
      }

      try {
        const result = await db.query(
          `SELECT 
            id,
            unit_type_id AS "unitTypeId",
            TO_CHAR(from_date, 'DD-MM-YYYY') AS "fromDate",
            TO_CHAR(to_date, 'DD-MM-YYYY') AS "toDate",
            commission_type AS "commissionType",
            commission_value AS "commissionValue"
          FROM project_commission_schemes 
          WHERE id = $1`,
          [parent.commissionSchemeId]
        );

        if (result.rows.length === 0) {
          throw new Error("Commission scheme not found");
        }

        return result.rows[0];
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to fetch commission scheme");
      }
    },

    agent: async (parent, _, { db }) => {
      if (!parent.agentId) {
        throw new Error(
          "Missing agentId for the project manager commission in resolvers"
        );
      }

      try {
        const result = await db.query(
          `SELECT id, name FROM agents WHERE id = $1`,
          [parent.agentId]
        );

        if (result.rows.length === 0) {
          throw new Error("Agents not found");
        }

        return result.rows[0];
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to fetch agents");
      }
    },

    createdBy: async (parent, _, { db }) => {
      if (!parent.createdById) {
        return null;
      }

      try {
        const result = await db.query(
          `SELECT id, name FROM users WHERE id = $1`,
          [parent.createdById]
        );

        return result.rows[0] || null;
      } catch (error) {
        console.error("Database error (createdBy):", error);
        throw new Error("Failed to fetch createdBy user");
      }
    },

    lastModifiedBy: async (parent, _, { db }) => {
      if (!parent.lastModifiedById) {
        return null;
      }

      try {
        const result = await db.query(
          `SELECT id, name FROM users WHERE id = $1`,
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
