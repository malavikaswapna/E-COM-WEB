// frontend/src/components/recipes/RecipeCard.js
import React from 'react';
import './RecipeCard.css';

const RecipeCard = ({ recipe }) => {
  return (
    <div className="recipe-card">
      <div className="recipe-image">
        <img src={recipe.image} alt={recipe.title} />
      </div>
      <div className="recipe-content">
        <h3 className="recipe-title">{recipe.title}</h3>
        <div className="recipe-meta">
          <span className="recipe-time">⏱ {recipe.readyInMinutes} mins</span>
          <span className="recipe-servings">👥 {recipe.servings} servings</span>
        </div>
        <a 
          href={recipe.sourceUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="view-recipe-btn"
        >
          View Recipe
        </a>
      </div>
    </div>
  );
};

export default RecipeCard;