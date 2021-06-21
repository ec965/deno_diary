import { Application, isHttpError } from "oak/mod.ts";
import { db } from "src/db.ts";
import { pageRouter } from "server/routes/page.ts";

export async function runApp(port = 8080) {
  // connect to db
  await db.sync();

  const app = new Application();

  // error handler
  app.use(async (ctx, next) => {
    try {
      await next();
    } catch (error) {
      if (isHttpError(error)) {
        ctx.response.status = error.status;
        ctx.response.body = error.message;
        ctx.response.type = "text";
      } else {
        throw error;
      }
    }
  });

  // configure routes
  app.use(pageRouter.routes());
  app.use(pageRouter.allowedMethods());

  // event listeners
  app.addEventListener("listen", ({ hostname, port, secure }) => {
    const url = `${secure ? "https://" : "http://"}${hostname ??
      "localhost"}:${port}`;
    console.log(`Serving on: ${url}`);
  });

  app.addEventListener("error", (event) => console.error(event.error));

  await app.listen({ port: port });
}
