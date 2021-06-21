// velociraptor file
export default {
  scripts: {
    dev: "denon run --unstable --import-map=import_map.json --allow-read --allow-net --allow-write src/main.ts",
    start: {
      cmd: "deno run --unstable src/main.ts",
      allow: ["net", "read", "write"],
      imap: "import_map.json"
    },
  },
};
