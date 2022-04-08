import { authenticatRequest, HTTP_STATUS_CODES, Request } from "../../auth";
import {
  MessageAttributes,
  MessageModel,
} from "../../shared/sequelize/models/message.model";

export let newMessageEndpoint = (app: any) => {
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
};
