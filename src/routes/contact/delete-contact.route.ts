import { authenticatRequest, HTTP_STATUS_CODES, Request } from "../../auth";
import { ContactModel } from "../../shared/sequelize/models/contact.model";

export let deleteContactEndpoint = (app: any) => {
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
      res.send({});
    }
  );
};
