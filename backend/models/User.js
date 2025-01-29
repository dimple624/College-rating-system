const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  collegeId: String,
  name: String,
  username: { type: String, unique: true },
  password: String,
});

module.exports = mongoose.model("User", userSchema);
