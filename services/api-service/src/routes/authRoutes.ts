import { FastifyInstance } from "fastify";
import {
  googleAuthCallback,
  googleAuthRedirect,
  me,
} from "../controller/authController";

export const authRedirectRoute = async (fastify: FastifyInstance) => {
  fastify.get("/google", googleAuthRedirect);
};

export const callbackRoute = async (fastify: FastifyInstance) => {
  fastify.get("/auth/google/callback", googleAuthCallback);
};

export const meRoute = async (fastify: FastifyInstance) => {
  fastify.get("/me", me);
};
