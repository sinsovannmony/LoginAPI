const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const RegisterModel = require("../models/Register");


router.post("/register", async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password,10);
      const username = req.body.username;
      const email = req.body.email;
      const password = hashedPassword;
      const userExists = await RegisterModel.findOne({ email });
      if (userExists) {
        return res.json("Aleady Taken");
      }
      else
      {
        const newUser = await RegisterModel.create({ username, password, email });
        return res.json("Register Successfully");
      }
      
    } catch (error) {
      return res.json(error.message);
    }
  });

  router.post("/login",async (req,res)=>
  {
    try {
      const { email, password } = req.body;
      const userExists = await RegisterModel.findOne({ email });
      if (!userExists) {
        return res.json("Incorrect email");
      }
      else
      {
        const hashedPassword = userExists.password;
        bcrypt.compare(password, hashedPassword, (err, isMatch) => {
          if (err)
          {
            console.log(err);
          }
          else if (isMatch)
          {
            return res.json("Successful");
          }
          else 
          {
            return res.json("Incorrect Password");
          }
        });
      }
    } 
    catch (error) {
      return res.json({ msg: error.message});
    }
  });
  
  module.exports = router;