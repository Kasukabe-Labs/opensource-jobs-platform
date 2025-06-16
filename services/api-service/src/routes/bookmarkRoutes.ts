import { FastifyInstance } from "fastify";
import { authMiddleware } from "../middlewares/authMIddleware";
import {
  addBookmark,
  getBookmarks,
  removeBookmark,
} from "../controller/bookmarkController";

export async function bookmarkRoutes(app: FastifyInstance) {
  app.addHook("preHandler", authMiddleware);

  app.post("/bookmarks", addBookmark);
  app.get("/bookmarks", getBookmarks);
  app.delete("/bookmarks/:companyId", removeBookmark);
}
