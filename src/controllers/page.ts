import { Page, PageModel } from "../models/page.ts";
import { existsSync } from 'fs/mod.ts';
import { Markdown } from "../markdown.ts";
import {
  RouteParams,
  RouterContext,
  Status,
} from "oak/mod.ts";

const md = new Markdown("./style.css");

export async function getPageById(ctx: RouterContext<RouteParams>) {
  const { id } = ctx.params;
  if (!id) ctx.throw(Status.BadRequest, "Request is missing 'id' parameter");

  const page = (await Page.select("body")
    .where("id", id.toString())
    .limit(1)
    .get()) as PageModel[];

  if (!page || !(page[0] && page[0].body)) {
    ctx.throw(Status.NotFound, "Page not found");
  }

  ctx.response.type = "html";
  ctx.response.body = md.read(page[0].body);
}

export const getMdFile = (filename: string) => async (ctx: RouterContext) => {
  ctx.response.body = await md.readFile(filename);
  ctx.response.type = "html";
};

export async function getMdFileParam(ctx: RouterContext) {
  const { filename } = ctx.params;
  if (!filename)
    ctx.throw(Status.BadRequest, "Request is missing 'filename' parameter");
  
  if(!existsSync(filename))
    ctx.throw(Status.NotFound, "File not found");

  ctx.response.body = await md.readFile(filename);
  ctx.response.type = "html";
}
