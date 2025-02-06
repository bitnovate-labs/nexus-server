export const purchasersResolvers = {
  Query: {
    purchasers: async (_, __, { db, req }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      try {
        const result = await db.query(
          `
              SELECT 
                p.id,
                p.name,
                p.registration_no AS "registrationNo",
                p.address,
                p.contact_person AS "contactPerson",
                p.contact_no AS "contactNo",
                p.email
              FROM purchasers p
              ORDER BY p.id ASC
            `
        );

        return result.rows;
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to fetch purchasers");
      }
    },

    purchaser: async (_, { id }, { db, req }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      try {
        const result = await db.query(
          `
                SELECT 
                  p.id,
                  p.name,
                  p.registration_no AS "registrationNo",
                  p.address,
                  p.contact_person AS "contactPerson",
                  p.contact_no AS "contactNo",
                  p.email
                FROM purchasers p
                WHERE p.id = $1
              `,
          [id]
        );

        return result.rows[0];
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to fetch purchaser");
      }
    },
  },

  Mutation: {
    createPurchaser: async (_, args, { db, req }) => {
      if (!req.user) {
        throw new Error("Not authorized");
      }

      const { name, registrationNo, address, contactPerson, contactNo, email } =
        args;

      try {
        const result = await db.query(
          `
              INSERT INTO purchasers (
                name, 
                registration_no, 
                address,
                contact_person,
                contact_no,
                email,
                created_by,
                last_modified_by 
              )
              VALUES ($1, $2, $3, $4, $5, $6, $7, $7)
              RETURNING 
                id, 
                name,
                registration_no AS "registrationNo", 
                address,
                contact_person AS "contactPerson",
                contact_no AS "contactNo",
                email,
                created_by AS "createdBy",
                last_modified_by AS "lastModifiedBy"
            `,
          [
            name,
            registrationNo,
            address,
            contactPerson,
            contactNo,
            email,
            req.user.id,
          ]
        );

        if (!result.rows.length) {
          throw new Error("Failed to create purchaser");
        }

        return result.rows[0];
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to create purchaser");
      }
    },

    updatePurchaser: async (_, args, { db, req }) => {
      if (!req.user) {
        throw new Error("Not authorized");
      }

      const {
        id,
        name,
        registrationNo,
        address,
        contactPerson,
        contactNo,
        email,
      } = args;

      try {
        const result = await db.query(
          `
              UPDATE purchasers
              SET
                name = COALESCE($1, name), 
                registration_no = COALESCE($2, registration_no), 
                address = COALESCE($3, address),
                contact_person = COALESCE($4, contact_person),
                contact_no = COALESCE($5, contact_no),
                email = COALESCE($6, email),
                last_modified_by = $7
              WHERE id = $8
              RETURNING 
                id, 
                name,
                registration_no AS "registrationNo", 
                address,
                contact_person AS "contactPerson",
                contact_no AS "contactNo",
                email,
                last_modified_by AS "lastModifiedBy"
            `,
          [
            name,
            registrationNo,
            address,
            contactPerson,
            contactNo,
            email,
            req.user.id,
            id,
          ]
        );

        if (!result.rows.length) {
          throw new Error("Failed to update purchaser");
        }

        return result.rows[0];
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to update purchaser");
      }
    },

    deletePurchasers: async (_, { ids }, { db, req }) => {
      if (!req.user) {
        throw new Error("Not authorized");
      }

      try {
        const result = await db.query(
          "DELETE FROM purchasers WHERE id = ANY($1)",
          [ids]
        );

        return result.rowCount > 0;
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to delete purchaser");
      }
    },
  },

  Purchaser: {
    createdBy: async (parent, _, { db }) => {
      if (!parent.createdBy) {
        return null;
      }

      try {
        const result = await db.query(
          `SELECT id, name FROM users WHERE id = $1`,
          [parent.createdBy]
        );

        return result.rows[0] || null;
      } catch (error) {
        console.error("Database error (createdBy):", error);
        throw new Error("Failed to fetch createdBy user");
      }
    },

    lastModifiedBy: async (parent, _, { db }) => {
      if (!parent.lastModifiedBy) {
        return null;
      }

      try {
        const result = await db.query(
          `SELECT id, name FROM users WHERE id = $1`,
          [parent.lastModifiedBy]
        );

        return result.rows[0] || null;
      } catch (error) {
        console.error("Database error (lastModifiedBy):", error);
        throw new Error("Failed to fetch lastModifiedBy user");
      }
    },
  },
};
