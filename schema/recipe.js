const mongoose = require("mongoose"); 
require("../db"); 

const recipeSchema = new mongoose.Schema({
  name: String,
  category: String,
  ingredients: [String],
  instructions: String,
  favorite: { type: String, default: "false" }, 
  reviews: [{
    rating: Number,
    comment: String,
    date: Date
  }]
}, { timestamps: true });

const Recipe = mongoose.model("Recipe", recipeSchema);
module.exports = Recipe;
