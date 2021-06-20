import { Marked } from "https://deno.land/x/markdown@v2.0.0/mod.ts";

export async function readMarkdwon(filename: string, css?: string): Promise<string> {
  const decoder = new TextDecoder("utf-8");
  const markdown = decoder.decode(await Deno.readFile(filename));
  const markup = Marked.parse(markdown);

  const htmlStyle = `<style>${
    decoder.decode(
      await Deno.readFile(css || "md.css"),
    )
  }</style>`;

  return htmlStyle + markup.content;
}
