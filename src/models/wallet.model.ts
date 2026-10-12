import { DataTypes } from "sequelize";
import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import User from "./user.model";
@Table({ tableName: "wallets", timestamps: true, modelName: "wallet" })
export default class Wallet extends Model {
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
  @Column({
    type: DataTypes.FLOAT({ decimals: 2 }),
    allowNull: false,
    defaultValue: 0,
  })
  balance!: number;
  @Column({ type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true })
  is_active!: boolean;
}
