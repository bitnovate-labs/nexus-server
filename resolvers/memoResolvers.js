export const memoResolvers = {
  Query: {
    memos: async (_, __, { db, req }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      try {
        // Fetch only the necessary fields from memos (to avoid overfetching data)
        const result = await db.query(`
          SELECT 
            m.id,
            TO_CHAR(m.date, 'YYYY-MM-DD') as date,
            m.title,
            TO_CHAR(m.validity_from, 'YYYY-MM-DD') as "validityFrom",
            TO_CHAR(m.validity_to, 'YYYY-MM-DD') as "validityTo",
            m.branch_id AS "branchId",
            b.name AS "branchName",
            m.designation_id AS "designationId",
            d.name AS "designationName",
            m.description,
            u1.id as "createdById",
            u1.name as "createdByName",
            u2.id as "lastModifiedById",
            u2.name as "lastModifiedByName"
          FROM memos m
          LEFT JOIN users u1 ON m.created_by = u1.id
          LEFT JOIN users u2 ON m.last_modified_by = u2.id
          LEFT JOIN branches b ON m.branch_id = b.id
          LEFT JOIN designations d ON m.designation_id = d.id
          ORDER BY m.date DESC
        `);

        return result.rows.map((row) => ({
          ...row,
          branch: row.branchId
            ? { id: row.branchId, name: row.branchName }
            : null,
          designation: row.designationId
            ? { id: row.designationId, name: row.designationName }
            : null,
          createdBy: row.createdById
            ? {
                id: row.createdById,
                name: row.createdByName,
              }
            : null,
          lastModifiedBy: row.lastModifiedById
            ? {
                id: row.lastModifiedById,
                name: row.lastModifiedByName,
              }
            : null,
        }));
      } catch (error) {
        console.error("Error fetching memos:", error);
        throw new Error("Failed to fetch memos");
      }
    },

    memo: async (_, { id }, { db, req }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      try {
        // Fetch only the necessary fields for a single memo
        const result = await db.query(
          `
          SELECT 
            m.id,
            TO_CHAR(m.date, 'YYYY-MM-DD') as date,
            m.title,
            TO_CHAR(m.validity_from, 'YYYY-MM-DD') as "validityFrom",
            TO_CHAR(m.validity_to, 'YYYY-MM-DD') as "validityTo",
            m.branch_id AS "branchId",
            b.name AS "branchName",
            m.designation_id AS "designationId",
            d.name AS "designationName",
            m.description,
            u1.id as "createdById",
            u1.name as "createdByName",
            u2.id as "lastModifiedById",
            u2.name as "lastModifiedByName"
          FROM memos m
          LEFT JOIN users u1 ON m.created_by = u1.id
          LEFT JOIN users u2 ON m.last_modified_by = u2.id
          LEFT JOIN branches b ON m.branch_id = b.id
          LEFT JOIN designations d ON m.designation_id = d.id
          WHERE m.id = $1
        `,
          [id]
        );

        // If no record is found, return null
        const row = result.rows[0];
        if (!row) return null;

        // Return the memo with createdBy and lastModifiedBy transformed
        return {
          ...row,
          branch: row.branchId
            ? { id: row.branchId, name: row.branchName }
            : null,
          designation: row.designationId
            ? { id: row.designationId, name: row.designationName }
            : null,
          createdBy: row.createdById
            ? {
                id: row.createdById,
                name: row.createdByName,
              }
            : null,
          lastModifiedBy: row.lastModifiedById
            ? {
                id: row.lastModifiedById,
                name: row.lastModifiedByName,
              }
            : null,
        };
      } catch (error) {
        console.error("Error fetching memo:", error);
        throw new Error("Failed to fetch memo");
      }
    },
  },

  Mutation: {
    createMemo: async (_, args, { req, db }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      const {
        date,
        title,
        validityFrom,
        validityTo,
        branchId,
        designationId,
        description,
      } = args;

      // Validate required fields
      if (!date || !title) {
        throw new UserInputError("Date and title are required fields");
      }

      try {
        const result = await db.query(
          `
          INSERT INTO memos (
            date,
            title,
            validity_from,
            validity_to,
            branch_id,
            designation_id,
            description,
            created_by,
            last_modified_by
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $8)
          RETURNING 
            id, 
            date, 
            title, 
            validity_from AS "validityFrom", 
            validity_to AS "validityTo", 
            branch_id AS "branchId", 
            designation_id AS "designationId", 
            description, 
            created_by AS "createdById",
            last_modified_by AS "lastModifiedById";
        `,
          [
            date,
            title,
            validityFrom,
            validityTo,
            branchId,
            designationId,
            description,
            req.user.id,
          ]
        );

        const createdMemo = result.rows[0];

        // Fetch user details for createdBy field
        const userResult = await db.query(
          `SELECT id, name FROM users WHERE id = $1`,
          [req.user.id]
        );

        const createdBy = userResult.rows[0];

        return {
          ...createdMemo,
          createdBy, // Add createdBy object
          lastModifiedBy: createdBy, // Optionally, add lastModifiedBy
        };
      } catch (error) {
        console.error("Error creating memo:", error);
        throw new Error("Failed to create memo");
      }
    },

    updateMemo: async (_, args, { req, db }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      const {
        id,
        date,
        title,
        validityFrom,
        validityTo,
        branchId,
        designationId,
        description,
      } = args;

      try {
        const result = await db.query(
          `
          UPDATE memos
          SET 
            date = COALESCE($2, date),
		        title = COALESCE($3, title),
		        validity_from = COALESCE($4, validity_from),
		        validity_to = COALESCE($5, validity_to),
		        branch_id = COALESCE($6, branch_id),
		        designation_id = COALESCE($7, designation_id),
		        description = COALESCE($8, description),
		        last_modified_by = $9
          WHERE id = $1
          RETURNING 
            id, 
            date, 
            title, 
            validity_from AS "validityFrom", 
            validity_to AS "validityTo", 
            branch_id AS "branchId", 
            designation_id AS "designationId", 
            description,
            created_by AS "createdById",
            last_modified_by AS "lastModifiedById"
          `,
          [
            id,
            title,
            validityFrom,
            validityTo,
            branchId,
            designationId,
            description,
            req.user.id,
          ]
        );

        if (result.rows.length === 0) {
          throw new Error("Memo not found");
        }

        const memo = result.rows[0];

        // Fetch branch and designation details if needed
        const branch = memo.branchId
          ? await db
              .query(`SELECT id, name FROM branches WHERE id = $1`, [
                memo.branchId,
              ])
              .then((res) => res.rows[0])
          : null;

        const designation = memo.designationId
          ? await db
              .query(`SELECT id, name FROM designations WHERE id = $1`, [
                memo.designationId,
              ])
              .then((res) => res.rows[0])
          : null;

        // Return the updated memo
        return {
          id: memo.id,
          date: memo.date,
          title: memo.title,
          validityFrom: memo.validityFrom,
          validityTo: memo.validityTo,
          description: memo.description,
          branch: branch ? { id: branch.id, name: branch.name } : null,
          designation: designation
            ? { id: designation.id, name: designation.name }
            : null,
          createdBy: {
            id: memo.createdById,
            name: req.user.name || "Unknown User",
          },
          lastModifiedBy: {
            id: memo.lastModifiedById,
            name: req.user.name,
          },
        };
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to update memo");
      }
    },

    deleteMemos: async (_, { ids }, { req, db }) => {
      if (!req.user) {
        throw new AuthenticationError("Not authenticated");
      }

      if (!Array.isArray(ids) || ids.length === 0) {
        throw new UserInputError("At least one ID must be provided");
      }

      try {
        const result = await db.query("DELETE FROM memos WHERE id = ANY($1)", [
          ids,
        ]);

        return result.rowCount > 0;
      } catch (error) {
        console.error("Error deleting memos:", error);
        throw new Error("Failed to delete memos");
      }
    },
  },
};
