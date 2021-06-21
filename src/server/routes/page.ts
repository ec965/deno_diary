import {
  getMdFile,
  getMdFileParam,
  getPageById,
} from "server/controllers/page.ts";
import { Router } from "oak/mod.ts";

// pageRouter
export const pageRouter = new Router();

pageRouter.get("/", getMdFile("README.md"));
pageRouter.get("/file/:filename", getMdFileParam);
pageRouter.get("/id/:id", getPageById);
