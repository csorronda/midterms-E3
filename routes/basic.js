const express = require("express");
const router = express.Router();
const Recipe = require("../schema/recipe"); // Use Mongoose model
const { ObjectId } = require("mongodb");

// GET all recipes
router.get("/recipes", async (req, res) => {
  try {
    const recipes = await Recipe.find(); // ✅ Use Mongoose model
    res.json(recipes);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
});

// GET a single recipe by ID
router.get("/recipes/:id", async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid recipe ID format" });
    }

    const recipe = await Recipe.findById(req.params.id); // ✅ Use Mongoose
    if (!recipe) return res.status(404).json({ error: "Recipe not found!" });

    res.json(recipe);
  } catch (error) {
    console.error("Error retrieving recipe:", error);
    res.status(500).json({ error: "Error retrieving recipe" });
  }
});

// POST a new recipe
router.post("/recipes", async (req, res) => {
  try {
    const newRecipe = new Recipe(req.body); // ✅ Use Mongoose model
    const savedRecipe = await newRecipe.save();
    res.status(201).json(savedRecipe);
  } catch (error) {
    console.error("Error adding recipe:", error);
    res.status(500).json({ error: "Failed to add recipe" });
  }
});

// PUT (Update) a recipe by ID
router.put("/recipes/:id", async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid recipe ID format" });
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedRecipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    res.json({ message: "Recipe updated successfully", updatedRecipe });
  } catch (error) {
    console.error("Error updating recipe:", error);
    res.status(500).json({ error: "Failed to update recipe" });
  }
});

// DELETE a recipe by ID
router.delete("/recipes/:id", async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid recipe ID format" });
    }

    const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id);

    if (!deletedRecipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    res.json({ message: "Recipe deleted successfully" });
  } catch (error) {
    console.error("Error deleting recipe:", error);
    res.status(500).json({ error: "Failed to delete recipe" });
  }
});

module.exports = router;
