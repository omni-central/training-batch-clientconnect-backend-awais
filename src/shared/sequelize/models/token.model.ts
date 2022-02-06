import { Optional, Model, DataTypes } from "sequelize";
import { db } from "../connection";

interface TokenAttributes {
  id?: number;
  userId: number;
  token: string;
  type: string;

  readonly createdAt?: string;
  updatedAt?: string;
}
export interface TokenCreationAttributes
  extends Optional<TokenAttributes, "id" | "updatedAt" | "createdAt"> {}
export class TokenModel
  extends Model<TokenAttributes, TokenCreationAttributes>
  implements TokenAttributes
{
  id?: number;
  userId: number;
  token: string;
  type: string;

  readonly createdAt?: string;
  updatedAt?: string;
}
TokenModel.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },

    token: {
      type: new DataTypes.STRING(),
    },
    type: {
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
    tableName: "tokens",
    sequelize: db,
  }
);
