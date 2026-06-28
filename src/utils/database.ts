import { Sequelize } from "sequelize-typescript";
import configs from "./configs";
import path from "node:path";

let connection;

const isProduction = process.env.NODE_ENV === "production";

if (!isProduction) {
  connection = new Sequelize({
    dialect: "postgres",
    host: configs.POSTGRES_HOST,
    database: configs.POSTGRES_DB,
    username: configs.POSTGRES_USER,
    password: configs.POSTGRES_PASSWORD,
    logging: false,
    models: [path.resolve(__dirname, "../models")],
    modelMatch: (filename, member) => {
      return (
        filename.substring(0, filename.indexOf(".model")) ===
        member.toLowerCase()
      );
    },
  });
} else {
  connection = new Sequelize(configs.DATABASE_URL as string, {
    dialect: "postgres",
    protocol: "postgres",
    dialectOptions: {
      ssl: isProduction
        ? {
            require: true,
            rejectUnauthorized: false,
          }
        : false,
    },
  });
}

export default connection;
