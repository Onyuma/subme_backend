import { DataTypes } from "sequelize";
import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import User from "./user.model";
@Table({ tableName: "profiles", timestamps: true, modelName: "profile" })
export default class Profile extends Model {
  @ForeignKey(() => User)
  @Column({
    type: DataTypes.UUID,
    allowNull: false,
  })
  userUid!: string;
  @BelongsTo(() => User)
  user!: User;

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
