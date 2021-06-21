import { Marked } from "markdown/mod.ts";

/**
 * Wrapper for markdown library
 */
export class Markdown {
  private css: string;

  /**
   * specify a css file to use when generating markdown
   * @param cssFile
   */
  constructor(cssFile = "") {
    this.css = `<style>${Deno.readTextFileSync(cssFile)}</style>`;
  }

  /**
   * parse markdown string into html
   * @param text
   * @returns
   */
  read(text: string): string {
    return this.css + Marked.parse(text).content;
  }

  /**
   * parse markdown file into html
   * @param filename
   * @returns
   */
  readFile(filename: string): string {
    const text = Deno.readTextFileSync(filename);
    return this.read(text);
  }
}
