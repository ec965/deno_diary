import { DataTypes, Model } from "denodb/mod.ts";
import { db } from "../db.ts";

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
}

export interface PageModel {
  id?: number;
  title?: string;
  body?: string;
}

db.link([Page]);
