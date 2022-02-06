import express from "express";
import { UserModel } from "./shared/sequelize/models/user.model";
const app = express();
import { contacts } from "./auth";
app.use(express.json({ limit: "10mb" }));
import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import { TokenModel } from "./shared/sequelize/models/token.model";
import { json } from "sequelize/dist";
const PORT = 5000;

//get all user from db
app.get("", async (req: any, res: any) => {
  let users = await UserModel.findAll();

  res.send(users);
});

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

app.get("/allContacts", authenticatRequest, (req, res) => {
  res.send(contacts);
});

// Authenticat user request
async function authenticatRequest(req: any, res: any, next: any) {
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

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
