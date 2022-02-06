import { TokenModel } from "./shared/sequelize/models/token.model";
import { json } from "sequelize";
import { UserModel } from "./shared/sequelize/models/user.model";
import jwt from "jsonwebtoken";

export function authEndPoints(app: any) {
  //get user from db  access token and refresh token
  app.post(
    "/login",
    async (req: { body: { email: string; password: string } }, res: any) => {
      let user = await UserModel.findOne({
        where: { email: req.body.email, password: req.body.password },
      });

      if (user) {
        let tokenPayload = JSON.parse(JSON.stringify(user));
        let accessToken = generateAccessToken(tokenPayload);
        let refreshToken;

        let userRefreshToken = await TokenModel.findAll({
          where: { userId: user.get("id"), type: "refresh" },
        });

        if (userRefreshToken.length < 1) {
          refreshToken = generateRefreshToken(tokenPayload);
          await TokenModel.create({
            type: "refresh",
            token: refreshToken,
            userId: user.get("id") as number,
          });
        } else {
          refreshToken = userRefreshToken[0].get("token");
        }
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

  //Generate new token
  app.get("/token", async (req: any, res: any) => {
    let refreshToken: any = req.headers.authorization;
    refreshToken = refreshToken.split(" ");
    refreshToken = refreshToken.length > 0 ? refreshToken[1] : undefined;
    if (!refreshToken) {
      res.sendStatus(401);
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
          res.sendStatus(403);
          return;
        }
      } else {
        res.sendStatus(403);
      }

      let accessToken = generateAccessToken(JSON.parse(JSON.stringify(user)));

      res.send(accessToken);
    } catch (e: any) {
      res.sendStatus(403);
    }
  });
}

// Authenticat user request
export async function authenticatRequest(req: any, res: any, next: any) {
  let accessToken = req.headers.authorization;
  accessToken = accessToken.split(" ");
  accessToken = accessToken.length > 0 ? accessToken[1] : undefined;
  if (!accessToken) {
    res.sendStatus(401);
    return;
  }
  try {
    let payload: any = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_KEY as any
    );
    if (!payload) {
      res.sendStatus(403);
    }

    let user = await UserModel.findOne({ where: { id: payload.id } });

    if (!user) {
      res.sendStatus(403);
      return;
    }

    req.user = user;

    next();
  } catch (e: any) {
    res.sendStatus(401);
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
