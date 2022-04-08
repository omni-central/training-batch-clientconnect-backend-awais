import { authenticatRequest } from "../../auth";
import { MessageModel } from "../../shared/sequelize/models/message.model";
import { deleteMessageEndpoint } from "./delete-message.route";

export let messageEndpoints = (app: any) => {
  app.get("/allMessages", authenticatRequest, async (req: any, res: any) => {
    let messages = await MessageModel.findAll();

    res.send(messages);
  });

  deleteMessageEndpoint(app);
};
