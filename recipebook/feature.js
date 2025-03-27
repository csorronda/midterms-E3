// ========================== Recipe Book API Features ==========================

// 1. RESTful API using Node.js, Express.js, and MongoDB.

// 2. CRUD Operations:
//    - Create: Add a new recipe (POST /recipes)
//    - Read: Get all recipes (GET /recipes) or a single recipe by ID (GET /recipes/:id)
//    - Update: Modify an existing recipe (PUT /recipes/:id)
//    - Delete: Remove a recipe from the database (DELETE /recipes/:id)

// 3. Uses MongoDB Atlas for cloud-based database storage.

// 4. Middleware: Express.js is used to handle JSON request bodies.

// 5. Database Connection:
//    - Connects to MongoDB using MongoClient.
//    - Uses async/await for non-blocking database operations.

// 6. Input Validation:
//    - Ensures valid MongoDB ObjectId before querying, updating, or deleting recipes.
//    - Checks for required fields (name, ingredients, instructions) before inserting a recipe.

// 7. Error Handling:
//    - Returns appropriate HTTP status codes (400 for bad requests, 404 for not found, 500 for server errors).
//    - Catches and handles errors in database operations.

// 8. Simple Home Route:
//    - Provides a welcome message on the root endpoint (GET /).

// 9. Server runs locally on port 3000.
