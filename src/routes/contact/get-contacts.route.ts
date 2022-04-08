import { authenticatRequest } from "../../auth";
import { ContactModel } from "../../shared/sequelize/models/contact.model";
import { UserModel } from "../../shared/sequelize/models/user.model";

export let contactEndpoints = (app: any) => {
  //get all user from db
  app.get("", async (req: any, res: any) => {
    let users = await UserModel.findAll();

    res.send(users);
  });

  // Get Alll contacts after token authentication
  app.get("/allContacts", authenticatRequest, async (req: any, res: any) => {
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
};
