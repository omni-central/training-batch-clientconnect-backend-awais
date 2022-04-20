import { Optional, Model, DataTypes } from "sequelize";
import { db } from "../connection";

export interface numberAttributes {
  id?: number;
  userId: number;

  number: string;

  readonly createdAt?: string;
  updatedAt?: string;
}
export interface numberCreationAttributes
  extends Optional<numberAttributes, "id" | "updatedAt" | "createdAt"> {}
export class numberModel
  extends Model<numberAttributes, numberCreationAttributes>
  implements numberAttributes
{
  id?: number;
  userId: number;

  number: string;

  readonly createdAt?: string;
  updatedAt?: string;
}
numberModel.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },

    number: {
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
    tableName: "numbers",
    sequelize: db,
  }
);
