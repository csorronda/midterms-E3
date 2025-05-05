import React, { useState } from 'react';

const RecipeList = ({ recipes }) => {
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);

  const handleButtonClick = (recipeId) => {
    setSelectedRecipeId(prev => (prev === recipeId ? null : recipeId));
  };

  return (
    <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {recipes.map((recipe) => (
        <li key={recipe._id} className="bg-grey rounded shadow-custom overflow-hidden flex flex-col text-beige">
          <img
            src={recipe.image}
            alt={recipe.name}
            className="w-full h-48 object-cover"
          />
          <div className="p-4 flex-1 flex flex-col justify-between">
            <h2 className="text-xl font-semibold mb-2">{recipe.name}</h2>
            <button
              onClick={() => handleButtonClick(recipe._id)}
              className="mt-auto bg-darkbeige text-black text-sm uppercase font-semibold text-center py-2 px-4 rounded hover:bg-beige transition"
            >
              {selectedRecipeId === recipe._id ? 'Hide Recipe Details' : 'View Recipe'}
            </button>

            {selectedRecipeId === recipe._id && (
              <div className="mt-4 text-sm text-darkbeige">
                <p><strong>Category:</strong> {recipe.category || 'N/A'}</p>
                <p><strong>Description:</strong> {recipe.description || 'No description available.'}</p>
                <p><strong>Prep Time:</strong> {recipe.prepTime || 'N/A'}</p>
                <p><strong>Cook Time:</strong> {recipe.cookTime || 'N/A'}</p>
                <p><strong>Ingredients:</strong> {recipe.ingredients?.join(', ') || 'N/A'}</p>

                <strong>Instructions:</strong>
                <ol className="list-decimal list-inside">
                  {recipe.instructions?.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default RecipeList;
