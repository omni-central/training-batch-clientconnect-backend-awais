import { Optional, Model, DataTypes } from "sequelize";
import { db } from "../connection";

export interface MessageAttributes {
  id?: number;
  userId: number;
  name: string;
  message: string;
  phone: string;

  readonly createdAt?: string;
  updatedAt?: string;
}
export interface MessageCreationAttributes
  extends Optional<MessageAttributes, "id" | "updatedAt" | "createdAt"> {}
export class MessageModel
  extends Model<MessageAttributes, MessageCreationAttributes>
  implements MessageAttributes
{
  id?: number;
  userId: number;
  name: string;
  message: string;
  phone: string;

  readonly createdAt?: string;
  updatedAt?: string;
}
MessageModel.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },

    name: {
      type: new DataTypes.STRING(),
    },
    message: {
      type: new DataTypes.STRING(),
    },
    phone: {
      type: new DataTypes.STRING(),
    },

    userId: {
      type: DataTypes.INTEGER,
    },

    createdAt: {
      type: new DataTypes.DATE(),
    },
    updatedAt: {
      type: new DataTypes.DATE(),
    },
  },
  {
    tableName: "message",
    sequelize: db,
  }
);
