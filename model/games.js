const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');

const gameSchema = new mongoose.Schema({
  level: {  
    type: Number,
    required: [true, 'Level is required!']
  },
  problem: {
    type: Array,
    required: [true, 'Problem is required'],
    unique: true 
  },
  solution: { type: Array },
});

gameSchema.plugin(uniqueValidator, {message: 'Game with this problem already exists!'});
module.exports = mongoose.model("games", gameSchema);
