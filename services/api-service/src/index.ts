import dotenv from "dotenv";
dotenv.config();

import Fastify, { fastify } from "fastify";
import rateLimit from "@fastify/rate-limit";
import caching, { fastifyCaching } from "@fastify/caching";
import cors from "@fastify/cors";
import { companyRoutes } from "./routes/companyRoutes";
import { FilterRoute, SearchRoute } from "./routes/searchAndFilter";
import fastifyCookie from "@fastify/cookie";
import { authRedirectRoute, callbackRoute, meRoute } from "./routes/authRoutes";
import { bookmarkRoutes } from "./routes/bookmarkRoutes";

const server = Fastify({
  logger: true,
});

const start = async () => {
  try {
    await server.register(cors, {
      origin: (origin, callback) => {
        const allowedOrigins = [
          "http://localhost:5173",
          "http://127.0.0.1:5173",
          "http://localhost:3000",
          process.env.CLIENT_URL,
        ].filter(Boolean);

        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        }

        return callback(new Error("Not allowed by CORS"), false);
      },
      credentials: true,
    });

    await server.register(rateLimit, {
      max: 100,
      timeWindow: "1 minute",
    });

    await server.register(caching, {
      privacy: fastifyCaching.privacy.PUBLIC,
      expiresIn: 360000,
    });

    await server.register(fastifyCookie);

    // Register routes
    await server.register(companyRoutes);
    await server.register(SearchRoute);
    await server.register(FilterRoute);
    await server.register(authRedirectRoute);
    await server.register(callbackRoute);
    await server.register(bookmarkRoutes);
    await server.register(meRoute);

    server.get("/", async (request, reply) => {
      reply.send({ message: "base route working..." });
    });

    const PORT = process.env.PORT || 8001;

    await server.listen({
      port: Number(PORT),
      host: "localhost",
    });

    server.log.info(`Server is running on port ${PORT}`);
    server.log.info(
      `Access via: http://localhost:${PORT} or http://127.0.0.1:${PORT}`
    );
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
