import { TokenModel } from "./shared/sequelize/models/token.model";
import { json, Op } from "sequelize";
import express from "express";
import {
  UserAttributes,
  UserModel,
} from "./shared/sequelize/models/user.model";
import jwt from "jsonwebtoken";
interface Request extends express.Request {
  user: UserModel;
}

export function authEndPoints(app: express.Express) {
  //get user from db  access token and refresh token
  app.post(
    "/login",
    async (req: { body: { email: string; password: string } }, res: any) => {
      let user = await UserModel.findOne({
        where: { email: req.body.email, password: req.body.password },
      });

      if (user) {
        // let tokenPayload:Omit<UserAttributes,"password"> & {password?: string} = JSON.parse(JSON.stringify(user));
        let tokenPayload: UserAttributes = JSON.parse(JSON.stringify(user));

        let accessToken = generateAccessToken(tokenPayload);
        let refreshToken;

        let userRefreshToken = await TokenModel.findAll({
          where: { userId: user.get("id"), type: TokenType.REFRESH },
        });
        // testin code
        let dbAccessTokens = await TokenModel.findAll({
          where: { userId: user.get("id"), type: TokenType.ACCESS },
        });
        if (dbAccessTokens) {
          await removeAllAccessTokens(dbAccessTokens);
        }

        await TokenModel.create({
          type: TokenType.ACCESS,
          userId: tokenPayload.id!,
          token: accessToken,
        });

        // if (accessToken.length < 1) {
        //   refreshToken = generateRefreshToken(tokenPayload);
        //   await TokenModel.create({
        //     type: TokenType.REFRESH,
        //     token: refreshToken,
        //     userId: user.get("id") as number,
        //   });
        // }
        // testin code

        if (userRefreshToken.length < 1) {
          refreshToken = generateRefreshToken(tokenPayload);
          await TokenModel.create({
            type: TokenType.REFRESH,
            token: refreshToken,
            userId: user.get("id") as number,
          });
        } else {
          refreshToken = userRefreshToken[0].get("token");
        }
        // @ts-ignore
        delete tokenPayload.password;
        res.send({ user: tokenPayload, accessToken, refreshToken });
      } else {
        res.sendStatus(404);
      }
    }
  );

  // Generate web AccessToken
  function generateAccessToken(user: {
    email: string;
    password: string;
  }): string {
    return jwt.sign(user, process.env.ACCESS_TOKEN_KEY as any, {
      expiresIn: "15m",
    });
  }
  // Generate web RefreshToken
  function generateRefreshToken(user: {
    email: string;
    password: string;
  }): string {
    return jwt.sign(user, process.env.REFRESH_TOKEN_KEY as any);
  }

  // Remove All AccessTokens
  function removeAllAccessTokens(tokens: TokenModel[]): Promise<any> {
    return Promise.all(
      tokens.map((token) => {
        return TokenModel.destroy({ where: { id: token.get("id") } });
      })
    );
  }

  //Generate new token
  app.get("/token", async (req: any, res: any) => {
    let refreshToken: any = req.headers.authorization;
    refreshToken = refreshToken.split(" ");
    refreshToken = refreshToken.length > 0 ? refreshToken[1] : undefined;
    if (!refreshToken) {
      res.sendStatus(HTTP_STATUS_CODES.Unauthorized);
      return;
    }

    try {
      let user: any = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_KEY as any
      );
      if (user) {
        user = await UserModel.findOne({ where: { id: user.id } });

        if (!user) {
          res.sendStatus(HTTP_STATUS_CODES.Forbidden);
          return;
        }
      } else {
        res.sendStatus(HTTP_STATUS_CODES.Forbidden);
      }

      let accessToken = generateAccessToken(JSON.parse(JSON.stringify(user)));

      res.send(accessToken);
    } catch (e: any) {
      res.sendStatus(HTTP_STATUS_CODES.Forbidden);
    }
  });

  // logOut endPoint
  app.get("/logout", async (req: Request, res: any) => {
    let tokens = await TokenModel.findAll({
      where: {
        userId: req.user.get("id"),
        type: { [Op.in]: [TokenType.ACCESS, TokenType.REFRESH] },
      },
    });

    if (tokens.length > 0) await removeAllAccessTokens(tokens);

    res.sendStatus(HTTP_STATUS_CODES.Ok);
  });
}

// Authenticat user request
export async function authenticatRequest(req: any, res: any, next: any) {
  try {
    let accessToken = req.headers.authorization;
    accessToken = accessToken.split(" ");
    accessToken = accessToken.length > 0 ? accessToken[1] : undefined;
    if (!accessToken) {
      res.sendStatus(HTTP_STATUS_CODES.Unauthorized);
      return;
    }
    let payload: UserAttributes = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_KEY as any
    ) as any;

    if (!payload) {
      res.sendStatus(HTTP_STATUS_CODES.Forbidden);
    }

    let dbAccessToken = TokenModel.findOne({
      where: { userId: payload.id, type: TokenType.ACCESS },
    });
    if (!dbAccessToken) {
      res
        .sendStatus(HTTP_STATUS_CODES.Forbidden)
        .send("Session expired or user logout");

      return;
    }

    let user = await UserModel.findOne({ where: { id: payload.id } });

    if (!user) {
      res.sendStatus(HTTP_STATUS_CODES.Forbidden);
      return;
    }

    req.user = user;

    next();
  } catch (e: any) {
    res.sendStatus(HTTP_STATUS_CODES.Unauthorized);
  }
}

export const contacts = [
  {
    id: 1,
    firstName: "Awais",
    lastName: "Malik",
    email: "awais.malik.q@gmail.com",
  },

  {
    id: 2,
    firstName: "ali",
    lastName: "Malik",
    email: "ali.malik.q@gmail.com",
  },
  {
    id: 3,
    firstName: "Mohsin",
    lastName: "Raza",
    email: "Mohsin.q@gmail.com",
  },
  {
    id: 4,
    firstName: "Asif",
    lastName: "Malik",
    email: "Asif.malik.q@gmail.com",
  },
];

export enum TokenType {
  REFRESH = "refresh",
  ACCESS = "access",
}

export enum HTTP_STATUS_CODES {
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  Ok = 200,
}
