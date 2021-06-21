import { PageModel } from "server/models/page.ts";
import { format } from "std/datetime/mod.ts";
// helpers
export const dateFmt = (date: string): string =>
  format(new Date(date), "MM-dd-yyyy_HH:mm");

export const matchReadUpdateName = (filename: string): boolean =>
  Boolean(filename.match(/([0-9]+)==([a-zA-Z0-9_]+)==(.*)/));

// not the README, a read/update name type, and is a .md file
export const matchCreateName = (filename: string): boolean =>
  !matchReadUpdateName(filename) &&
  !filename.match(/^README\.md$/) &&
  Boolean(filename.match(/\.md+$/));

// format results and print
export const printPageData = (pageData: PageModel[]) =>
  pageData.forEach(({ id, title, createdAt, updatedAt }) =>
    console.log(
      `${id} | ${title} | created: ${
        dateFmt(
          createdAt as string,
        )
      } | updated: ${dateFmt(updatedAt as string)}`,
    )
  );
