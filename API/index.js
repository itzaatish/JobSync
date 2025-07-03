const express = require("express");
const { PrismaClient } = require("@prisma/client");
const router = require("./Routes/Router");
const bodyParser = require("body-parser");
const cors = require('cors');

const db = new PrismaClient();
const App = express();

App.use(cors({origin : 'http://localhost:5173'}))
App.use(bodyParser.json());
App.use('/', router);

const port = 2000;
App.listen(port, () => {
  console.log(`Server is Running at port: ${port}`);
});