import Fastify, { fastify } from "fastify";
import rateLimit from "@fastify/rate-limit";
import caching, { fastifyCaching } from "@fastify/caching";
import cors from "@fastify/cors";
import { companyRoutes } from "./routes/companyRoutes";
import { FilterRoute, SearchRoute } from "./routes/searchAndFilter";

const server = Fastify({
  logger: true,
});

const start = async () => {
  try {
    await server.register(cors, {
      origin: "*",
    });
    // Register rate limiting
    await server.register(rateLimit, {
      max: 100,
      timeWindow: "1 minute",
    });

    await server.register(caching, {
      privacy: fastifyCaching.privacy.PUBLIC,
      expiresIn: 360000,
    });

    // Register routes
    await server.register(companyRoutes);
    await server.register(SearchRoute);
    await server.register(FilterRoute);

    // Base route
    server.get("/", async (request, reply) => {
      reply.send({ message: "base route working..." });
    });

    const PORT = process.env.PORT || 8001;

    await server.listen({ port: PORT as number });
    server.log.info(`Server is running on port ${PORT}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
