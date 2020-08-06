const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const expressLayouts = require('express-ejs-layouts');
const bcrypt = require("bcrypt");
const registerRouter = require("./routes/register");


async function startserver()
{
  const app = express();
  const PORT = 8080;
  const DB_Connect = "mongodb://localhost:27017/Register";
  
  // EJS
  app.use(expressLayouts);
  app.set('view engine', 'ejs');

  // Express body parser
  app.use(express.urlencoded({ extended: false }));

  app.use(express.json());
  app.use(cors());
  app.use("/", registerRouter); 

  await mongoose.connect(DB_Connect, { useNewUrlParser: true, useUnifiedTopology: true,})
  .then(() => console.log("Connection Completed"))
  .catch((err) => console.log(err));

  app.listen(PORT,(req,res)=>
  {
    console.log("PORT 8080 is Running");
  })
}
startserver();





