import { FastifyReply, FastifyRequest } from "fastify";
import { pool } from "../config/db";

export const getLocations = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    reply.header("cache-control", "public, max-age=600");
    const client = await pool.connect();

    const query = `
      SELECT DISTINCT location 
      FROM companies 
      WHERE location IS NOT NULL AND location != ''
      ORDER BY location
      LIMIT 100
    `;

    const result = await client.query(query);
    client.release();

    return reply.send({ locations: result.rows.map((row) => row.location) });
  } catch (error) {
    request.log.error(error);
    return reply
      .status(500)
      .send({ error: `Failed to get locations: ${error}` });
  }
};
