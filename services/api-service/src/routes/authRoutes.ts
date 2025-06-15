import { FastifyInstance } from "fastify";
import {
  googleAuthCallback,
  googleAuthRedirect,
} from "../controller/authController";

export const authRedirectRoute = async (fastify: FastifyInstance) => {
  fastify.get("/auth/google", googleAuthRedirect);
};

export const callbackRoute = async (fastify: FastifyInstance) => {
  fastify.get("/auth/google/callback", googleAuthCallback);
};
