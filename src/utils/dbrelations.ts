import Profile from "../models/profile.model";
import Transaction from "../models/transaction.model";
import User from "../models/user.model";
import Wallet from "../models/wallet.model";

const dbrelations = () => {
  User.hasOne(Profile, { foreignKey: "userUid", onDelete: "CASCADE" });
  Profile.belongsTo(User, { foreignKey: "userUid" });

  User.hasOne(Wallet, { foreignKey: "userUid", onDelete: "CASCADE" });
  Wallet.belongsTo(User, { foreignKey: "userUid" });

  User.hasMany(Transaction, {
    constraints: true,
    foreignKey: "senderId",
    as: "SentTransaction",
    onDelete: "CASCADE",
  });
  Transaction.belongsTo(User, {
    foreignKey: "senderId",
    as: "Sender",
  });

  User.hasMany(Transaction, {
    constraints: true,
    foreignKey: "recipientId",
    as: "ReceivedTransaction",
    onDelete: "CASCADE",
  });
  Transaction.belongsTo(User, {
    foreignKey: "recipientId",
    as: "Recipient",
  });
};

export default dbrelations;
