import { authenticatRequest } from "../../auth";
import { numberModel } from "../../shared/sequelize/models/number.model";

export let numberEndpoints = (app: any) => {
  app.get("/numbers", authenticatRequest, async (req: any, res: any) => {
    let numbers = await numberModel.findAll({
      where: { userId: req.user.get("id") },
    });
    res.send(numbers);
  });
};
