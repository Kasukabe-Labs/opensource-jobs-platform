import { FastifyInstance } from "fastify";
import { getCompanies } from "../controller/companiesController";

export const companyRoutes = async (fastify: FastifyInstance) => {
  fastify.get("/companies", getCompanies);
};
