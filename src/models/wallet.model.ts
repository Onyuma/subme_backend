import { DataTypes } from "sequelize";
import { Column, Model, Table } from "sequelize-typescript";

@Table({tableName: 'wallets', timestamps: true, })
export class Wallet extends Model {
    @Column({type: DataTypes.UUID, primaryKey: true, allowNull: false, defaultValue: DataTypes.UUIDV4})
    uid!: string;
    @Column({type: DataTypes.INTEGER, allowNull: false, defaultValue: 0})
    balance!: number;
    @Column({type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true})
    is_active!: boolean;
    
}