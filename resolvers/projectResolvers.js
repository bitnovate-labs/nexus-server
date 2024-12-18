export const projectResolvers = {
  Query: {
    projects: async (_, __, { db, req }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      try {
        const result = await db.query(`
          SELECT 
            p.id,
            p.company, 
            p.name,
            p.developer_id as "developerId",
            p.developer_pay_tax as "developerPayTax",
            p.state_id as "stateId",
            p.description,
            p.active,
            p.created_by as "createdBy",
            p.created_at as "createdAt",
            p.last_modified_by as "lastModifiedBy",
            p.last_modified_at as "lastModifiedAt",
            u1.name as "createdByName",
            u2.name as "lastModifiedByName",
            d.name as "developerName",
            s.name as "stateName"
          FROM projects p
          LEFT JOIN users u1 ON p.created_by = u1.id
          LEFT JOIN users u2 ON p.last_modified_by = u2.id
          LEFT JOIN developers d ON p.developer_id = d.id
          LEFT JOIN states s ON p.state_id = s.id
          ORDER BY p.name ASC
        `);

        const projects = result.rows.map((row) => ({
          ...row,
          developer: row.developerId
            ? {
                id: row.developerId,
                name: row.developerName,
              }
            : null,
          state: row.stateId
            ? {
                id: row.stateId,
                name: row.stateName,
              }
            : null,
          createdBy: row.createdBy
            ? {
                id: row.createdBy,
                name: row.createdByName,
              }
            : null,
          lastModifiedBy: row.lastModifiedBy
            ? {
                id: row.lastModifiedBy,
                name: row.lastModifiedByName,
              }
            : null,
        }));

        return projects;
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to fetch projects");
      }
    },

    project: async (_, { id }, { db, req }) => {
      if (!req.user || !id) {
        console.log("Not authenticated or missing ID");
        throw new Error("Not authenticated");
      }

      try {
        // Fetch project with related data
        const result = await db.query(
          `
          SELECT
            p.id,
            p.company,
            p.name,
            TO_CHAR(p.created_at, 'YYYY-MM-DD HH24:MI:SS') as "createdAt",
            TO_CHAR(p.last_modified_at, 'YYYY-MM-DD HH24:MI:SS') as "lastModifiedAt",
            u1.name as "createdByName",
            u2.name as "lastModifiedByName",
            d.name as developer_name,
            d.registration_no as developer_registration_no,
            s.name as state_name
          FROM projects p
          LEFT JOIN users u1 ON p.created_by = u1.id
          LEFT JOIN users u2 ON p.last_modified_by = u2.id
          LEFT JOIN developers d ON p.developer_id = d.id
          LEFT JOIN states s ON p.state_id = s.id
          WHERE p.id = $1
        `,
          [id]
        );

        console.log(`Query result:`, result.rows[0]);

        if (!result.rows[0]) {
          console.log(`Project with ID ${id} not found`);
          throw new Error("Project not found");
        }

        const project = result.rows[0];

        // Fetch unit types
        const unitTypes = await db.query(
          `
          SELECT 
            ut.*,
            u1.name as created_by_name,
            u2.name as last_modified_by_name
          FROM project_unit_types ut
          LEFT JOIN users u1 ON ut.created_by = u1.id
          LEFT JOIN users u2 ON ut.last_modified_by = u2.id
          WHERE ut.project_id = $1
          ORDER BY ut.name ASC
        `,
          [id]
        );

        // Fetch schedules
        const schedules = await db.query(
          `
          SELECT 
            s.*,
            u1.name as created_by_name,
            u2.name as last_modified_by_name
          FROM project_schedules s
          LEFT JOIN users u1 ON s.created_by = u1.id
          LEFT JOIN users u2 ON s.last_modified_by = u2.id
          WHERE s.project_id = $1
          ORDER BY s.sequence ASC
        `,
          [id]
        );

        // Fetch project commission scheme
        // Upload: GraphQLUpload,

        const commissionSchemes = await db.query(
          `
        SELECT 
            pcs.id,
            pcs.from_date as "fromDate",
            pcs.to_date as "toDate",
            TO_CHAR(pcs.from_date, 'YYYY-MM-DD') as "fromDate",
            TO_CHAR(pcs.to_date, 'YYYY-MM-DD') as "toDate",
            pcs.min_unit as "minUnit",
            pcs.max_unit as "maxUnit",
            COALESCE(commission_value, 0) AS commission_value,  
            COALESCE(commission_type, 'percentage') AS commission_type,  
            pcs.created_at as "createdAt",
            pcs.last_modified_at as "lastModifiedAt",
            u1.name as "createdByName",
            u2.name as "lastModifiedByName",
            put.id as "unitTypeId",
            put.name as "unitTypeName"
          FROM project_commission_schemes pcs
          LEFT JOIN users u1 ON pcs.created_by = u1.id
          LEFT JOIN users u2 ON pcs.last_modified_by = u2.id
          LEFT JOIN project_unit_types put ON pcs.unit_type_id = put.id
          WHERE pcs.project_id = $1
          ORDER BY pcs.from_date ASC
        `,
          [id]
        );

        ///-------------------------------

        console.log(`Schedule result:`, result.rows[0]);

        return {
          ...project,
          developer: project.developer_id
            ? {
                id: Number(project.developer_id),
                name: project.developer_name,
                registrationNo: project.developer_registration_no,
              }
            : null,
          state: project.state_id
            ? {
                id: Number(project.state_id),
                name: project.state_name,
              }
            : null,
          createdBy: project.created_by
            ? {
                id: Number(project.created_by),
                name: project.createdByName,
              }
            : null,
          lastModifiedBy: project.last_modified_by
            ? {
                id: Number(project.last_modified_by),
                name: project.lastModifiedByName,
              }
            : null,
          unitTypes: unitTypes.rows.map((ut) => ({
            ...ut,
            createdBy: ut.created_by
              ? {
                  id: ut.created_by,
                  name: ut.created_by_name,
                }
              : null,
            lastModifiedBy: ut.last_modified_by
              ? {
                  id: ut.last_modified_by,
                  name: ut.last_modified_by_name,
                }
              : null,
          })),
          schedules: schedules.rows.map((s) => ({
            ...s,
            createdBy: s.created_by
              ? {
                  id: s.created_by,
                  name: s.created_by_name,
                }
              : null,
            lastModifiedBy: s.last_modified_by
              ? {
                  id: s.last_modified_by,
                  name: s.last_modified_by_name,
                }
              : null,
          })),
          commissionSchemes: commissionSchemes.rows.map((row) => ({
            ...row,
            id: row.id,
            unitType: row.unitTypeId
              ? { id: row.unitTypeId, name: row.unitTypeName }
              : null,
            fromDate: row.fromDate,
            toDate: row.toDate,
            minUnit: row.minUnit,
            maxUnit: row.maxUnit,
            commissionType: row.commission_type,
            commissionValue: row.commission_value,
            createdBy: row.createdByName ? { name: row.createdByName } : null,
            createdAt: row.createdAt,
            lastModifiedBy: row.lastModifiedByName
              ? { name: row.lastModifiedByName }
              : null,
            lastModifiedAt: row.lastModifiedAt,
          })),
        };
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to fetch project");
      }
    },
  },

  // ------------------------------------ MUTATIONS ------------------------------------

  Mutation: {
    // CREATE PROJECT
    createProject: async (
      _,
      {
        company,
        name,
        developerId,
        developerPayTax,
        stateId,
        description,
        active,
      },
      { db, req }
    ) => {
      if (!req.user) {
        throw new Error("User is not authenticated");
      }

      try {
        const result = await db.query(
          `
          INSERT INTO projects (
            company,
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
          RETURNING *
        `,
          [
            company,
            name,
            developerId,
            developerPayTax ?? false,
            stateId,
            description,
            active ?? true,
            req.user.userId,
          ]
        );

        if (!result.rows[0]) {
          throw new Error("Failed to create project");
        }

        // Fetch related data
        const projectData = await db.query(
          `
          SELECT 
            d.name as developer_name,
            d.registration_no as developer_registration_no,
            s.name as state_name,
            u1.name as created_by_name,
            u2.name as last_modified_by_name
          FROM developers d
          LEFT JOIN states s ON s.id = $1
          LEFT JOIN users u1 ON u1.id = $2
          LEFT JOIN users u2 ON u2.id = $2
          WHERE d.id = $3
        `,
          [stateId, req.user.userId, developerId]
        );

        const relatedData = projectData.rows[0] || {};
        const project = result.rows[0];

        return {
          ...project,
          developer: project.developer_id
            ? {
                id: project.developer_id,
                name: relatedData.developer_name,
                registrationNo: relatedData.developer_registration_no,
              }
            : null,
          state: project.state_id
            ? {
                id: project.state_id,
                name: relatedData.state_name,
              }
            : null,
          createdBy: {
            id: req.user.userId,
            name: relatedData.created_by_name,
          },
          lastModifiedBy: {
            id: req.user.userId,
            name: relatedData.last_modified_by_name,
          },
        };
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to create project: " + error.message);
      }
    },

    // ------ PROJECT UNIT TYPE ----------------------------------------
    // CREATE
    createProjectUnitType: async (_, { projectId, name }, { db, req }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

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
            name,
            created_by,
            created_at,
            last_modified_by,
            last_modified_at
        `,
          [projectId, name, req.user.userId]
        );

        const unitType = result.rows[0];

        return {
          ...unitType,
          createdBy: { id: req.user.userId, name: req.user.username },
          lastModifiedBy: { id: req.user.userId, name: req.user.username },
        };
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to create unit type");
      }
    },

    // UPDATE
    updateProjectUnitType: async (_, { id, name }, { db, req }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      try {
        const result = await db.query(
          `
          UPDATE project_unit_types
          SET 
            name = $1,
            last_modified_by = $2,
            last_modified_at = CURRENT_TIMESTAMP
          WHERE id = $3
          RETURNING 
            id, 
            name,
            created_by,
            created_at,
            last_modified_by,
            last_modified_at
        `,
          [name, req.user.userId, id]
        );

        if (!result.rows[0]) {
          throw new Error("Unit type not found");
        }

        const unitType = result.rows[0];

        return {
          ...unitType,
          lastModifiedBy: { id: req.user.userId, name: req.user.username },
        };
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to update unit type");
      }
    },

    // DELETE
    deleteProjectUnitType: async (_, { id }, { db, req }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      try {
        const result = await db.query(
          "DELETE FROM project_unit_types WHERE id = $1",
          [id]
        );

        return result.rowCount > 0;
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to delete unit type");
      }
    },

    // ------ PROJECT SCHEDULE ----------------------------------------
    // CREATE
    createProjectSchedule: async (
      _,
      { projectId, name, sequence },
      { db, req }
    ) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

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
            name,
            sequence,
            created_by,
            created_at,
            last_modified_by,
            last_modified_at
        `,
          [projectId, name, sequence, req.user.userId]
        );

        const schedule = result.rows[0];

        return {
          ...schedule,
          createdBy: { id: req.user.userId, name: req.user.username },
          lastModifiedBy: { id: req.user.userId, name: req.user.username },
        };
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to create schedule");
      }
    },

    // UPDATE
    updateProjectSchedule: async (_, { id, name, sequence }, { db, req }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

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
            created_by,
            created_at,
            last_modified_by,
            last_modified_at
        `,
          [name, sequence, req.user.userId, id]
        );

        if (!result.rows[0]) {
          throw new Error("Schedule not found");
        }

        const schedule = result.rows[0];

        return {
          ...schedule,
          lastModifiedBy: { id: req.user.userId, name: req.user.username },
        };
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to update schedule");
      }
    },

    // DELETE
    deleteProjectSchedule: async (_, { id }, { db, req }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      try {
        const result = await db.query(
          "DELETE FROM project_schedules WHERE id = $1",
          [id]
        );

        return result.rowCount > 0;
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to delete schedule");
      }
    },

    // ------ PROJECT COMMISSION SCHEME ---------------------------------------
    // CREATE
    createProjectCommissionScheme: async (_, args, { db, req }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

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
          RETURNING *
        `,
          [
            args.projectId,
            args.unitTypeId,
            args.fromDate,
            args.toDate,
            args.minUnit,
            args.maxUnit,
            args.commissionType,
            args.commissionValue,
            req.user.userId,
          ]
        );

        return {
          ...result.rows[0],
          createdBy: { id: req.user.userId, name: req.user.username },
          lastModifiedBy: { id: req.user.userId, name: req.user.username },
        };
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to create commission scheme");
      }
    },

    // UPDATE
    updateProjectCommissionScheme: async (_, args, { db, req }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      try {
        const result = await db.query(
          `
          UPDATE project_commission_schemes
          SET
            project_id = COALESCE($1, project_id),
            unit_type_id = COALESCE($2, unit_type_id),
            from_date = COALESCE($3, from_date),
            to_date = COALESCE($4, to_date),
            min_unit = COALESCE($5, min_unit),
            max_unit = COALESCE($6, max_unit),
            commission_type = COALESCE($7, commission_type),
            commission_value = COALESCE($8, commission_value),
            last_modified_by = $9,
            last_modified_at = CURRENT_TIMESTAMP
          WHERE id = $10
          RETURNING *
        `,
          [
            args.projectId,
            args.unitTypeId,
            args.fromDate,
            args.toDate,
            args.minUnit,
            args.maxUnit,
            args.commissionType,
            args.commissionValue,
            req.user.userId,
            args.id,
          ]
        );

        if (!result.rows[0]) {
          throw new Error("Commission scheme not found");
        }

        return {
          ...result.rows[0],
          lastModifiedBy: { id: req.user.userId, name: req.user.username },
        };
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to update commission scheme");
      }
    },

    // DELETE
    deleteProjectCommissionScheme: async (_, { id }, { db, req }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      try {
        const result = await db.query(
          "DELETE FROM project_commission_schemes WHERE id = $1",
          [id]
        );

        return result.rowCount > 0;
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to delete schedule");
      }
    },

    // ------ AGENT COMMISSION SCHEME ---------------------------------------
    // CREATE
    createAgentCommission: async (_, args, { db, req }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      try {
        const result = await db.query(
          `
          INSERT INTO agent_commissions (
            project_id,
            commissionSchemeId,
            salesCommissionType,
            designationId,
            commission_type,
            commission_value,
            overriding,
            schedulePaymentType,
            schedulePaymentValue,
            created_by,
            last_modified_by
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $10)
          RETURNING *
        `,
          [
            args.projectId,
            args.commissionSchemeId,
            args.salesCommissionType,
            args.designationId,
            args.commissionType,
            args.commissionValue,
            args.overriding,
            args.schedulePaymentType,
            args.schedulePaymentValue,
            req.user.userId,
          ]
        );

        return {
          ...result.rows[0],
          createdBy: { id: req.user.userId, name: req.user.username },
          lastModifiedBy: { id: req.user.userId, name: req.user.username },
        };
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to create agent commission scheme");
      }
    },

    // UPDATE
    // updateAgentCommission: async (_, args, { db, req }) => {
    //   if (!req.user) {
    //     throw new Error("Not authenticated");
    //   }

    //   try {
    //     const result = await db.query(
    //       `
    //       UPDATE project_commission_schemes
    //       SET
    //         project_id = COALESCE($1, project_id),
    //         unit_type_id = COALESCE($2, unit_type_id),
    //         from_date = COALESCE($3, from_date),
    //         to_date = COALESCE($4, to_date),
    //         min_unit = COALESCE($5, min_unit),
    //         max_unit = COALESCE($6, max_unit),
    //         commission_type = COALESCE($7, commission_type),
    //         commission_value = COALESCE($8, commission_value),
    //         last_modified_by = $9,
    //         last_modified_at = CURRENT_TIMESTAMP
    //       WHERE id = $10
    //       RETURNING *
    //     `,
    //       [
    //         args.projectId,
    //         args.unitTypeId,
    //         args.fromDate,
    //         args.toDate,
    //         args.minUnit,
    //         args.maxUnit,
    //         args.commissionType,
    //         args.commissionValue,
    //         req.user.userId,
    //         args.id,
    //       ]
    //     );

    //     if (!result.rows[0]) {
    //       throw new Error("Commission scheme not found");
    //     }

    //     return {
    //       ...result.rows[0],
    //       lastModifiedBy: { id: req.user.userId, name: req.user.username },
    //     };
    //   } catch (error) {
    //     console.error("Database error:", error);
    //     throw new Error("Failed to update commission scheme");
    //   }
    // },

    // DELETE
    // deleteAgentCommission: async (_, { id }, { db, req }) => {
    //   if (!req.user) {
    //     throw new Error("Not authenticated");
    //   }

    //   try {
    //     const result = await db.query(
    //       "DELETE FROM project_commission_schemes WHERE id = $1",
    //       [id]
    //     );

    //     return result.rowCount > 0;
    //   } catch (error) {
    //     console.error("Database error:", error);
    //     throw new Error("Failed to delete schedule");
    //   }
    // },
  },
};
