const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const RegisterModel = require("../models/Register");
const jwt = require("jsonwebtoken");
const checkToken = require("../utilities/checkToken");
const nodemailer = require("nodemailer");


router.post("/register", async (req, res) => {
    try {
      const email = req.body.email;
      console.log(email);
      const userExists = await RegisterModel.findOne({ email });
      if (userExists) return res.json("Aleady Taken");
      else
      {
        const confirmcode= Math.floor(100000 + Math.random() * 900000);
        const hashedPassword = await bcrypt.hash(req.body.password,10);
        const username = req.body.username;
        const gender = req.body.gender;
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
          if (error) return res.json(error);
          else {
            localStorage.setItem('confirmcode',confirmcode);
            localStorage.setItem('password',password);
            localStorage.setItem('username',username);
            localStorage.setItem('gender',gender);
            localStorage.setItem('email',email);
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
      console.log(email);
      const userExists = await RegisterModel.findOne({ email });
      if (!userExists) return res.json("Incorrect email");
      else
      {
        const hashedPassword = userExists.password;
        bcrypt.compare(password, hashedPassword, (err, isMatch) => {
          if (err) console.log(err);
          else if (isMatch)
          {
            const token = jwt.sign(email, process.env.SECRET);
            return res.json(token+"/"+userExists.username+"/"+email+"/"+userExists.gender);
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
      const confirmcode = localStorage.getItem('confirmcode');
      const code = req.body.code;
      if(code!=confirmcode) return res.json("Error Code");
      else 
      {
        const email = localStorage.getItem('email');
        const username = localStorage.getItem('username');
        const password = localStorage.getItem('password');
        const gender = localStorage.getItem('gender');
        const newUser = await RegisterModel.create({ username, password, email ,gender});
        return res.json("Right Code")
      }
  }
    catch(error)
    {
      return res.json(error.message);
    }
  });

  router.post("/show",checkToken,async (req,res)=>
  {
    try{
     return res.json("U can do it");
    } 
    catch (error) {
      return res.json({ msg: error.message});
    }
  });

  module.exports = router;