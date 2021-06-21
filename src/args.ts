// arg lib
import {
  Args as RawArgs,
  parse,
} from "https://deno.land/std@0.99.0/flags/mod.ts";

interface VerifiedOption {
  name: string;
  value: string | number | boolean;
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
  type: "string" | "boolean" | "number";
}

export type ArgOutput = Record<string, string | number | boolean>;

export interface Command {
  name: string;
  options: Option[];
  fn: <T extends ArgOutput>(args: T) => void;
}

/**
 *
 * @param args raw input arguments obtained from `parse(Deno.args)`
 * @param option option to verify
 * @returns verified option
 */
function verifyOption(args: RawArgs, option: Option): VerifiedOption {
  const { name, alias, required } = option;
  const value = (args[name] || (alias && args[alias]) || option.default) as
    | string
    | boolean
    | number;
  if (!value && required) {
    throw new Error(`Option '${option.name}' was not found!`);
  }
  if(typeof value !== option.type) throw new Error(`Option '${option.name} expected '${option.type}' but had type '${typeof value}'`)
  return { name, value };
}

/**
 *
 * @param options options to parse
 * @returns argument output of verified options
 */
function parseOptions(rawArgs: RawArgs, options: Option[]): ArgOutput {
  // check that all options are there
  const args = options.map((option) => verifyOption(rawArgs, option));
  return args.reduce((obj: ArgOutput, { name, value }) => {
    obj[name] = value;
    return obj;
  }, {});
}

export function argsEntry(commands: Command[]) {
  const rawArgs = parse(Deno.args);
  const command = commands.filter((cmd) => cmd.name === rawArgs._[0]).pop();
  if (!command) throw new Error("No valid command found");
  const parsedArgs = parseOptions(rawArgs, command.options);
  return command.fn(parsedArgs);
}
