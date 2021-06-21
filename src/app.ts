import { Application, isHttpError } from "oak/mod.ts";
import { db } from "./db.ts";
import { Page } from "./models/page.ts";
import { createPageRouter } from "./routes/page.ts";

export async function runApp(port: number, filename: string) {
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
          ctx.response.body = error.message;
          ctx.response.type = "text";
        } else {
          throw error;
        }
      }
    });

    // configure routes
    const pageRouter = createPageRouter(filename);
    app.use(pageRouter.routes());
    app.use(pageRouter.allowedMethods());

    // event listeners
    app.addEventListener("listen", ({ hostname, port, secure }) => {
      const url = `${secure ? "https://" : "http://"}${
        hostname ?? "localhost"
      }:${port}`;
      console.log(`Serving on: ${url}`);
    });

    app.addEventListener("error", (event) => console.error(event.error));

    await app.listen({ port: port });
  } catch (error) {
    console.error(error);
  }
}
