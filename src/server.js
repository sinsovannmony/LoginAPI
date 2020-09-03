const express = require("express");
const cors = require("cors");
const expressLayouts = require('express-ejs-layouts');
const flash = require("connect-flash");
const mongoose = require("mongoose");
const registerRouter = require("./routes/register");
const forgotpasswordRouter = require("./routes/forgotpassword");


async function startserver()
{
  const app = express();
  const PORT = 8080;
  const DB_Connect = "mongodb://localhost:27017/Register";
  app.use(require('express-session')({ secret: 'anything',resave: true, saveUninitialized: true,}));

// EJS
  app.use(expressLayouts);
  app.set('view engine', 'ejs');

  // Express body parser
  app.use(express.urlencoded({ extended: false }));
  
  app.use(flash());

  app.use(express.json());
  app.use(cors());
  app.use("/", registerRouter); 
  app.use("/",forgotpasswordRouter)

  await mongoose.connect(DB_Connect, { useNewUrlParser: true, useUnifiedTopology: true,})
  .then(() => console.log("Connection Completed"))
  .catch((err) => console.log(err));

  app.listen(PORT,(req,res)=>
  {
    console.log("PORT 8080 is Running");
  })
}
startserver();





