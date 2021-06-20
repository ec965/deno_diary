// velociraptor file
export default {
  scripts: {
    dev: "denon run --allow-read --allow-net --allow-write main.ts",
    start: {
      cmd: "main.ts",
      allow: ["net", "read", "write"],
    },
  },
};
