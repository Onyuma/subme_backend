import { DataTypes } from "sequelize";
import { Column, Model, Table } from "sequelize-typescript";

@Table({tableName: 'transactions', timestamps: true, })
export class Transaction extends Model {
    @Column({type: DataTypes.UUID, primaryKey: true, allowNull: false, defaultValue: DataTypes.UUIDV4})
    uid!: string;
    @Column({type: DataTypes.STRING, allowNull: false})
    transaction_id!: string;
    @Column({type: DataTypes.STRING, allowNull: false})
    network!: string;
    @Column({type: DataTypes.STRING, allowNull: false})
    price!: string;
    @Column({type: DataTypes.STRING, allowNull: false})
    category!: string;
    @Column({type: DataTypes.STRING, allowNull: false})
    validity!: string;
    @Column({type: DataTypes.STRING, allowNull: false})
    phone_number!: string;
    
}