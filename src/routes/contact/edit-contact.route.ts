import { authenticatRequest, HTTP_STATUS_CODES, Request } from "../../auth";
import { ContactModel } from "../../shared/sequelize/models/contact.model";

export let editContactEndpoint = (app: any) => {
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
};
