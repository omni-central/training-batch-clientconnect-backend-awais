import { Op } from "sequelize";
import { authenticatRequest, Request } from "../../auth";
import { MessageModel } from "../../shared/sequelize/models/message.model";

export let searchMessageEndpoint = (app: any) => {
  // contact search using search key word
  app.get(
    "/messages/:searchKeyWord?",
    authenticatRequest,
    async (req: Request, res: any) => {
      let searchKeyWord = req.params.searchKeyWord;

      let messages = await MessageModel.findAll({
        where: {
          userId: req.user.get("id"),
          name: { [Op.like]: `%${searchKeyWord}%` },
        },
      });
      res.send(messages);
    }
  );
};
