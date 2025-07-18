const express = require("express");
const { PrismaClient } = require("@prisma/client");
const router = require("./Routes/Router");
const bodyParser = require("body-parser");
const cors = require('cors');
require('dotenv').config();
const db = new PrismaClient();
const App = express();

// App.use(cors({origin : 'http://localhost:5173'}))
// App.use(cors({
//   origin: 'https://job-sync-j37u7pmec-itzaatishs-projects.vercel.app',
//   credentials: true, // Optional: if you're sending cookies or headers
// }));
console.log(process.env.FRONTEND_API);  
const corsOptions = {
  origin: process.env.FRONTEND_API ,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS' ,'PATCH'],
  credentials: true,
};
App.use(cors(corsOptions));
App.options('/upload', cors(corsOptions));

App.use(bodyParser.json());
App.use('/', router);

const port = 2000;
App.listen(port, () => {
  console.log(`Server is Running at port: ${port}`);
});