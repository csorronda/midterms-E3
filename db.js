const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://csorronda:csorronda1@recipebook.ivvm9.mongodb.net/recipeBook?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("Could not connect to MongoDB", err));

module.exports = mongoose;
