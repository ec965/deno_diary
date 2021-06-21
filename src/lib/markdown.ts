import { Marked } from "markdown/mod.ts";

export class Markdown {
  private css: string;

  constructor(cssFile = "") {
    this.css = `<style>${Deno.readTextFileSync(cssFile)}</style>`;
  }

  read(text: string): string {
    return this.css + Marked.parse(text).content;
  }

  readFile(filename: string): string {
    const text = Deno.readTextFileSync(filename);
    return this.read(text);
  }
}
