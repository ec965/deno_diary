import { Page, PageModel } from "server/models/page.ts";
import { Markdown } from "lib/markdown.ts";
import { exists } from "std/fs/mod.ts";
import { RouteParams, RouterContext, Status } from "oak/mod.ts";

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

export const getMdFile = (filename: string) =>
  async (ctx: RouterContext) => {
    if (!(await exists(filename))) ctx.throw(Status.NotFound, "File not found");
    ctx.response.body = md.readFile(filename);
    ctx.response.type = "html";
  };

export async function getMdFileParam(ctx: RouterContext) {
  const { filename } = ctx.params;
  if (!filename) {
    ctx.throw(Status.BadRequest, "Request is missing 'filename' parameter");
  }

  await getMdFile(filename)(ctx);
}
