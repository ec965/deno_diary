// arg lib
import { Args as RawArgs, parse } from "std/flags/mod.ts";

export interface VerifiedOption {
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
  default?: string | number | boolean;
  type: "string" | "boolean" | "number";
  description?: string;
}

export type ArgOutput = Record<string, string | number | boolean>;

export interface Command {
  name: string;
  options: Option[];
  fn: <T extends ArgOutput>(args: T) => void;
  description?: string;
}

/**
 *
 * @param args raw input arguments obtained from `parse(Deno.args)`
 * @param option option to verify
 * @returns verified option
 */
export const verifyOption =
  (args: RawArgs) =>
  (option: Option): VerifiedOption | null => {
    const { name, alias, required } = option;

    if (
      typeof args[name] !== "undefined" ||
      (alias && typeof args[alias] !== "undefined")
    ) {
      // assign a value to whichever arg exists
      // prioritize name over alias
      const value = (args[name] || (alias && args[alias])) as
        | string
        | boolean
        | number;

      // check type
      const type = typeof value;
      if (type === option.type) return { name, value };
      // if type mismatch is boolean and default is specified
      if (type === "boolean" && typeof option.default !== "undefined")
        return { name, value: option.default };

      throw new Error(
        `Option '${option.name}' expected '${
          option.type
        }' but had type '${typeof value}'`
      );
    }
    // check required
    if (required)
      throw new Error(`Required option '${option.name}' was not found!`);

    // if arg not found and not required
    return null;
  };

/**
 * check that all options are there
 * @param options options to parse
 * @returns argument output of verified options
 */
export const parseOptions = (rawArgs: RawArgs, options: Option[]): ArgOutput =>
  options
    .map(verifyOption(rawArgs))
    .filter((option): option is VerifiedOption => option !== null)
    .reduce((obj: ArgOutput, { name, value }) => {
      obj[name] = value;
      return obj;
    }, {});

/**
 * print explaination for option
 * @param option
 */
export function explainOption(option: Option) {
  const { name, alias, required, description } = option;
  console.log(
    `    -${alias}, --${name}${required ? " [required]" : ""}${
      option.default ? ` [default: ${option.default}]` : ""
    }${description ? `: ${description}` : ""}`
  );
}

/**
 * print explanation for command
 * @param command
 */
export function explainCommand(command: Command) {
  const { name, options, description } = command;
  console.log(`${name}${description ? `\n${description}` : ""}`);
  options.forEach(explainOption);
}

/**
 * Entry point for arg parser
 * @param commands array of commands to parse for
 * @returns
 */
export function argsEntry(commands: Command[]) {
  const rawArgs = parse(Deno.args);
  const command = commands.filter((cmd) => cmd.name === rawArgs._[0]).pop();
  // print help if no command input
  if (!command) {
    commands.forEach(explainCommand);
    console.error("No valid command found");
    return;
  }
  try {
    const parsedArgs = parseOptions(rawArgs, command.options);
    return command.fn(parsedArgs);
  } catch (error) {
    // print help if invalid options
    explainCommand(command);
    console.error(error.message);
  }
}
