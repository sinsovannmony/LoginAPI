const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
  roomname: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const RoomModel = mongoose.model("Room", RoomSchema);

module.exports = RoomModel;