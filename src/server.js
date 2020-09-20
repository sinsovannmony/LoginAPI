const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const registerRouter = require("./routes/register");
const roomRouter = require("./routes/room");
const forgotpasswordRouter = require("./routes/forgotpassword");
require('dotenv').config();


async function startserver()
{
  const app = express();
  const PORT = process.env.PORT;
  const DB_Connect = process.env.DB_CONNECTION;

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(cors());
  app.use("/", registerRouter); 
  app.use("/",forgotpasswordRouter);
  app.use("/",roomRouter)

  await mongoose.connect(DB_Connect, { useNewUrlParser: true, useUnifiedTopology: true,})
  .then(() => console.log("DB CONNECTION COMPLETE"))
  .catch((err) => console.log(err));

  app.listen(PORT,(req,res)=>
  {
    console.log("RUNNING PORT : "+PORT);
  })
}
startserver();





