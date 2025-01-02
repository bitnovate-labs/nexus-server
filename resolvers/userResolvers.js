import {
  generateToken,
  comparePasswords,
  hashPassword,
} from "../utils/auth.js";
import { GraphQLUpload } from "graphql-upload-minimal";
import { finished } from "stream/promises";
import fs from "fs/promises";
import path from "path";

export const userResolvers = {
  Upload: GraphQLUpload,

  User: {
    agent: async (parent, _, { db }) => {
      const result = await db.query(
        `
        SELECT leader, recruiter
        FROM agents
        WHERE email = $1
      `,
        [parent.email]
      );

      return result.rows[0] || null;
    },
  },

  Query: {
    me: async (_, __, { req, db }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      const result = await db.query(
        `
        SELECT 
          u.id, 
          u.name, 
          u.username, 
          u.email, 
          u.mobile, 
          u.role, 
          u.active,
          u.avatar_id,
          encode(i.data, 'base64') as avatar_data,
          i.mime_type
        FROM users u
        LEFT JOIN images i ON u.avatar_id = i.id
        WHERE u.id = $1
      `,
        [req.user.userId]
      );

      const user = result.rows[0];
      if (!user) return null;

      return {
        ...user,
        avatarUrl: user.avatar_data
          ? `data:${user.mime_type};base64,${user.avatar_data}`
          : null,
      };
    },

    users: async (_, __, { req, db }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      if (req.user.role !== "ADMIN") {
        throw new Error("Not authorized");
      }

      try {
        const result = await db.query(
          "SELECT id, name, username, email, mobile, role, active FROM users ORDER BY id DESC"
        );
        return result.rows;
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to fetch users");
      }
    },
  },

  Mutation: {
    login: async (_, { username, password }, { res, db }) => {
      const result = await db.query("SELECT * FROM users WHERE username = $1", [
        username,
      ]);

      const user = result.rows[0];
      if (!user) {
        throw new Error("Invalid username");
      }

      const validPassword = await comparePasswords(password, user.password);
      if (!validPassword) {
        throw new Error("Invalid password");
      }

      const token = generateToken(user);

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24, // 1 day
      });

      return {
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
      };
    },

    changePassword: async (_, { oldPassword, newPassword }, { req, db }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      try {
        // Get current user's password
        const result = await db.query(
          "SELECT password FROM users WHERE id = $1",
          [req.user.userId]
        );

        const user = result.rows[0];
        if (!user) {
          throw new Error("User not found");
        }

        // Verify old password
        const validPassword = await comparePasswords(
          oldPassword,
          user.password
        );
        if (!validPassword) {
          throw new Error("Current password is incorrect");
        }

        // Hash new password
        const hashedNewPassword = await hashPassword(newPassword);

        // Update password
        await db.query("UPDATE users SET password = $1 WHERE id = $2", [
          hashedNewPassword,
          req.user.userId,
        ]);

        return true;
      } catch (error) {
        console.error("Change password error:", error);
        throw error;
      }
    },

    createUser: async (
      _,
      { name, username, password, email, mobile, role, active },
      { req, db }
    ) => {
      if (!req.user || req.user.role !== "ADMIN") {
        throw new Error("Not authorized to create users");
      }

      try {
        const hashedPassword = await hashPassword(password);

        const result = await db.query(
          `INSERT INTO users (
            name, username, password, email, mobile, role, active
          ) VALUES ($1, $2, $3, $4, $5, $6, $7) 
          RETURNING id, name, username, email, mobile, role, active`,
          [
            name,
            username,
            hashedPassword,
            email,
            mobile || null,
            role || "USER",
            active,
          ]
        );

        return result.rows[0];
      } catch (error) {
        if (error.code === "23505") {
          // Unique violation
          throw new Error("Username or email already exists");
        }
        console.error("Create user error:", error);
        throw new Error("Failed to create user");
      }
    },

    updateUser: async (
      _,
      { id, name, username, email, mobile, role, active },
      { req, db }
    ) => {
      if (!req.user || req.user.role !== "ADMIN") {
        throw new Error("Not authorized to update users");
      }

      try {
        const result = await db.query(
          `UPDATE users 
           SET 
            name = COALESCE($1, name),
            username = COALESCE($2, username),
            email = COALESCE($3, email),
            mobile = COALESCE($4, mobile),
            role = COALESCE($5, role),
            active = COALESCE($6, active)
           WHERE id = $7
           RETURNING id, name, username, email, mobile, role, active`,
          [name, username, email, mobile, role, active, id]
        );

        if (result.rows.length === 0) {
          throw new Error("User not found");
        }

        return result.rows[0];
      } catch (error) {
        if (error.code === "23505") {
          // Unique violation
          throw new Error("Username or email already exists");
        }
        console.error("Update user error:", error);
        throw new Error("Failed to update user");
      }
    },

    uploadAvatar: async (_, { file }, { req, db }) => {
      if (!req.user) {
        throw new Error("Not authenticated");
      }

      const { createReadStream, filename, mimetype } = await file;
      const stream = createReadStream();

      try {
        // Read file into buffer
        const chunks = [];
        for await (const chunk of stream) {
          chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);

        // Insert image into images table
        const imageResult = await db.query(
          `INSERT INTO images (data, mime_type, filename)
           VALUES ($1, $2, $3)
           RETURNING id`,
          [buffer, mimetype, filename]
        );

        // Update user's avatar_id
        const result = await db.query(
          `UPDATE users 
           SET avatar_id = $1
           WHERE id = $2
           RETURNING 
            id, 
            name, 
            username, 
            email,
            (
              SELECT encode(data, 'base64') 
              FROM images 
              WHERE id = $1
            ) as avatar_data,
            (
              SELECT mime_type
              FROM images
              WHERE id = $1
            ) as mime_type`,
          [imageResult.rows[0].id, req.user.userId]
        );

        const user = result.rows[0];
        return {
          ...user,
          avatarUrl: `data:${user.mime_type};base64,${user.avatar_data}`,
        };
      } catch (error) {
        console.error("Upload avatar error:", error);
        throw new Error("Failed to upload avatar");
      }
    },

    deleteUsers: async (_, { ids }, { req, db }) => {
      if (!req.user || req.user.role !== "ADMIN") {
        throw new Error("Not authorized to delete users");
      }

      try {
        await db.query("DELETE FROM users WHERE id = ANY($1)", [ids]);
        return true;
      } catch (error) {
        console.error("Delete users error:", error);
        throw new Error("Failed to delete users");
      }
    },
  },
};
