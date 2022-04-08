import { authenticatRequest, Request, HTTP_STATUS_CODES } from "../../auth";
import { MessageModel } from "../../shared/sequelize/models/message.model";

export let deleteMessageEndpoint = (app: any) => {
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
      res.send({});
    }
  );
};
