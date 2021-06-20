import { Application, isHttpError } from "https://deno.land/x/oak/mod.ts";
import { port } from "./args.ts";
import { db } from "./db.ts";
import { Page } from "./models/page.ts";
import { pageRouter } from "./routes/page.ts";

try {
  // connect to db
  await db.sync({ drop: true });

  await Page.create({
    title: "test title",
    body: new TextDecoder("utf-8").decode(Deno.readFileSync("test.md")),
  });

  const app = new Application();

  // error handler
  app.use(async (ctx, next) => {
    try {
      await next();
    } catch (error) {
      if (isHttpError(error)) {
        ctx.response.status = error.status;
        ctx.response.type = "json";
        ctx.response.body = { error: error.message };
      } else {
        throw error;
      }
    }
  });

  // configure routes
  app.use(pageRouter.routes());
  app.use(pageRouter.allowedMethods());

  app.addEventListener("listen", ({ hostname, port, secure }) => {
    const url = `${secure ? "https://" : "http://"}${hostname ??
      "localhost"}:${port}`;
    console.log(`Serving on: ${url}`);
  });

  await app.listen({ port: port });

} catch (error) {
  console.error(error);
}
