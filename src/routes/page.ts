import { getMdFile, getPageById } from "../controllers/page.ts";
import { Router } from "https://deno.land/x/oak/mod.ts";
import { file } from "../args.ts";

// pageRouter
export const pageRouter = new Router();

pageRouter.get("/:id", getPageById);
pageRouter.get("/", getMdFile(file));
