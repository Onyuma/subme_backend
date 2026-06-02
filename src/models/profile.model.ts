import { DataTypes } from "sequelize";
import { Column, Model, Table } from "sequelize-typescript";
import bcrypt from "bcryptjs";

@Table({ tableName: "profiles", timestamps: true })
export default class Profile extends Model {
  @Column({
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4,
  })
  uid!: string;
  @Column({ type: DataTypes.STRING, allowNull: false })
  first_name!: string;
  @Column({ type: DataTypes.STRING, allowNull: false })
  last_name!: string;
  @Column({ type: DataTypes.STRING, allowNull: false })
  phone_number!: string;
  @Column({ type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true })
  is_active!: boolean;
  @Column({ type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false })
  is_admin!: boolean;
  @Column({ type: DataTypes.STRING })
  image_url!: string;
}
