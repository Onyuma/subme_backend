import { Profile } from "../models/profile.model";
import { Transaction } from "../models/transaction.model";
import { User } from "../models/user.model";
import { Wallet } from "../models/wallet.model";

const dbrelations = () => {
  User.hasOne(Profile, { foreignKey: "userUid", onDelete: "CASCADE" });
  Profile.belongsTo(User);

  User.hasOne(Wallet, { foreignKey: "userUid", onDelete: "CASCADE" });
  Wallet.belongsTo(User);

  User.hasMany(Transaction, {
    constraints: true,
    foreignKey: "userUid",
    onDelete: "CASCADE",
  });
  Transaction.belongsTo(User);
};

export default dbrelations;
