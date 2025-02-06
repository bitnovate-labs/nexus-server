export const agentCommissionResolvers = {
  Query: {
    agentCommissions: async (
      _,
      { projectId, designationId, salesCommissionType },
      { db, req }
    ) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      try {
        let query = `
          SELECT 
            ac.id,
            ac.project_id AS "projectId",
            ac.commission_scheme_id AS "commissionSchemeId",
            ac.sales_commission_type AS "salesCommissionType",
            ac.designation_id AS "designationId",
            ac.commission_type AS "commissionType",
            ac.commission_value AS "commissionValue",
            ac.overriding,
            ac.schedule_payment_type AS "schedulePaymentType",
            ac.schedule_payment_value AS "schedulePaymentValue",
            ac.created_by AS "createdById",
            ac.last_modified_by AS "lastModifiedById",
            TO_CHAR(ac.created_at, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS "createdAt",
            TO_CHAR(ac.last_modified_at, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS "lastModifiedAt"
          FROM agent_commissions ac
          WHERE ac.project_id = $1
        `;

        const params = [projectId];
        let paramCount = 1;

        if (designationId) {
          paramCount++;
          query += ` AND ac.designation_id = $${paramCount}`;
          params.push(designationId);
        }

        if (salesCommissionType) {
          paramCount++;
          query += ` AND ac.sales_commission_type = $${paramCount}`;
          params.push(salesCommissionType);
        }

        query += ` ORDER BY ac.id ASC`;

        const result = await db.query(query, params);
        return result.rows;
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to fetch agent commissions");
      }
    },

    agentCommission: async (_, { id }, { db, req }) => {
      if (!req.user || !id) {
        throw new Error("Not authenticated");
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
            ac.schedule_payment_value AS "schedulePaymentValue",
            ac.created_by AS "createdById",
            ac.last_modified_by AS "lastModifiedById",
            TO_CHAR(ac.created_at, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS "createdAt",
            TO_CHAR(ac.last_modified_at, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS "lastModifiedAt"
          FROM agent_commissions ac
          WHERE ac.id = $1`,
          [id]
        );

        if (result.rows.length === 0) {
          throw new Error("Agent commission not found");
        }

        return result.rows[0];
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to fetch agent commission");
      }
    },
  },

  Mutation: {
    createAgentCommission: async (_, args, { db, req }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      const {
        projectId,
        commissionSchemeId,
        salesCommissionType,
        designationId,
        commissionType,
        commissionValue,
        overriding,
        schedulePaymentType,
        schedulePaymentValue,
      } = args;

      try {
        const result = await db.query(
          `INSERT INTO agent_commissions (
            project_id,
            commission_scheme_id,
            sales_commission_type,
            designation_id,
            commission_type,
            commission_value,
            overriding,
            schedule_payment_type,
            schedule_payment_value,
            created_by,
            last_modified_by
          )
          VALUES ($1, NULLIF($2, 0), $3, $4, $5, $6, $7, $8, $9, $10, $10)
          RETURNING 
            id,
            project_id AS "projectId",
            commission_scheme_id AS "commissionSchemeId",
            sales_commission_type AS "salesCommissionType",
            designation_id AS "designationId",
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
            salesCommissionType,
            designationId,
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
        throw new Error("Failed to create agent commission: " + error.message);
      }
    },

    updateAgentCommission: async (_, args, { db, req }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      const {
        id,
        projectId,
        commissionSchemeId,
        salesCommissionType,
        designationId,
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
          `UPDATE agent_commissions
          SET 
            project_id = COALESCE($1, project_id),
            commission_scheme_id = NULLIF($2, 0),
            sales_commission_type = COALESCE($3, sales_commission_type),
            designation_id = COALESCE($4, designation_id),
            commission_type = COALESCE($5, commission_type),
            commission_value = COALESCE($6, commission_value),
            overriding = COALESCE($7, overriding),
            schedule_payment_type = COALESCE($8, schedule_payment_type),
            schedule_payment_value = COALESCE($9, schedule_payment_value),
            last_modified_by = $10,
            last_modified_at = CURRENT_TIMESTAMP
          WHERE id = $11
          RETURNING 
            id,
            project_id AS "projectId",
            commission_scheme_id AS "commissionSchemeId",
            sales_commission_type AS "salesCommissionType",
            designation_id AS "designationId",
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
            salesCommissionType,
            designationId,
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
          throw new Error("Agent commission not found");
        }

        return result.rows[0];
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to update agent commission");
      }
    },

    deleteAgentCommission: async (_, { id }, { db, req }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      try {
        const result = await db.query(
          "DELETE FROM agent_commissions WHERE id = $1 RETURNING id",
          [id]
        );

        return result.rowCount > 0;
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to delete agent commission");
      }
    },
  },

  AgentCommission: {
    project: async (parent, _, { db }) => {
      if (!parent.projectId) {
        throw new Error(
          "Missing projectId for the agent commission in resolvers"
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
        // throw new Error(
        //   "Missing commissionSchemeId for the agent commission in resolvers"
        // );
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

    designation: async (parent, _, { db }) => {
      if (!parent.designationId) {
        throw new Error(
          "Missing designationId for the agent commission in resolvers"
        );
      }

      try {
        const result = await db.query(
          `SELECT id, name FROM designations WHERE id = $1`,
          [parent.designationId]
        );

        if (result.rows.length === 0) {
          throw new Error("Designation not found");
        }

        return result.rows[0];
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to fetch designation");
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
