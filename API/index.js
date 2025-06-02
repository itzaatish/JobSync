import express from "express";
import {PrismaClient} from "@prisma/client";
import router from "./Routes/Router.js";
import bodyParser from "body-parser";

const db = new PrismaClient();
const App = express();

App.use(bodyParser.json());
App.use('/', router);

const port = 2000;
App.listen(port, () => {
  console.log(`Server is Running at port: ${port}`);
});
