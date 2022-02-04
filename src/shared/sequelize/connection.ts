import { Sequelize } from "sequelize";
require("dotenv").config();
let {
  DB_USERNAME,
  DB_HOST,
  DB_PASSWORD,
  DB_NAME,
}: {
  DB_USERNAME: string;
  DB_HOST: string;
  DB_PASSWORD: string;
  DB_NAME: string;
} = process.env as any;

export const db = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  host: DB_HOST,
  dialect: "mysql",
  logging: false,
});
