import fs from "fs/promises";
import path from "path";
import { finished } from "stream/promises";
import { createWriteStream } from "fs";

const UPLOAD_DIR = path.join(process.cwd(), "uploads", "events");

export const eventAttachmentResolvers = {
  Query: {
    eventAttachments: async (_, { eventId }, { db, req }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      try {
        const result = await db.query(
          `SELECT 
            id,
            event_id as "eventId",
            filename,
            content_type as "contentType",
            size,
            url,
            created_at as "createdAt",
            created_by as "createdBy",
            last_modified_at as "lastModifiedAt",
            last_modified_by as "lastModifiedBy"
          FROM event_attachments 
          WHERE event_id = $1`,
          [eventId]
        );
        return result.rows;
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to fetch event attachments");
      }
    },
  },

  Mutation: {
    uploadEventAttachment: async (_, { eventId, file }, { db, req }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      const { createReadStream, filename, mimetype } = await file;

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      let fileStream = createReadStream();
      let size = 0;

      for await (const chunk of fileStream) {
        size += chunk.length;
        if (size > maxSize) {
          throw new Error("File is too large. Maximum size is 5MB.");
        }
      }

      // Reset stream for actual upload
      fileStream = createReadStream();
      const { name, ext } = path.parse(filename);

      // Generate unique filename
      const uniqueFilename = `${name}-${Date.now()}${ext}`;
      const filepath = path.join(UPLOAD_DIR, uniqueFilename);
      const fileUrl = `/uploads/events/${uniqueFilename}`;

      try {
        // Ensure upload directory exists
        await fs.mkdir(UPLOAD_DIR, { recursive: true });

        // Write file to disk
        const writeStream = createWriteStream(filepath);
        fileStream.pipe(writeStream);
        await finished(writeStream);

        // Get file size
        const stats = await fs.stat(filepath);

        // Save file metadata to database
        const result = await db.query(
          `INSERT INTO event_attachments (
            event_id,
            filename,
            content_type,
            size,
            url,
            created_by
          ) VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING 
            id,
            event_id as "eventId",
            filename,
            content_type as "contentType",
            size,
            url,
            created_at as "createdAt",
            created_by as "createdBy",
            last_modified_at as "lastModifiedAt",
            last_modified_by as "lastModifiedBy"`,
          [eventId, uniqueFilename, mimetype, stats.size, fileUrl, req.user.id]
        );

        return result.rows[0];
      } catch (error) {
        console.error("Upload error:", error);
        throw new Error("Failed to upload file");
      }
    },

    deleteEventAttachment: async (_, { id }, { db, req }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      try {
        // Get file info before deletion
        const fileResult = await db.query(
          "SELECT filename FROM event_attachments WHERE id = $1",
          [id]
        );

        if (fileResult.rows.length === 0) {
          throw new Error("Attachment not found");
        }

        const { filename } = fileResult.rows[0];
        const filepath = path.join(UPLOAD_DIR, filename);

        // Delete file from disk if it exists
        try {
          await fs.unlink(filepath);
        } catch (error) {
          console.error("File deletion error:", error);
          // Continue even if file doesn't exist on disk
        }

        // Delete from database
        await db.query("DELETE FROM event_attachments WHERE id = $1", [id]);

        return true;
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to delete attachment");
      }
    },
  },
};
