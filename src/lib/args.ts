// arg lib
import { Args as RawArgs, parse } from "std/flags/mod.ts";

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
function verifyOption(args: RawArgs, option: Option): VerifiedOption | null {
  const { name, alias, required } = option;

  if (args[name] || (alias && args[alias])) {
    let value = (args[name] || (alias && args[alias]) || option.default) as
      | string
      | boolean
      | number
      | undefined;
    // apply default
    if (typeof value === "undefined") {
      throw new Error(`Value for option '${option.name}' was not found!`);
    }

    // check type
    if (typeof value !== option.type) {
      // go to default if type mismatch
      if (option.default) value = option.default;
      else {
        throw new Error(
          `Option '${option.name}' expected '${option.type}' but had type '${typeof value}'`,
        );
      }
    }

    return { name, value };
  }
  // check required
  if (required) {
    throw new Error(`Required option '${option.name}' was not found!`);
  }
  // otherwise
  return null;
}

/**
 *
 * @param options options to parse
 * @returns argument output of verified options
 */
function parseOptions(rawArgs: RawArgs, options: Option[]): ArgOutput {
  // check that all options are there
  const args = options
    .map((option) => verifyOption(rawArgs, option))
    .filter((option): option is VerifiedOption => option !== null);

  return args.reduce((obj: ArgOutput, { name, value }) => {
    obj[name] = value;
    return obj;
  }, {});
}

/**
 * print explaination for option
 * @param option
 */
export function explainOption(option: Option) {
  const { name, alias, required, description } = option;
  console.log(
    `    -${alias}, --${name}${required ? " [required]" : ""}${
      option.default ? ` [default: ${option.default}]` : ""
    }${description ? `: ${description}` : ""}`,
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
  if (!command) {
    commands.forEach(explainCommand);
    console.error("No valid command found");
    return;
  }
  try {
    const parsedArgs = parseOptions(rawArgs, command.options);
    return command.fn(parsedArgs);
  } catch (error) {
    explainCommand(command);
    console.error(error.message);
  }
}
