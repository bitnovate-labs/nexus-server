export const eventResolvers = {
  Query: {
    events: async (_, __, { db, req }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      try {
        const result = await db.query(`
            SELECT 
              id,
              name,
              TO_CHAR(date, 'YYYY-MM-DD') as date,
              time,
              venue,
              speaker,
              topic,
              limit_pax as "limitPax",
              designation,
              branch,
              description,
              TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as "createdAt",
              created_by as "createdBy",
              TO_CHAR(last_modified_at, 'YYYY-MM-DD HH24:MI:SS') as "lastModifiedAt",
              last_modified_by as "lastModifiedBy"
            FROM events
            ORDER BY date DESC
          `);
        return result.rows;
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
              id,
              name,
              TO_CHAR(date, 'YYYY-MM-DD') as date,
              time,
              venue,
              speaker,
              topic,
              limit_pax as "limitPax",
              designation,
              branch,
              description,
              TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as "createdAt",
              created_by as "createdBy",
              TO_CHAR(last_modified_at, 'YYYY-MM-DD HH24:MI:SS') as "lastModifiedAt",
              last_modified_by as "lastModifiedBy"
            FROM events
            WHERE id = $1
            `,
          [id]
        );

        return result.rows[0];
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
              designation,
              branch,
              description
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING 
              id,
              name,
              date,
              time,
              venue,
              speaker,
              topic,
              limit_pax as "limitPax",
              designation,
              branch,
              description,
              created_at as "createdAt",
              created_by as "createdBy",
              last_modified_at as "lastModifiedAt",
              last_modified_by as "lastModifiedBy"
            `,
          [
            args.name,
            args.date,
            args.time,
            args.venue,
            args.speaker,
            args.topic,
            args.limitPax,
            args.designation,
            args.branch,
            args.description,
          ]
        );

        return result.rows[0];
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to create event: " + error.message);
      }
    },

    updateEvent: async (_, { id, ...args }, { req, db }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      try {
        const updateFields = [];
        const values = [id];
        let paramCount = 1;

        Object.entries(args).forEach(([key, value]) => {
          if (value !== undefined) {
            const fieldName = key === "limitPax" ? "limit_pax" : key;
            updateFields.push(`${fieldName} = $${++paramCount}`);
            values.push(value);
          }
        });

        if (updateFields.length === 0) return null;

        const result = await db.query(
          `
            UPDATE events
            SET ${updateFields.join(", ")}
            WHERE id = $1
            RETURNING 
              id,
              name,
              date,
              time,
              venue,
              speaker,
              topic,
              limit_pax as "limitPax",
              designation,
              branch,
              description,
              created_at as "createdAt",
              created_by as "createdBy",
              last_modified_at as "lastModifiedAt",
              last_modified_by as "lastModifiedBy"
            `,
          values
        );

        return result.rows[0];
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to update event");
      }
    },

    deleteEvents: async (_, { ids }, { req, db }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      try {
        await db.query("DELETE FROM events WHERE id = ANY($1::uuid[])", [ids]);
        return true;
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to delete events");
      }
    },
  },
};
