// @ts-nocheck

import { FastifyReply, FastifyRequest } from "fastify";
import {
  generateAccessToken,
  generateRefreshToken,
  getGoogleAuthUrl,
  getGoogleUser,
  sendToken,
} from "kasukabe-quickauth-core";
import { pool } from "../config/db";
import jwt from "jsonwebtoken";

export const googleAuthRedirect = (
  _request: FastifyRequest,
  reply: FastifyReply
) => {
  const url = getGoogleAuthUrl();
  reply.redirect(url);
};

export const googleAuthCallback = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const code = (req.query as { code?: string }).code;

  if (!code) {
    return reply.status(400).send({ message: "Code is missing" });
  }

  try {
    const googleUser = await getGoogleUser(code);

    const client = await pool.connect();

    try {
      // check if user already exists
      const result = await client.query(
        "SELECT * FROM users WHERE email = $1",
        [googleUser.email]
      );

      let user = result.rows[0];

      // if user doesn't exist, insert
      if (!user) {
        const insertResult = await client.query(
          `
    INSERT INTO users (email, profile_picture, name, created_at)
    VALUES ($1, $2, $3, NOW())
    RETURNING *
  `,
          [googleUser.email, googleUser.picture, googleUser.name]
        );

        user = insertResult.rows[0];
      }

      // generate tokens
      const refreshToken = generateRefreshToken(user.id);
      const accessToken = generateAccessToken(user.id);

      sendToken(reply, accessToken, refreshToken);

      reply.header("Content-Type", "text/html").send(`
  <html>
    <head>
      <meta http-equiv="refresh" content="0; URL='${process.env.CLIENT_URL}'" />
      <script>
        window.location.href = '${process.env.CLIENT_URL}';
      </script>
    </head>
    <body>
      Redirecting...
    </body>
  </html>
`);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Google Auth Error:", error);
    reply.status(500).send({ message: "Google auth failed" });
  }
};

export const me = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) {
      return reply.status(401).send({ message: "No token found" });
    }

    const decoded = jwt.verify(token, process.env.REFRESH_SECRET!) as {
      id: string;
    };

    const client = await pool.connect();

    try {
      const result = await client.query(
        "SELECT id, name, email, profile_picture, created_at FROM users WHERE id = $1",
        [decoded.id]
      );

      const user = result.rows[0];

      if (!user) {
        return reply.status(404).send({ message: "User not found" });
      }

      const accessToken = generateAccessToken(user.id);

      return reply.status(200).send({
        user,
        accessToken,
        message: "User verified",
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Me controller error:", error);
    return reply.status(500).send({
      message: "Error in me controller",
      error: error instanceof Error ? error.message : error,
    });
  }
};
