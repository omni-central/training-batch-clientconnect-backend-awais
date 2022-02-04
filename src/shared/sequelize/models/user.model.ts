import { Optional, Model, DataTypes } from "sequelize";
import { db } from "../connection";

interface UserAttributes {
  id?: number;
  name: string;
  email: string;
  password: string;
  readonly createdAt?: string;
  updatedAt?: string;
}
export interface userCreationAttributes
  extends Optional<UserAttributes, "id" | "updatedAt" | "createdAt"> {}
export class UserModel
  extends Model<UserAttributes, userCreationAttributes>
  implements UserAttributes
{
  id?: number;
  name: string;
  email: string;
  password: string;
  readonly createdAt?: string;
  updatedAt?: string;
}
UserModel.init(
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
      unique: true,
    },
    password: {
      type: new DataTypes.STRING(),
    },
    createdAt: {
      type: new DataTypes.DATE(),
    },
    updatedAt: {
      type: new DataTypes.DATE(),
    },
  },
  {
    tableName: "users",
    sequelize: db,
  }
);
