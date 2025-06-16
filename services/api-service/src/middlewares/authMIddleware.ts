// @ts-nocheck

import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";

declare module "fastify" {
  interface FastifyRequest {
    user?: { id: string };
  }
}

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const token = request.cookies?.refreshToken;

  if (!token) {
    return reply.status(401).send({
      message: "Unauthorized access blah blah blah",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.REFRESH_SECRET!
    ) as jwt.JwtPayload;
    if (!decoded.id) {
      throw new Error("Invalid token payload");
    }

    request.user = { id: decoded.id };
  } catch (error) {
    return reply
      .status(403)
      .send({ message: "Token failed", error: String(error) });
  }
}
