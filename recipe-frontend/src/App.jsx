import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RecipeList from './components/RecipeList';
import RecipeDetail from './components/RecipeDetail';

const App = () => {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3000/api/recipes')
      .then(res => setRecipes(res.data))
      .catch(err => console.error('Error fetching recipes:', err));
  }, []);

  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleBackToList = () => {
    setSelectedRecipe(null);
  };

  return (
    <div className="min-h-screen bg-black text-beige">
      <header className="bg-grey text-beige p-6 text-center">
        <h1 className="text-3xl font-bold">The Flavor Code</h1>
      </header>
      <div className="container mx-auto p-6">
        {selectedRecipe ? (
          <div>
            <button 
              onClick={handleBackToList} 
              className="mb-4 text-black bg-darkbeige px-4 py-2 rounded hover:bg-beige transition"
            >
              Back to Recipe List
            </button>
            <RecipeDetail recipe={selectedRecipe} />
          </div>
        ) : (
          <RecipeList recipes={recipes} onRecipeClick={handleRecipeClick} />
        )}
      </div>
    </div>
  );
};

export default App;
