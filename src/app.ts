import express, { response } from "express";
import { UserModel } from "./shared/sequelize/models/user.model";
const app = express();
import {
  authenticatRequest,
  authEndPoints,
  Request,
  HTTP_STATUS_CODES,
} from "./auth";
app.use(express.json({ limit: "10mb" }));
import dotenv from "dotenv";
import {
  ContactAttributes,
  ContactModel,
} from "./shared/sequelize/models/contact.model";
import { Op } from "sequelize";
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
// Get all contacts by user id
app.get(
  "/allContactsByUser",
  authenticatRequest,
  async (req: any, res: any) => {
    let contacts = await ContactModel.findAll({
      where: { userId: req.user.get("id") },
    });

    res.send(contacts);
  }
);

// INSERT CONTACT INTO DB
interface createContactRequest extends Omit<Request, "body"> {
  body: {
    contact: ContactAttributes;
  };
}

app.post(
  "/newContact",
  authenticatRequest,
  async (req: createContactRequest, res: any) => {
    let values: any = [];

    if (!req.body.contact) {
      res.sendStatus(HTTP_STATUS_CODES.Bad_Request);
      return;
    }

    Object.keys(req.body.contact).forEach((key: string) => {
      //@ts-ignore
      let value: any = req.body.contact[key];

      if (["name", "email", "phone"].includes(key)) values.push(value);
    });

    if (values.length < 1) {
      res.sendStatus(HTTP_STATUS_CODES.Bad_Request);
      return;
    }

    await ContactModel.create({
      ...req.body.contact,
      userId: req.user.get("id") as number,
    });

    res.sendStatus(HTTP_STATUS_CODES.Created);
  }
);
// delete contact from db
app.delete(
  "/deleteContact/:id",
  authenticatRequest,
  async (req: Request, res: any) => {
    let contact = await ContactModel.findOne({
      where: { id: req.params.id },
    });
    if (!contact) {
      res.sendStatus(HTTP_STATUS_CODES.NotFound);
      return;
    }

    if (contact.userId !== req.user.id) {
      res.sendStatus(HTTP_STATUS_CODES.Forbidden);
      return;
    }
    await contact.destroy();
    res.sendStatus(HTTP_STATUS_CODES.Ok);
  }
);

// contact search using search key word
app.get(
  "/contacts/:searchKeyWord",
  authenticatRequest,
  async (req: Request, res: any) => {
    let searchKeyWord = req.params.searchKeyWord;

    let contacts = await ContactModel.findAll({
      where: {
        userId: req.user.get("id"),
        name: { [Op.like]: `%${searchKeyWord}%` },
      },
    });
    res.send(contacts);
  }
);

// Edit contact on  db
app.put(
  "/editContact/:id",
  authenticatRequest,
  async (req: Request, res: any) => {
    if (!req.params.id) {
      res.sendStatus(HTTP_STATUS_CODES.Bad_Request);
      return;
    }

    let contact = await ContactModel.findOne({
      where: { id: req.params.id },
    });
    console.log(JSON.stringify(contact));

    if (!contact) {
      res.sendStatus(HTTP_STATUS_CODES.NotFound);
      return;
    }
    if (contact.get("userId") !== req.user.get("id")) {
      res.sendStatus(HTTP_STATUS_CODES.Forbidden);
      return;
    }
    let values: string[] = [];

    Object.keys(req.body.contact).forEach((key: string) => {
      //@ts-ignore
      let value: string = req.body.contact[key];

      if (["name", "email", "phone"].includes(key)) values.push(value);
    });
    if (values.length < 1) {
      res.sendStatus(HTTP_STATUS_CODES.Bad_Request);
      return;
    }

    await contact.update(req.body.contact);

    res.sendStatus(HTTP_STATUS_CODES.Ok);
  }
);

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
