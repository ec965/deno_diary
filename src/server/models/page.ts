import { DataTypes, Model } from "denodb/mod.ts";
import { db } from "src/db.ts";

export class Page extends Model {
  static table = "pages";
  static timestamps = true;
  static fields = {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    title: DataTypes.TEXT,
    body: DataTypes.TEXT,
  };
  // model records
  id!: number;
  title!: string;
  body!: string;
}

export interface PageModel {
  id?: number;
  title?: string;
  body?: string;
  createdAt?: string;
  updatedAt?: string;
}

db.link([Page]);
