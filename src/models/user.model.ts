import { DataTypes } from "sequelize";
import { Column, Model, Table } from "sequelize-typescript";
import bcrypt from "bcryptjs";

@Table({ tableName: "users", timestamps: true })
export default class User extends Model {
  [x: string]: any;
  @Column({
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4,
  })
  uid!: string;
  @Column({ type: DataTypes.STRING, allowNull: false, unique: true })
  email!: string;
  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    set(value: string) {
      this.setDataValue("password", bcrypt.hashSync(value, 13));
    },
  })
  password!: string;
}
