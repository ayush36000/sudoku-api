const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: [true, 'Username is required'] },
  email: { type: String, unique: true, required: [true, 'Email is required'] },
  password: { type: String, required: [true, 'Password is required'] },
  token: { type: String },
});

userSchema.plugin(uniqueValidator, {message: 'An account with this {PATH} already exists!'});
module.exports = mongoose.model("sudoku_users", userSchema);
