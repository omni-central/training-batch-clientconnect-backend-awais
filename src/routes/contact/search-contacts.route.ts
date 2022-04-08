import { Op } from "sequelize";
import { authenticatRequest, Request } from "../../auth";
import { ContactModel } from "../../shared/sequelize/models/contact.model";

export let searchContactEndpoint = (app: any) => {
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
};
