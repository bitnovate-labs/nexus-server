export const developerResolvers = {
  Query: {
    developers: async (_, __, { db, req }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      try {
        const result = await db.query(`
            SELECT 
              id,
              name,
              registration_no as "registrationNo",
              address,
              contact_person as "contactPerson",
              contact_no as "contactNo"
            FROM developers
            ORDER BY name ASC
          `);
        return result.rows;
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to fetch developers");
      }
    },

    developer: async (_, { id }, { db, req }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      try {
        const result = await db.query(
          `
            SELECT 
              id,
              name,
              registration_no as "registrationNo",
              address,
              contact_person as "contactPerson",
              contact_no as "contactNo"
            FROM developers
            WHERE id = $1
          `,
          [id]
        );

        return result.rows[0];
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to fetch developer");
      }
    },
  },

  Mutation: {
    createDeveloper: async (_, args, { req, db }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      try {
        const result = await db.query(
          `
            INSERT INTO developers (
              name,
              registration_no,
              address,
              contact_person,
              contact_no
            ) VALUES ($1, $2, $3, $4, $5)
            RETURNING 
              id,
              name,
              registration_no as "registrationNo",
              address,
              contact_person as "contactPerson",
              contact_no as "contactNo"
          `,
          [
            args.name,
            args.registrationNo,
            args.address,
            args.contactPerson,
            args.contactNo,
          ]
        );

        return result.rows[0];
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to create developer: " + error.message);
      }
    },

    updateDeveloper: async (_, { id, ...args }, { req, db }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      try {
        const result = await db.query(
          `
            UPDATE developers
            SET 
              name = COALESCE($1, name),
              registration_no = COALESCE($2, registration_no),
              address = COALESCE($3, address),
              contact_person = COALESCE($4, contact_person),
              contact_no = COALESCE($5, contact_no)
            WHERE id = $6
            RETURNING 
              id,
              name,
              registration_no as "registrationNo",
              address,
              contact_person as "contactPerson",
              contact_no as "contactNo"
          `,
          [
            args.name,
            args.registrationNo,
            args.address,
            args.contactPerson,
            args.contactNo,
            id,
          ]
        );

        return result.rows[0];
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to update developer");
      }
    },

    deleteDevelopers: async (_, { ids }, { req, db }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      try {
        await db.query("DELETE FROM developers WHERE id = ANY($1)", [ids]);
        return true;
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to delete developers");
      }
    },
  },
};
