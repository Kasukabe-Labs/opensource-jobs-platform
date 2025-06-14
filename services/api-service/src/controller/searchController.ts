import { FastifyReply, FastifyRequest } from "fastify";
import { SearchQuery } from "../types/search";
import { pool } from "../config/db";

export async function searchCompanies(
  request: FastifyRequest,
  reply: FastifyReply
) {
  reply.header("cache-control", "public, max-age=600");
  const { cursor, limit, search, location } = request.query as SearchQuery;

  const limitInt = parseInt(limit || "20");

  try {
    const client = await pool.connect();
    let query: string;
    let values: any[] = [];
    let paramCount = 0;

    // Build WHERE conditions
    const conditions: string[] = [];

    if (cursor) {
      conditions.push(`id > $${++paramCount}`);
      values.push(cursor);
    }

    if (search && search.trim()) {
      conditions.push(`(
        companyname ILIKE $${++paramCount} OR 
        description ILIKE $${++paramCount}
      )`);
      const searchTerm = `%${search.trim()}%`;
      values.push(searchTerm, searchTerm);
    }

    if (location && location.trim()) {
      conditions.push(`location ILIKE $${++paramCount}`);
      values.push(`%${location.trim()}%`);
    }

    // Build final query
    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    query = `
      SELECT * FROM companies
      ${whereClause}
      ORDER BY id
      LIMIT $${++paramCount}
    `;
    values.push(limitInt);

    const result = await client.query(query, values);
    const { rows } = result;
    client.release();

    const nextCursor = rows.length > 0 ? rows[rows.length - 1].id : null;
    const response = {
      companiesData: rows,
      nextCursor,
      hasMore: rows.length === limitInt,
    };

    return reply.send(response);
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({ error: `Search failed: ${error}` });
  }
}
