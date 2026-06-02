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
  models: [path.join(__dirname, "..", "models")],
});

export default connection;
