import { exists } from "std/fs/mod.ts";
import { join } from "std/path/mod.ts";
// my imports
import { argsEntry } from "lib/args.ts";
import { runApp } from "server/main.ts";
import { Page, PageModel } from "server/models/page.ts";
import { db } from "src/db.ts";
import {
  dateFmt,
  matchCreateName,
  printPageData,
  removeExtension,
} from "helpers/helpers.ts";

const workDir = ".";

try {
  argsEntry([
    {
      name: "serve",
      options: [
        {
          name: "port",
          alias: "p",
          default: 8080,
          type: "number",
          description: "open server on this port",
        },
      ],
      fn: (args) => {
        const { port } = args;
        runApp(port as number);
      },
    },
    {
      name: "read",
      options: [
        {
          name: "id",
          alias: "i",
          type: "number",
          description: "output md file with this id",
          required: true,
        },
      ],
      fn: async (args) => {
        await db.sync();

        const result = (await Page.select("id", "title", "body", "updated_at")
          .where("id", args.id)
          .all()) as PageModel[];

        if (result.length > 0) {
          const { id, title, body, updatedAt } = result[0];
          const filePath = join(
            workDir,
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
      options: [
        {
          name: "dir",
          alias: "d",
          type: "string",
          default: workDir,
          description: "add all valid md files in this directory",
        },
        {
          name: "file",
          alias: "f",
          type: "string",
          description: "add this md file",
        },
      ],
      fn: async (args) => {
        const readAndShapePage = (name: string) => ({
          title: removeExtension(name),
          body: Deno.readTextFileSync(join(workDir, name)),
        });

        const dir = args.dir as string | undefined;
        const file = args.file as string | undefined;
        if (!dir && !file) {
          throw new Error("Please specify a directory or file name");
        }
        if (dir && file) {
          throw new Error("Please only specifiy one of directory or file name");
        }
        if (dir) {
          const validFiles = [];

          // read files and choose files that match naming convention
          for await (const file of Deno.readDir(dir)) {
            if (file.isFile && matchCreateName(file.name)) {
              validFiles.push(file.name);
            }
          }

          if (validFiles.length === 0) return;

          const newPages = validFiles.map(readAndShapePage);

          // write new pages
          await db.sync();
          const results = await Page.create(newPages);
          console.log(results);
          await db.close();
          // console.log(`Affected rows: ${results.affectedRows}`);
          // console.log(`Last inserted id: ${results.lastInstertedId}`);

          // delete files that were written
          validFiles.forEach((file) => {
            Deno.remove(join(workDir, file));
          });
        }
        if (file) {
          if (await exists(file)) {
            await db.sync();
            const results = await Page.create(readAndShapePage(file));
            console.log(results);
            await db.close();
          } else throw new Error("File does not exist");
        }
      },
    },
    {
      name: "list",
      options: [
        {
          name: "date",
          alias: "d",
          default: new Date().toISOString(),
          type: "string",
          description: "list all md files after this date",
        },
      ],
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
