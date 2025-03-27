const express = require("express");
const router = express.Router();
const Recipe = require("../schema/recipe"); // Use Mongoose model
const { ObjectId } = require("mongodb");

// GET all recipes
router.get("/recipes", async (req, res) => {
  try {
    const recipes = await Recipe.find(); // Use Mongoose model
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

    const recipe = await Recipe.findById(req.params.id); // Use Mongoose
    if (!recipe) return res.status(404).json({ error: "Recipe not found!" });

    res.json(recipe);
  } catch (error) {
    console.error("Error retrieving recipe:", error);
    res.status(500).json({ error: "Error retrieving recipe" });
  }
});

// Search recipes by name
router.get("/search/:query", async (req, res) => {
  try {
      const recipes = await Recipe.find({ name: { $regex: req.params.query, $options: "i" } });
      res.json(recipes);
  } catch (error) {
      res.status(500).json({ error: "Server error" });
  }
});


// Get recipes by category
router.get("/category/:category", async (req, res) => {
  try {
      const recipes = await Recipe.find({ category: { $regex: req.params.category, $options: "i" } });
      res.json(recipes);
  } catch (error) {
      res.status(500).json({ error: "Server error" });
  }
});

router.get("/recipes/favorites", async (req, res) => {
  try {
    const favoriteRecipes = await Recipe.find({ favorite: "true" }); // Check for string "true"
    res.json(favoriteRecipes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch favorite recipes" });
  }
});

router.get("/recipes/paginate", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Default to page 1, 10 results per page
    const recipes = await Recipe.find()
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch paginated recipes" });
  }
});

router.get("/recipes/popular-ingredients", async (req, res) => {
  try {
    const ingredients = await Recipe.aggregate([
      { $unwind: "$ingredients" },
      { $group: { _id: "$ingredients", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json(ingredients);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch popular ingredients" });
  }
});

router.get("/recipes/ingredients", async (req, res) => {
  try {
    const { ingredients } = req.query;
    if (!ingredients) {
      return res.status(400).json({ error: "Ingredients query parameter is required" });
    }

    const ingredientArray = ingredients.split(",");
    const recipes = await Recipe.find({ ingredients: { $all: ingredientArray } });

    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recipes by ingredients" });
  }
});

router.get("/recipes/recent/:days", async (req, res) => {
  try {
    const { days } = req.params;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));

    const recipes = await Recipe.find({ createdAt: { $gte: cutoffDate } });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recent recipes" });
  }
});



// POST a new recipe
router.post("/recipes", async (req, res) => {
  try {
    const newRecipe = new Recipe(req.body); // Use Mongoose model
    const savedRecipe = await newRecipe.save();
    res.status(201).json(savedRecipe);
  } catch (error) {
    console.error("Error adding recipe:", error);
    res.status(500).json({ error: "Failed to add recipe" });
  }
});

router.post("/recipes/:id/review", async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid recipe ID format" });
    }

    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    if (!recipe.reviews) recipe.reviews = [];
    recipe.reviews.push({ rating, comment, date: new Date() });
    
    await recipe.save();
    res.json({ message: "Review added successfully", recipe });
  } catch (error) {
    res.status(500).json({ error: "Failed to add review" });
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

router.patch("/:id/favorite", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });

    recipe.favorite = recipe.favorite === "true" ? "false" : "true"; // Convert boolean logic to string
    await recipe.save();

    res.json({ message: `Recipe marked as favorite: ${recipe.favorite}`, recipe });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
