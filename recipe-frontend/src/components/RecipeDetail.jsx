import React from 'react';

const RecipeDetail = ({ recipe }) => {
  return (
    <div className="recipe-detail p-6 text-beige bg-grey rounded shadow-custom">
      <h2 className="text-3xl font-bold mb-4">{recipe.name}</h2>
      <p className="text-lg mb-4"><strong>Ingredients:</strong> {recipe.ingredients?.join(', ') || 'N/A'}</p>
      <p className="text-lg"><strong>Instructions:</strong></p>
      <ol className="list-decimal list-inside text-sm text-darkbeige">
        {recipe.instructions?.map((step, idx) => (
          <li key={idx}>{step}</li>
        ))}
      </ol>
    </div>
  );
};

export default RecipeDetail;
