import { authenticatRequest, HTTP_STATUS_CODES, Request } from "../../auth";
import {
  ContactAttributes,
  ContactModel,
} from "../../shared/sequelize/models/contact.model";

export let createContactEndpoint = (app: any) => {
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
};
