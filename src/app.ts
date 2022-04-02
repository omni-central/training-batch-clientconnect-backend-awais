import express, { response } from "express";
import cors from "cors";

import { UserModel } from "./shared/sequelize/models/user.model";
const app = express();
app.use(cors());
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
import {
  MessageAttributes,
  MessageModel,
} from "./shared/sequelize/models/message.model";
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
app.get("/contacts", authenticatRequest, async (req: any, res: any) => {
  let contacts = await ContactModel.findAll({
    where: { userId: req.user.get("id") },
  });

  res.send(contacts);
});

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

    var matchedContactEmail = await ContactModel.findAll({
      where: { email: req.body.contact.email },
    });

    if (matchedContactEmail.length > 0) {
      res.send({ message: "Your Email is already exist in contacts" });
      return;
    }

    Object.keys(req.body.contact).forEach((key: string) => {
      //@ts-ignore
      let value: any = req.body.contact[key];

      if (["name", "email", "phone", "groups"].includes(key))
        values.push(value);
    });

    if (values.length < 1) {
      res.sendStatus(HTTP_STATUS_CODES.Bad_Request);
      return;
    }

    await ContactModel.create({
      ...req.body.contact,
      userId: req.user.get("id") as number,
    });

    res.send({});
    return;
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
    res.status(HTTP_STATUS_CODES.Ok).send({});
  }
);

// contact search using search key word
app.get(
  "/contacts/:searchKeyWord?",
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

    if (!contact) {
      res.sendStatus(HTTP_STATUS_CODES.NotFound);
      return;
    }

    // check if email is Aready exist

    var matchedContactEmail = await ContactModel.findAll({
      where: { email: req.body.contact.email },
    });

    if (matchedContactEmail.length > 0) {
      res.send({ message: "Your Email is already exist in contacts" });
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

      if (["name", "email", "phone", "groups"].includes(key))
        values.push(value);
    });
    if (values.length < 1) {
      res.sendStatus(HTTP_STATUS_CODES.Bad_Request);
      return;
    }

    // awais malik this is test

    await contact.update(req.body.contact);

    res.send({});
  }
);

// get all messags from db
// Get Alll Message after token authentication
app.get("/allMessages", authenticatRequest, async (req, res) => {
  let messages = await MessageModel.findAll();

  res.send(messages);
});

// Delete  Message after token authentication
app.delete(
  "/deleteMessage/:id",
  authenticatRequest,
  async (req: Request, res: any) => {
    let message = await MessageModel.findOne({
      where: { id: req.params.id },
    });
    if (!message) {
      res.sendStatus(HTTP_STATUS_CODES.NotFound);
      return;
    }
    if (message.userId != req.user.id) {
      res.sendStatus(HTTP_STATUS_CODES.Forbidden);
      return;
    }

    await message.destroy();
    res.status(HTTP_STATUS_CODES.Ok).send({});
  }
);

// create new message
// INSERT CONTACT INTO DB
interface createMessageRequest extends Omit<Request, "body"> {
  body: {
    message: MessageAttributes;
  };
}

app.post(
  "/newMessage",
  authenticatRequest,
  async (req: createMessageRequest, res: any) => {
    let values: any = [];

    if (!req.body.message) {
      res.sendStatus(HTTP_STATUS_CODES.Bad_Request);
      return;
    }

    Object.keys(req.body.message).forEach((key: string) => {
      //@ts-ignore
      let value: any = req.body.message[key];

      if (["message", "phone", "name"].includes(key)) values.push(value);
    });
    console.log(values);

    if (values.length < 1) {
      res.sendStatus(HTTP_STATUS_CODES.Bad_Request);
      return;
    }

    await MessageModel.create({
      ...req.body.message,
      userId: req.user.get("id") as number,
    });

    res.sendStatus(HTTP_STATUS_CODES.Created);
  }
);

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
