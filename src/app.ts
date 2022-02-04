import express from "express";
import { UserModel } from "./shared/sequelize/models/user.model";
const app = express();
const PORT = 5000;
app.get("", async (req: any, res: any) => {
  let users = await UserModel.findAll();

  res.send(users);
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
