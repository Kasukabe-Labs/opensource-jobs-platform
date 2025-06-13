import { FastifyReply, FastifyRequest } from "fastify";
import { pool } from "../config/db";
import { Company } from "../types/company";
import { UUID } from "crypto";

export const getCompanies = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { cursor, limit } = request.query as {
    cursor?: string;
    limit?: string;
  };

  const limitInt = parseInt(limit!);
  //   const cacheKey = `companies-${cursor || "start"}-${limit}`;

  //   const cached = await reply.server.cache.get(cacheKey);
  //   if (cached) {
  //     request.log.info("Serving data from cache /companies");
  //     return cached.item;
  //   }

  try {
    //db instance
    const client = await pool.connect();
    let query: string;
    let values: any[];

    if (cursor) {
      query = `
        SELECT * FROM companies
        WHERE created_at > $1
        ORDER BY created_at, id
        LIMIT $2`;

      values = [cursor, limitInt];
    } else {
      query = `
        SELECT * FROM companies
        ORDER BY created_at, id
        LIMIT $1`;

      values = [limitInt];
    }

    const result = await (await client).query(query, values);
    const { rows } = result;
    client.release();

    const nextCursor =
      rows.length > 0 ? rows[rows.length - 1].created_at.toISOString() : null;
    const response = { companiesData: rows, nextCursor };

    // reply.server.cache.set(cacheKey, response, 3600);

    return reply.send(response);
  } catch (error) {
    request.log.error(error);
    return reply
      .status(500)
      .send({ error: `Something went wrong 💥, ${error}` });
  }
};
