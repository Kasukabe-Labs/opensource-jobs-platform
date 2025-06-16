import { FastifyInstance } from "fastify";
import {
  googleAuthCallback,
  googleAuthRedirect,
} from "../controller/authController";

export const authRedirectRoute = async (fastify: FastifyInstance) => {
  fastify.get("/google", googleAuthRedirect);
};

export const callbackRoute = async (fastify: FastifyInstance) => {
  fastify.get("/google-callback", googleAuthCallback);
};
