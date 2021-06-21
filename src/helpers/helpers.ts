import { PageModel } from "server/models/page.ts";
import { format } from "std/datetime/mod.ts";
/**
 * Format a date string into MM-dd-yyyy_HH::mm
 * @param date
 * @returns
 */
export const dateFmt = (date: string): string =>
  format(new Date(date), "MM-dd-yyyy_HH:mm");

/**
 * check a filename to see if it matches `{{id}}=={{title}}=={{updated_at}}.md`
 * @param filename
 * @returns
 */
export const matchReadUpdateName = (filename: string): boolean =>
  Boolean(filename.match(/([0-9]+)==([a-zA-Z0-9_]+)==(.*)\.md$/));

/**
 * Ensure that the filename is not the README, a read/update name type, and is a .md file
 * @param filename
 * @returns
 */
export const matchCreateName = (filename: string): boolean =>
  !matchReadUpdateName(filename) &&
  !filename.match(/^README\.md$/) &&
  Boolean(filename.match(/\.md+$/));

/**
 * Pretty print page data
 * @param pageData
 * @returns
 */
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

/**
 * remove file extension
 * @param filename
 * @returns
 */
export const removeExtension = (filename: string) =>
  filename.replace(/\.[^/.]+$/, "");
