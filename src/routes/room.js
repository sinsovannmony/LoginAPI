const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const RoomModel = require("../models/Room");
const jwt = require("jsonwebtoken");
const checkToken = require("../utilities/checkToken");


router.post("/createroom",checkToken, async (req, res) => {
   try
   {
        const roomname = req.body.roomname;
        const hashedPassword = await bcrypt.hash(req.body.password,10);
        const password = hashedPassword;
        const roomExists = await RoomModel.findOne({ roomname });
        if (roomExists) return res.json("RoomName Already Token");
        else
        {
            const newRoom = await RoomModel.create({ roomname, password});
            return res.json("Room Create");
        }
   }
    catch (error) {return res.json(error.message);}
  });

  router.post("/joinroom",checkToken ,async (req, res) => {
    try
    {
        const {roomname , password} = req.body;
        const roomExists = await RoomModel.findOne({ roomname });
        if (!roomExists) return res.json("No room");
        else
        {
            const hashedPassword = roomExists.password;
            bcrypt.compare(password, hashedPassword, (err, isMatch) => {
            if (err) console.log(err);
            else if (isMatch)
            {
                return res.json("Can Join Room");
            }
            else return res.json("Incorrect Password");
            });
        }
    } 
     catch (error) {return res.json(error.message);}
   });


   router.post("/delete",checkToken, async (req, res) => {
    try
    {
        const roomname = req.body.roomname;
        const roomExists = await RoomModel.findOne({ roomname });
        if (!roomExists) return res.json("No room");
        else
        {
            roomExists.deleteOne(function(err)
            {
                if(err) console.log("err");
                else console.log("success");
            })
        }
    } 
     catch (error) {return res.json(error.message);}
   });

  module.exports = router;