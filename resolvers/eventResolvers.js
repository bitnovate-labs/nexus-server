export const eventResolvers = {
  Query: {
    events: async (_, __, { db, req }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      try {
        const result = await db.query(`
            SELECT 
              e.id,
              e.name,
              TO_CHAR(e.date, 'YYYY-MM-DD') as date,
              e.time,
              e.venue,
              e.speaker,
              e.topic,
              e.limit_pax as "limitPax",
              e.designation_id AS "designationId",
              ur.name AS "designationName",
              e.branch_id AS "branchId",
              b.name AS "branchName",
              e.description,
              u1.id as "createdById",
              u1.name as "createdByName",
              u2.id as "lastModifiedById",
              u2.name as "lastModifiedByName"
            FROM events e
            LEFT JOIN users u1 ON e.created_by = u1.id
            LEFT JOIN users u2 ON e.last_modified_by = u2.id
            LEFT JOIN branches b ON e.branch_id = b.id
            LEFT JOIN user_roles ur ON e.designation_id = ur.id
            ORDER BY e.date DESC
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
        console.error("Database error:", error);
        throw new Error("Failed to fetch events");
      }
    },

    event: async (_, { id }, { db, req }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      try {
        const result = await db.query(
          `
            SELECT 
              e.id,
              e.name,
              TO_CHAR(e.date, 'YYYY-MM-DD') as date,
              e.time,
              e.venue,
              e.speaker,
              e.topic,
              e.limit_pax as "limitPax",
              e.designation_id AS "designationId",
              ur.name AS "designationName",
              e.branch_id AS "branchId",
              b.name AS "branchName",
              e.description,
              u1.id as "createdById",
              u1.name as "createdByName",
              u2.id as "lastModifiedById",
              u2.name as "lastModifiedByName"
            FROM events e
            LEFT JOIN users u1 ON e.created_by = u1.id
            LEFT JOIN users u2 ON e.last_modified_by = u2.id
            LEFT JOIN branches b ON e.branch_id = b.id
            LEFT JOIN user_roles ur ON e.designation_id = ur.id
            WHERE e.id = $1
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
        console.error("Database error:", error);
        throw new Error("Failed to fetch event");
      }
    },
  },

  Mutation: {
    createEvent: async (_, args, { req, db }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      const {
        name,
        date,
        time,
        venue,
        speaker,
        topic,
        limitPax,
        designationId,
        branchId,
        description,
      } = args;

      // Validate required fields
      if (!name || !date) {
        throw new UserInputError("Name and date are required fields");
      }

      try {
        const result = await db.query(
          `
            INSERT INTO events (
              name,
              date,
              time,
              venue,
              speaker,
              topic,
              limit_pax,
              designation_id,
              branch_id,
              description,
              created_by,
              last_modified_by
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $11)
            RETURNING 
              id,
              name,
              date,
              time,
              venue,
              speaker,
              topic,
              limit_pax AS "limitPax",
              designation_id AS "designationId",
              branch_id AS "branchId",
              description,
              created_by AS "createdById",
              last_modified_by AS "lastModifiedById"
            `,
          [
            name,
            date,
            time,
            venue,
            speaker,
            topic,
            limitPax,
            designationId,
            branchId,
            description,
            req.user.id,
          ]
        );

        const createdEvent = result.rows[0];

        // Fetch user details for createdBy field
        const userResult = await db.query(
          `SELECT id, name FROM users WHERE id = $1`,
          [req.user.id]
        );

        const createdBy = userResult.rows[0];

        return {
          ...createdEvent,
          createdBy,
          lastModifiedBy: createdBy,
        };
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to create event: " + error.message);
      }
    },

    updateEvent: async (_, args, { req, db }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      const {
        id,
        name,
        date,
        time,
        venue,
        speaker,
        topic,
        limitPax,
        designationId,
        branchId,
        description,
      } = args;

      try {
        const result = await db.query(
          `
            UPDATE events
            SET
              name = COALESCE($2, name),
		          date = COALESCE($3, date),
		          time = COALESCE($4, time),
		          venue = COALESCE($5, venue),
		          speaker = COALESCE($6, speaker),
		          topic = COALESCE($7, topic),
		          limit_pax = COALESCE($8, limit_pax),
              designation_id = COALESCE($9, designation_id),
              branch_id = COALESCE($10, branch_id),
              description = COALESCE($11, description),
		          last_modified_by = $12
            WHERE id = $1
            RETURNING 
              id,
              name,
              date,
              time,
              venue,
              speaker,
              topic,
              limit_pax AS "limitPax",
              designation_id AS "designationId",
              branch_id AS "branchId",
              description,
              created_by AS "createdById",
              last_modified_by AS "lastModifiedById"
            `,
          [
            id,
            name,
            date,
            time,
            venue,
            speaker,
            topic,
            limitPax,
            designationId,
            branchId,
            description,
            req.user.id,
          ]
        );

        if (result.rows.length === 0) {
          throw new Error("Event not found");
        }

        const event = result.rows[0];

        // Fetch branch and designation details if needed
        const branch = event.branchId
          ? await db
              .query(`SELECT id, name FROM branches WHERE id = $1`, [
                event.branchId,
              ])
              .then((res) => res.rows[0])
          : null;

        const designation = event.designationId
          ? await db
              .query(`SELECT id, name FROM user_roles WHERE id = $1`, [
                event.designationId,
              ])
              .then((res) => res.rows[0])
          : null;

        // Return the updated event
        return {
          id: event.id,
          name: event.name,
          date: event.date,
          time: event.time,
          venue: event.venue,
          speaker: event.speaker,
          topic: event.topic,
          limitPax: event.limitPax,
          branch: branch ? { id: branch.id, name: branch.name } : null,
          designation: designation
            ? { id: designation.id, name: designation.name }
            : null,
          description: event.description,
          createdBy: {
            id: event.createdById,
            name: req.user.name || "Unknown User",
          },
          lastModifiedBy: {
            id: event.lastModifiedById,
            name: req.user.name,
          },
        };
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to update event");
      }
    },

    deleteEvents: async (_, { ids }, { req, db }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      if (!Array.isArray(ids) || ids.length === 0) {
        throw new UserInputError("At least one ID must be provided");
      }

      try {
        const result = await db.query("DELETE FROM events WHERE id = ANY($1)", [
          ids,
        ]);

        return result.rowCount > 0;
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to delete events");
      }
    },
  },
};
