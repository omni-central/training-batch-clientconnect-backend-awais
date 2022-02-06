import express from "express";
import { UserModel } from "./shared/sequelize/models/user.model";
const app = express();
import { contacts, authenticatRequest, authEndPoints } from "./auth";
app.use(express.json({ limit: "10mb" }));
import dotenv from "dotenv";
dotenv.config();
const PORT = 5000;
authEndPoints(app);
//get all user from db
app.get("", async (req: any, res: any) => {
  let users = await UserModel.findAll();

  res.send(users);
});

// Get Alll contacts after token authentication
app.get("/allContacts", authenticatRequest, (req, res) => {
  res.send(contacts);
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
