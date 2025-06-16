import { FastifyRequest, FastifyReply } from "fastify";
import { pool } from "../config/db";

// POST /bookmarks
export const addBookmark = async (req: FastifyRequest, reply: FastifyReply) => {
  const userId = req.user?.id;
  const { companyId } = req.body as { companyId: string };

  if (!userId || !companyId) {
    return reply.status(400).send({ message: "Missing userId or companyId" });
  }

  try {
    const client = await pool.connect();

    try {
      await client.query(
        `INSERT INTO bookmarks (user_id, company_id, created_at)
         VALUES ($1, $2, NOW())
         ON CONFLICT (user_id, company_id) DO NOTHING`,
        [userId, companyId]
      );

      return reply.status(201).send({ message: "Bookmarked successfully" });
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Add bookmark error:", err);
    return reply.status(500).send({ message: "Server error" });
  }
};

// DELETE /bookmarks/:companyId
export const removeBookmark = async (
  req: FastifyRequest<{ Params: { companyId: string } }>,
  reply: FastifyReply
) => {
  const userId = req.user?.id;
  const { companyId } = req.params;

  if (!userId || !companyId) {
    return reply.status(400).send({ message: "Missing userId or companyId" });
  }

  try {
    const client = await pool.connect();

    try {
      const result = await client.query(
        `DELETE FROM bookmarks WHERE user_id = $1 AND company_id = $2`,
        [userId, companyId]
      );

      if (result.rowCount === 0) {
        return reply.status(404).send({ message: "Bookmark not found" });
      }

      return reply.send({ message: "Bookmark removed" });
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Remove bookmark error:", err);
    return reply.status(500).send({ message: "Server error" });
  }
};

// GET /bookmarks
export const getBookmarks = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const userId = req.user?.id;

  if (!userId) {
    return reply.status(401).send({ message: "Unauthorized" });
  }

  try {
    const client = await pool.connect();

    try {
      const result = await client.query(
        `SELECT c.*
         FROM bookmarks b
         JOIN companies c ON b.company_id = c.id
         WHERE b.user_id = $1`,
        [userId]
      );

      return reply.send(result.rows);
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Get bookmarks error:", err);
    return reply.status(500).send({ message: "Server error" });
  }
};
