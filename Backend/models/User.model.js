const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["user", "lawyer", "admin"],
    default: "user"
  },
  salt: {
    type: String,
    required: true,
  }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
module.exports = process.env.ND_LOCAL_MODE === "sqlite" ? require("./localStore")(User) : User;
