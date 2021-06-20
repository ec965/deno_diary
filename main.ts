import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { readMarkdwon } from "./markdown.ts";
import { parseArgs } from "./args.ts";
import { db } from './db.ts';
import { Page } from './models/page.ts';

interface Args {
  file: string;
  port: number;
}
try {
  // parse args
  const { file, port } = (await parseArgs(
    {
      name: "file",
      alias: "f",
      default: "README.md",
    },
    {
      name: "port",
      alias: "p",
      default: 8080,
    }
  )) as unknown as Args;

  // connect to db
  await db.sync({drop: true});

  await Page.create({
    title: "test title",
    body: "test body",
  });
  console.log(await Page.all());

  // router
  const router = new Router();
  router.get("/", async (ctx) => {
    ctx.response.body = await readMarkdwon(file);
    ctx.response.type = "html";
  });

  const app = new Application();

  app.use(router.routes());
  app.use(router.allowedMethods());

  app.addEventListener("listen", ({ hostname, port, secure }) => {
    const url = `${secure ? "https://" : "http://"}${
      hostname ?? "localhost"
    }:${port}`;
    console.log(`Serving ${file} on: ${url}`);
  });

  await app.listen({ port: port });
} catch (error) {
  console.error(error);
}
