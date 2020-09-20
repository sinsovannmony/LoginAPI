const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const RegisterModel = require("../models/Register");
const nodemailer = require("nodemailer");
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}


router.post("/forgotpassword", async (req, res) => {
    try
    {
      const email = req.body.email;
      const userExists = await RegisterModel.findOne({ email });
      if (!userExists) return res.json("Incorrect email");
      else
      {
        const resetcode= Math.floor(100000 + Math.random() * 900000);
        const newpassword = req.body.newpassword;
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
          subject: 'ResetPassword', // Subject line
          text: 'ResetCode : ' + resetcode , // plain text body
        };
        
          // send mail with defined transport object
         transporter.sendMail(mailOptions, (error, info) => {
          // if (error) return res.json("Invalid Email");
          if(error) console.log(error);
          else{
                localStorage.setItem('resetcode',resetcode);
                localStorage.setItem('newpassword',newpassword);
                localStorage.setItem('email',email);
                return res.json("Sending to your email");
            }
          });
      }
    }
    catch (error)
    {
      return res.json({ msg: error.message});
    }
  });
  router.post("/confirmreset", async (req,res)=>
    {
      try{
        const resetcode = localStorage.getItem('resetcode');
        const code = req.body.code;
        if(code!=resetcode) return res.json("Error Code");
        else
        {
          const email = localStorage.getItem('email');
          const newpassword = localStorage.getItem('newpassword');
          const hashedNewPassword = await bcrypt.hash(newpassword,10);
          const userExists = await RegisterModel.findOne({ email });
          if(userExists) 
          {
            userExists.updateOne({password : hashedNewPassword} , function(err)
            {
              if(err) console.log(err);
              else return res.json("Reset Success");            
            })
          }
          else console.log(err);
        }
    }
      catch(error)
      {
        return res.json(error.message);
      }
    });

  
  
  module.exports = router;