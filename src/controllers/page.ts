import { Page, PageModel } from "../models/page.ts";
import { Markdown } from "../markdown.ts";
import {
  RouteParams,
  RouterContext,
  Status,
} from "https://deno.land/x/oak/mod.ts";

const md = new Markdown("./md.css");

export async function getPageById(ctx: RouterContext<RouteParams>) {
  const {
    params: { id },
  } = ctx;
  if (!id) ctx.throw(Status.BadRequest, "Request is missing 'id' param");

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

export const getMdFile = (filename: string) =>
  async (ctx: RouterContext) => {
    ctx.response.body = await md.readFile(filename);
    ctx.response.type = "html";
  };
