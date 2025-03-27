const mongoose = require("mongoose"); 
require("../db"); 

const recipeSchema = new mongoose.Schema({
  name: String,
  category: String,
  ingredients: [String],
  instructions: String
});

const Recipe = mongoose.model("Recipe", recipeSchema);
module.exports = Recipe;
