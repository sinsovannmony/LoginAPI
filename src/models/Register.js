const mongoose = require("mongoose");

const RegisterSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  gender: {
    type: String ,
    required : true,
  },
});

const RegisterModel = mongoose.model("Register", RegisterSchema);

module.exports = RegisterModel;