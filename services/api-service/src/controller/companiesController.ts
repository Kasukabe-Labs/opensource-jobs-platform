import { FastifyReply, FastifyRequest } from "fastify";
import { pool } from "../config/db";

export const getCompanies = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { cursor, limit } = request.query as {
    cursor?: string;
    limit?: string;
  };

  const limitInt = parseInt(limit!);

  try {
    const client = await pool.connect();
    let query: string;
    let values: any[];

    if (cursor) {
      // Since all records have same created_at, just use id for pagination
      query = `
        SELECT * FROM companies
        WHERE id > $1
        ORDER BY id
        LIMIT $2`;

      values = [cursor, limitInt];
    } else {
      query = `
        SELECT * FROM companies
        ORDER BY id
        LIMIT $1`;

      values = [limitInt];
    }

    const result = await client.query(query, values);
    const { rows } = result;
    client.release();

    // Use just the ID as cursor since all created_at are the same
    const nextCursor = rows.length > 0 ? rows[rows.length - 1].id : null;

    const response = { companiesData: rows, nextCursor };

    return reply.send(response);
  } catch (error) {
    request.log.error(error);
    return reply
      .status(500)
      .send({ error: `Something went wrong 💥, ${error}` });
  }
};
