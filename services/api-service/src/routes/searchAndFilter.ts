import fastify, { FastifyInstance } from "fastify";
import { searchCompanies } from "../controller/searchController";
import { getLocations } from "../controller/locationController";

export const SearchRoute = async (fastify: FastifyInstance) => {
  fastify.get("/search", searchCompanies);
};

export const FilterRoute = async (fastify: FastifyInstance) => {
  fastify.get("/locations", getLocations);
};
