import Fastify from "fastify";
import rateLimit from "@fastify/rate-limit";
import caching, { fastifyCaching } from "@fastify/caching";
import { companyRoutes } from "./routes/companyRoutes";

const server = Fastify({
  logger: true,
});

const start = async () => {
  try {
    // Register rate limiting
    await server.register(rateLimit, {
      max: 100,
      timeWindow: "1 minute",
    });

    // Register routes
    await server.register(companyRoutes);

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
