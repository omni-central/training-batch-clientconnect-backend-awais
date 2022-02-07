import express from "express";
import { UserModel } from "./shared/sequelize/models/user.model";
const app = express();
import { authenticatRequest, authEndPoints, Request } from "./auth";
app.use(express.json({ limit: "10mb" }));
import dotenv from "dotenv";
import {
  ContactAttributes,
  ContactModel,
} from "./shared/sequelize/models/contact.model";
dotenv.config();
const PORT = 5000;
authEndPoints(app);
//get all user from db
app.get("", async (req: any, res: any) => {
  let users = await UserModel.findAll();

  res.send(users);
});

// Get Alll contacts after token authentication
app.get("/allContacts", authenticatRequest, async (req, res) => {
  let contacts = await ContactModel.findAll();

  res.send(contacts);
});
// INSERT CONTACT INTO DB
interface createContactRequest extends Omit<Request, "body"> {
  body: {
    contact: ContactAttributes;
  };
}

app.post("/new", authenticatRequest, (req: createContactRequest, res: any) => {
  let values: any = [];
  Object.keys(req.body.contact).forEach((key) => {
    //@ts-ignore
    let value: any = req.body.contact[key];

    if (["name", "email", "phone"].includes(key)) values.push[value];
  });
  res.send(values);
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});




34:56 Selection 8