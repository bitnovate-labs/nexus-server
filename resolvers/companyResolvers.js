export const companyResolvers = {
  Query: {
    companies: async (_, __, { db, req }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      try {
        const result = await db.query(`
            SELECT 
              c.id,
              c.name,
              c.display_name as "displayName",
              c.registration_no as "registrationNo",
              c.license_no as "licenseNo",
              c.income_tax_no as "incomeTaxNo",
              c.address,
              c.contact_no as "contactNo",
              c.fax,
              c.email,
              c.website,
              c.sst,
              c.sst_no as "sstNo",
              c.person_in_charge as "personInCharge",
              c.person_in_charge_nric as "personInChargeNric",
              c.person_in_charge_designation as "personInChargeDesignation",
              c.created_by as "createdById",
              c.last_modified_by as "lastModifiedById",
              cb.name as "createdByName",
              mb.name as "lastModifiedByName"
            FROM companies c
            LEFT JOIN users cb ON c.created_by = cb.id
            LEFT JOIN users mb ON c.last_modified_by = mb.id
            ORDER BY c.name ASC
          `);

        return result.rows.map((row) => ({
          ...row,
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
        throw new Error("Failed to fetch companies");
      }
    },

    company: async (_, { id }, { db, req }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      try {
        const result = await db.query(
          `
            SELECT 
              c.id,
              c.name,
              c.display_name as "displayName",
              c.registration_no as "registrationNo",
              c.license_no as "licenseNo",
              c.income_tax_no as "incomeTaxNo",
              c.address,
              c.contact_no as "contactNo",
              c.fax,
              c.email,
              c.website,
              c.sst,
              c.sst_no as "sstNo",
              c.person_in_charge as "personInCharge",
              c.person_in_charge_nric as "personInChargeNric",
              c.person_in_charge_designation as "personInChargeDesignation",
              c.created_by as "createdById",
              c.last_modified_by as "lastModifiedById",
              cb.name as "createdByName",
              mb.name as "lastModifiedByName"
            FROM companies c
            LEFT JOIN users cb ON c.created_by = cb.id
            LEFT JOIN users mb ON c.last_modified_by = mb.id
            WHERE c.id = $1
            `,
          [id]
        );

        const row = result.rows[0];
        if (!row) return null;

        return {
          ...row,
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
        throw new Error("Failed to fetch company");
      }
    },
  },

  Mutation: {
    createCompany: async (_, args, { req, db }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      try {
        const result = await db.query(
          `
            INSERT INTO companies (
              name,
              display_name,
              registration_no,
              license_no,
              income_tax_no,
              address,
              contact_no,
              fax,
              email,
              website,
              sst,
              sst_no,
              person_in_charge,
              person_in_charge_nric,
              person_in_charge_designation,
              created_by,
              last_modified_by
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $16)
            RETURNING 
              id,
              name,
              display_name as "displayName",
              registration_no as "registrationNo",
              license_no as "licenseNo",
              income_tax_no as "incomeTaxNo",
              address,
              contact_no as "contactNo",
              fax,
              email,
              website,
              sst,
              sst_no as "sstNo",
              person_in_charge as "personInCharge",
              person_in_charge_nric as "personInChargeNric",
              person_in_charge_designation as "personInChargeDesignation",
              created_by as "createdById",
              last_modified_by as "lastModifiedById"
            `,
          [
            args.name,
            args.displayName,
            args.registrationNo,
            args.licenseNo,
            args.incomeTaxNo,
            args.address,
            args.contactNo,
            args.fax,
            args.email,
            args.website,
            args.sst,
            args.sstNo,
            args.personInCharge,
            args.personInChargeNric,
            args.personInChargeDesignation,
            req.user.id,
          ]
        );

        return result.rows[0];
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to create company: " + error.message);
      }
    },

    updateCompany: async (_, { id, ...args }, { req, db }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      try {
        const result = await db.query(
          `
            UPDATE companies
            SET 
              name = COALESCE($1, name),
              display_name = COALESCE($2, display_name),
              registration_no = COALESCE($3, registration_no),
              license_no = COALESCE($4, license_no),
              income_tax_no = COALESCE($5, income_tax_no),
              address = COALESCE($6, address),
              contact_no = COALESCE($7, contact_no),
              fax = COALESCE($8, fax),
              email = COALESCE($9, email),
              website = COALESCE($10, website),
              sst = COALESCE($11, sst),
              sst_no = COALESCE($12, sst_no),
              person_in_charge = COALESCE($13, person_in_charge),
              person_in_charge_nric = COALESCE($14, person_in_charge_nric),
              person_in_charge_designation = COALESCE($15, person_in_charge_designation),
              last_modified_at = CURRENT_TIMESTAMP,
              last_modified_by = $16
            WHERE id = $17
            RETURNING 
              id,
              name,
              display_name as "displayName",
              registration_no as "registrationNo",
              license_no as "licenseNo",
              income_tax_no as "incomeTaxNo",
              address,
              contact_no as "contactNo",
              fax,
              email,
              website,
              sst,
              sst_no as "sstNo",
              person_in_charge as "personInCharge",
              person_in_charge_nric as "personInChargeNric",
              person_in_charge_designation as "personInChargeDesignation",
              created_by as "createdById",
              last_modified_by as "lastModifiedById"
            `,
          [
            args.name,
            args.displayName,
            args.registrationNo,
            args.licenseNo,
            args.incomeTaxNo,
            args.address,
            args.contactNo,
            args.fax,
            args.email,
            args.website,
            args.sst,
            args.sstNo,
            args.personInCharge,
            args.personInChargeNric,
            args.personInChargeDesignation,
            req.user.id,
            id,
          ]
        );

        return result.rows[0];
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to update company");
      }
    },

    deleteCompanies: async (_, { ids }, { req, db }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      try {
        await db.query("DELETE FROM companies WHERE id = ANY($1)", [ids]);
        return true;
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to delete companies");
      }
    },
  },
};
