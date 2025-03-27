const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const PORT = 3000;
const uri = "mongodb+srv://csorronda:csorronda1@recipebook.ivvm9.mongodb.net/recipeBook?retryWrites=true&w=majority";
const client = new MongoClient(uri);

let db; // Declare db variable

app.use(express.json());

async function connectDB() {
    await client.connect();
    db = client.db("recipeBook"); // Initialize db
    console.log("Connected to MongoDB");
}
connectDB(); // Call function to connect to DB

//  Home Route
app.get("/", (req, res) => {
    res.send("Welcome to the Simple Recipe Book API! Use /recipes to see all recipes.");
});

// Get all recipes with pagination and sorting
app.get("/recipes", async (req, res) => {
    try {
        const { page = 1, limit = 10, sortBy = "name", order = "asc" } = req.query;
        const sortOrder = order === "desc" ? -1 : 1;

        const recipes = await db.collection("recipes")
            .find()
            .sort({ [sortBy]: sortOrder })
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .toArray();

        res.json(recipes);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch recipes" });
    }
});

// Get a single recipe by ID
app.get("/recipes/:id", async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Invalid recipe ID format" });
        }

        const recipe = await db.collection("recipes").findOne({ _id: new ObjectId(req.params.id) });
        if (!recipe) return res.status(404).json({ error: "Recipe not found!" });
        
        res.json(recipe);
    } catch (error) {
        res.status(500).json({ error: "Error retrieving recipe" });
    }
});

// Search for recipes by name
app.get("/recipes/search/:query", async (req, res) => {
    try {
        const { query } = req.params;
        const recipes = await db.collection("recipes")
            .find({ name: { $regex: query, $options: "i" } })
            .toArray();

        res.json(recipes);
    } catch (error) {
        res.status(500).json({ error: "Failed to search recipes" });
    }
});

// Get recipes by category
app.get("/recipes/category/:category", async (req, res) => {
    try {
        const { category } = req.params;
        const recipes = await db.collection("recipes")
            .find({ category: { $regex: category, $options: "i" } })
            .toArray();

        res.json(recipes);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch recipes by category" });
    }
});

// Add a new recipe
app.post("/recipes", async (req, res) => {
    try {
        const { name, ingredients, instructions } = req.body;
        if (!name || !ingredients || !instructions) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const newRecipe = { name, ingredients, instructions };
        const result = await db.collection("recipes").insertOne(newRecipe);
        res.status(201).json({ _id: result.insertedId, ...newRecipe });
    } catch (error) {
        res.status(500).json({ error: "Failed to add recipe" });
    }
});

// Edit (Update) a recipe
app.put("/recipes/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, category, ingredients, instructions } = req.body;

        // Validate ObjectId
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid recipe ID format" });
        }

        const updatedRecipe = {
            $set: { name, category, ingredients, instructions }
        };

        const result = await db.collection("recipes").updateOne(
            { _id: new ObjectId(id) },
            updatedRecipe
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "Recipe not found" });
        }

        res.json({ message: "Recipe updated successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to update recipe" });
    }
});

// Delete a recipe 
app.delete("/recipes/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid recipe ID format" });
        }

        const result = await db.collection("recipes").deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Recipe not found" });
        }

        res.json({ message: "Recipe deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete recipe" });
    }
});

// ✅ Mark a recipe as favorite (Toggle)
app.patch("/recipes/:id/favorite", async (req, res) => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid recipe ID format" });
        }

        const recipe = await db.collection("recipes").findOne({ _id: new ObjectId(id) });
        if (!recipe) {
            return res.status(404).json({ error: "Recipe not found" });
        }

        const updatedRecipe = await db.collection("recipes").updateOne(
            { _id: new ObjectId(id) },
            { $set: { favorite: !recipe.favorite } }
        );

        res.json({ message: `Recipe ${recipe.favorite ? "removed from" : "marked as"} favorite` });
    } catch (error) {
        res.status(500).json({ error: "Failed to update favorite status" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Recipe Book API running at http://localhost:${PORT}`);
});
