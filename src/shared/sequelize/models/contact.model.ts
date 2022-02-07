import { Optional, Model, DataTypes } from "sequelize";
import { db } from "../connection";

export interface ContactAttributes {
  id?: number;
  userId: number;
  name: string;
  email: string;
  phone: string;

  readonly createdAt?: string;
  updatedAt?: string;
}
export interface ContactCreationAttributes
  extends Optional<ContactAttributes, "id" | "updatedAt" | "createdAt"> {}
export class ContactModel
  extends Model<ContactAttributes, ContactCreationAttributes>
  implements ContactAttributes
{
  id?: number;
  userId: number;
  name: string;
  email: string;
  phone: string;

  readonly createdAt?: string;
  updatedAt?: string;
}
ContactModel.init(
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
    email: {
      type: new DataTypes.STRING(),
    },
    phone: {
      type: new DataTypes.STRING(),
    },

    userId: {
      type: DataTypes.NUMBER.UNSIGNED,
    },

    createdAt: {
      type: new DataTypes.DATE(),
    },
    updatedAt: {
      type: new DataTypes.DATE(),
    },
  },
  {
    tableName: "contacts",
    sequelize: db,
  }
);
