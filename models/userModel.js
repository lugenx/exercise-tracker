const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  count: Number,
  log: [Object],
});

module.exports = mongoose.model("User", userSchema);
