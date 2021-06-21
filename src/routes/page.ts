import { getMdFile, getMdFileParam, getPageById } from "../controllers/page.ts";
import { Router } from "oak/mod.ts";

export const createPageRouter = (filename: string) => {
  // router
  const router = new Router();

  router.get("/", getMdFile("README.md"));
  router.get("/file/:filename", getMdFileParam);
  router.get("/id/:id", getPageById);
  return router;
};
