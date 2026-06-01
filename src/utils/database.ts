import sequelize from "sequelize-typescript";
import configs from "./configs";

const connection = new sequelize.Sequelize({
  dialect: "postgres",
  host: configs.POSTGRES_HOST,
  database: configs.POSTGRES_DB,
  username: configs.POSTGRES_USER,
  password: configs.POSTGRES_PASSWORD,
  logging: false,
  models: [__dirname + "/models"],
});

export default connection;
