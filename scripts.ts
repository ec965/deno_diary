// velociraptor
const allow = "--allow-read --allow-net --allow-write";
const imap = "--import-map=import_map.json";
const other = "--unstable"; // needed for std@0.99.0 for now
const opts = `${other} ${imap} ${allow}`;
const entry = "src/main.ts";
const out = "diary";
const bundle = "diary.bundle.ts";

export default {
  scripts: {
    dev: `denon run ${opts} ${entry}`,
    start: `deno run ${opts} ${entry}`,
    test: `deno test ${opts}`,
    compile: `deno compile ${opts} --output ${out} ${entry}`,
    bundle: `deno bundle ${imap} ${other} ${entry} ${bundle}`,
    "pre-commit": {
      cmd: ["deno lint", "deno fmt"],
      gitHook: "pre-commit",
    },
  },
};
