import cors from "cors";
import dotenv from "dotenv";

require("dotenv").config();

import express from "express";
import { authEndPoints } from "./auth";
import { createContactEndpoint } from "./routes/contact/create-contact.route";
import { deleteContactEndpoint } from "./routes/contact/delete-contact.route";
import { editContactEndpoint } from "./routes/contact/edit-contact.route";
import { contactEndpoints } from "./routes/contact/get-contacts.route";
import { messageEndpoints } from "./routes/message/messages-routes";
import { numberEndpoints } from "./routes/nomber/number";

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));
dotenv.config();
const PORT = 5000;
authEndPoints(app);
contactEndpoints(app);
createContactEndpoint(app);
deleteContactEndpoint(app);
editContactEndpoint(app);
messageEndpoints(app);
numberEndpoints(app);

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
