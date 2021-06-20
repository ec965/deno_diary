// velociraptor file
export default {
  scripts: {
    dev: "denon run --allow-read --allow-net --allow-write src/main.ts",
    start: {
      cmd: "src/main.ts",
      allow: ["net", "read", "write"],
    },
  },
};
