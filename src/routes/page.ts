import { getMdFile, getPageById } from "../controllers/page.ts";
import { Router } from "https://deno.land/x/oak/mod.ts";

export const createPageRouter = (filename: string) => {
  // router
  const router = new Router();

  router.get("/", getMdFile("README.md"));
  router.get("/file", getMdFile(filename));
  router.get("/id/:id", getPageById);
  return router;
};
