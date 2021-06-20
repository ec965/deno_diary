import { DataTypes, Model } from "https://deno.land/x/denodb/mod.ts";
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

db.link([Page]);
