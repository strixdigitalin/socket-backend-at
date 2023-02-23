const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  email: String,
  password: String,
  time: { type: Date, default: Date.now },
  approveTime: { type: Date, default: null },
});

const user = mongoose.model("users", UserSchema);
module.exports = user;
