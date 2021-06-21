import { argsEntry, Option } from "./args.ts";
import { runApp } from "./app.ts";

const options = {
  file: {
    name: "file",
    alias: "f",
    default: "README.md",
    type: "string",
  } as Option,
  port: {
    name: "port",
    alias: "p",
    default: 8080,
    type: "number",
  } as Option,
} as const;

try {
  argsEntry([
    {
      name: "serve",
      options: [options.file, options.port],
      fn: (args) => {
        const { port, file } = args;
        runApp(port as number, file as string);
      },
    },
    {
      name: "read",
      options: [options.file],
      fn: (args) => console.log(args),
    },
  ]);
} catch (error) {
  console.error(error);
}
