import { Marked } from "markdown/mod.ts";

export class Markdown {
  private decoder = new TextDecoder("utf-8");
  private css: string;

  constructor(cssFile?: string) {
    if (cssFile) {
      this.css = `<style>${
        this.decoder.decode(
          Deno.readFileSync(cssFile),
        )
      }</style>`;
    } else this.css = "";
  }

  read(text: string): string {
    const markup = Marked.parse(text);
    return this.css + markup.content;
  }

  async readFile(filename: string): Promise<string> {
    const text = this.decoder.decode(await Deno.readFile(filename));
    return this.read(text);
  }
}
