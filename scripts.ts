const allow = "--allow-read --allow-net --allow-write";
const imap = "--import-map=import_map.json";
const other = "--unstable"; // needed for std@0.99.0 for now
const opts = `${other} ${imap} ${allow}`;

export default {
  scripts: {
    dev: `denon run" ${opts} "src/main.ts`,
    start: `deno run ${opts} src/main.ts`,
    test: `deno test ${opts}`,
    compile: `deno compile ${opts} --output diary src/main.ts`,
    bundle: `deno bundle ${imap} ${other} src/main.ts main.bundle.ts`,
  },
};
