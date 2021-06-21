import { argsEntry, Option } from "lib/args.ts";
import { runApp } from "server/main.ts";
import { Page, PageModel } from "server/models/page.ts";
import { db } from "src/db.ts";
import { dateFmt, matchCreateName, printPageData } from "helpers/helpers.ts";
import { join } from "std/path/mod.ts";

const options = {
  id: {
    name: "id",
    alias: "i",
    type: "number",
  } as Option,
  port: {
    name: "port",
    alias: "p",
    default: 8080,
    type: "number",
  } as Option,
  date: {
    name: "date",
    alias: "d",
    default: new Date().toISOString(),
    type: "string",
  },
} as const;

try {
  argsEntry([
    {
      name: "serve",
      options: [options.port],
      fn: (args) => {
        const { port } = args;
        runApp(port as number);
      },
    },
    {
      name: "read",
      options: [options.id],
      fn: async (args) => {
        await db.sync();
        const result = (await Page.select("id", "title", "body", "updated_at")
          .where("id", args.id)
          .all()) as PageModel[];
        if (result.length > 0) {
          const { id, title, body, updatedAt } = result[0];
          const filePath = join(
            ".",
            `${id}==${title?.replace(" ", "_")}==${
              dateFmt(
                updatedAt as string,
              )
            }.md`,
          );

          await Deno.writeTextFile(filePath, `${body}`);
        } else {
          console.log(`Could not find page with id: ${args.id}`);
        }
        await db.close();
      },
    },
    {
      name: "create",
      options: [],
      fn: async () => {
        const validFiles = [];

        // read files and choose ones that match
        for await (const file of Deno.readDir("./")) {
          console.log(file.name, matchCreateName(file.name));
          if (file.isFile && matchCreateName(file.name)) {
            validFiles.push(file.name);
          }
        }

        if (validFiles.length === 0) return;

        const newPages = validFiles.map((name) => ({
          body: Deno.readTextFileSync(join(".")),
          title: name,
        }));

        // write new pages
        await db.sync();
        const results = (await Page.create(newPages)) as PageModel[];
        await db.close();
        printPageData(results);
      },
    },
    {
      name: "list",
      options: [options.date],
      fn: async (args) => {
        const queryFields = ["id", "title", "created_at", "updated_at"];

        // query db
        await db.sync();
        const pageData = args.date
          ? ((await Page.select(...queryFields)
            .where(
              "updated_at",
              ">",
              new Date(args.date as string).toISOString(),
            )
            .all()) as PageModel[])
          : ((await Page.select(...queryFields).all()) as PageModel[]);
        await db.close();

        printPageData(pageData);
      },
    },
  ]);
} catch (error) {
  console.error(error);
}
