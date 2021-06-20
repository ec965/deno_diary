import {
  Args as RawArgs,
  parse,
} from "https://deno.land/std@0.99.0/flags/mod.ts";

interface ParsedArg {
  name: string;
  value: string | number;
}

export interface Option {
  name: string;
  alias?:
    | "a"
    | "b"
    | "c"
    | "d"
    | "e"
    | "f"
    | "g"
    | "h"
    | "i"
    | "j"
    | "k"
    | "l"
    | "m"
    | "n"
    | "o"
    | "p"
    | "q"
    | "r"
    | "s"
    | "t"
    | "u"
    | "v"
    | "w"
    | "x"
    | "y"
    | "z";
  required?: boolean;
  default?: string | number;
}

// deno-lint-ignore require-await
async function getOption(args: RawArgs, option: Option): Promise<ParsedArg> {
  const { name, alias, required } = option;
  const value = (args[name] || (alias && args[alias]) || option.default) as
    | string
    | number;
  if (!value && required) throw new Error(`Option '${option.name}' was not found!`);
  return { name, value };
}

export async function parseArgs(
  ...options: Option[]
): Promise<Record<string, string | number>> {
  const rawArgs = parse(Deno.args);
  const optionCheck = options.map((option) => getOption(rawArgs, option));
  const args = await Promise.all(optionCheck);
  return args.reduce(
    (obj: Record<string, string | number>, { name, value }) => {
      obj[name] = value;
      return obj;
    },
    {},
  );
}
