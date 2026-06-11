import { Sequelize } from "sequelize-typescript";
import configs from "./configs";
import path from "node:path";

const connection = new Sequelize({
  dialect: "postgres",
  host: configs.POSTGRES_HOST,
  database: configs.POSTGRES_DB,
  username: configs.POSTGRES_USER,
  password: configs.POSTGRES_PASSWORD,
  logging: false,
  models: [path.resolve(__dirname, "../models")],
  modelMatch: (filename, member) => {
    return (
      filename.substring(0, filename.indexOf(".model")) === member.toLowerCase()
    );
  },
});

export default connection;
