const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const RegisterModel = require("../models/Register");
const jwt = require("jsonwebtoken");
const checkToken = require("../utilities/checkToken");
const nodemailer = require("nodemailer");


router.post("/changeusername",checkToken, async (req, res) => {
   try
   {
        const { currentusername, newusername } = req.body;
        const username = currentusername;
        const usernameExists = await RegisterModel.findOne({ username });
        if (!usernameExists) return res.json("Username not Exist");
        else
        {
            usernameExists.updateOne({username : newusername} , function(err)
            {
              if(err) console.log(err);
              else return res.json("Username changed successful");            
            })
        }
   }
    catch (error) {return res.json(error.message);}
  });
   router.post("/changepassword" ,async (req, res) => {
    try
    {
      const {currentpassword , newpassword , token} = req.body;
      const hashedNewPassword = await bcrypt.hash(newpassword,10);
      const verified = jwt.verify(token,"thisismysecretkey");
      const email = verified;
      const userExists = await RegisterModel.findOne({ email });
      if(!userExists) return res.json(err);
      else
      {
        const oldhashedPassword = userExists.password;
        bcrypt.compare(currentpassword, oldhashedPassword, (err, isMatch) => {
          if (err) res.json("Incorrect CurrentPassword");
          else if (isMatch)
          {
            userExists.updateOne({password : hashedNewPassword} , function(err)
            {
              if(err) console.log(err);
              else return res.json("Change password succesful");            
            })
          }
          else return res.json("Incorrect CurrentPassword");
        });
      }
      console.log(verified);
    } 
     catch (error) {return res.json(error.message);}
   });

   router.post("/changeemail" ,async (req, res) => {
    try
    {
      const currentemail = req.body.currentemail;
      console.log(currentemail);
      const email = currentemail;
      const userExists = await RegisterModel.findOne({ email });
      if (!userExists) return res.json("Incorrect CurrentEmail");
      else
      {
        const confirmcode= Math.floor(100000 + Math.random() * 900000);
        const newemail = req.body.newemail;
        console.log(newemail);
        const email = newemail;
        const newuserExists = await RegisterModel.findOne({ email });
        if (newuserExists) return res.json("NewEmail already Taken");
        else
        {
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
            to: newemail, // list of receivers
            subject: 'ConfirmCode', // Subject line
            text: 'VerifyCode: '+confirmcode, // plain text body
          };
          
            // send mail with defined transport object
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) return res.json("Invalid Email");
            else {
              localStorage.setItem('currentemail',currentemail);
              localStorage.setItem('newemail',newemail);
              localStorage.setItem('confirmcode',confirmcode);
              return res.json("Changing Email");
            }
            });
      }
    }
  } 
     catch (error) {return res.json(error.message);}
   });

   router.post("/confirmchangeemail",async (req,res)=>
  {
    try{
      const confirmcode = localStorage.getItem('confirmcode');
      const code = req.body.code;
      if(code!=confirmcode) return res.json("Wrong Code");
      else 
      {
        const newemail = localStorage.getItem('newemail');
        const currentemail = localStorage.getItem('currentemail');
        const email = currentemail;
        const userExists = await RegisterModel.findOne({ email });
        userExists.updateOne({email : newemail} , function(err)
        {
          if(err) console.log(err);
          else return res.json("Email changed successful");            
        })
      }
  }
    catch(error)
    {
      return res.json(error.message);
    }
  });

  module.exports = router;