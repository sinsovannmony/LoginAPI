const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const RegisterModel = require("../models/Register");
const session = require("express-session");
const jwt = require("jsonwebtoken");
const flash = require("connect-flash");
const checkToken = require("../utilities/checkToken");
const nodemailer = require("nodemailer");


router.post("/register", async (req, res) => {
    try {
      const email = req.body.email;
      const userExists = await RegisterModel.findOne({ email });
      if (userExists) return res.json("Aleady Taken");
      else
      {
        const confirmcode= Math.floor(100000 + Math.random() * 900000);
        const hashedPassword = await bcrypt.hash(req.body.password,10);
        const username = req.body.username;
        const password = hashedPassword;
        let transporter = nodemailer.createTransport({
          service: "Gmail",
          port: 2525,
          auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
          },
          tls: {
            rejectUnauthorized: false,
            },
          });
        
          // setup email data with unicode symbols
        let mailOptions = {
          from: process.env.EMAIL, // sender address
          to: email, // list of receivers
          subject: 'ConfirmCode', // Subject line
          text: 'VerifyCode: '+confirmcode, // plain text body
        };
        
          // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) return res.json("Invalid Email");
          else {
            req.flash('confirmcode', confirmcode);
            req.flash('password', password);
            req.flash('username', username);
            req.flash('email', email);
            return res.json("Register");
          }
          });
      }
    }
    catch (error) {return res.json(error.message);}
  });
  router.post("/login",async (req,res)=>
  {
    try {
      const { email, password } = req.body;
      const userExists = await RegisterModel.findOne({ email });
      if (!userExists) return res.json("Incorrect email");
      else
      {
        const hashedPassword = userExists.password;
        bcrypt.compare(password, hashedPassword, (err, isMatch) => {
          if (err) console.log(err);
          else if (isMatch)
          {
            const token = jwt.sign(email, "thisismysecretkey");
            return res.json(token);
          }
          else return res.json("Incorrect Password");
        });
      }
    } 
    catch (error) {
      return res.json({ msg: error.message});
    }
  });

  router.post("/confirmemail",async (req,res)=>
  {
    try{
      const confirmcode = req.flash('confirmcode').toString().replace(/\s|\[|\]/g,"");
      const code = req.body.code;
      if(code!=confirmcode) return res.json("Error Code");
      else 
      {
        const email = req.flash('email').toString().replace(/\s|\[|\]/g,"");
        const username = req.flash('username').toString().replace(/\s|\[|\]/g,"");
        const password = req.flash('password').toString().replace(/\s|\[|\]/g,"");
        const newUser = await RegisterModel.create({ username, password, email });
        return res.json("Right Code")
      }
  }
    catch(error)
    {
      return res.json(error.message);
    }
  });
  module.exports = router;