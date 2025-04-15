// frontend/src/components/recipes/TeaRecipeCard.js
import React, { useState } from 'react';
import './RecipeCards.css';

const TeaRecipeCard = ({ recipe }) => {
  const [showDetails, setShowDetails] = useState(false);
  
  return (
    <div className="recipe-card tea-recipe-card">
      <div className="recipe-image">
        <img src={recipe.image} alt={recipe.title} />
        <div className="recipe-badge">Recipe</div>
      </div>
      <div className="recipe-content">
        <h3 className="recipe-title">{recipe.title}</h3>
        <div className="recipe-meta">
          <span className="recipe-time">⏱ {recipe.time}</span>
          <span className="recipe-servings">👥 {recipe.servings} servings</span>
        </div>
        
        <button 
          className="view-recipe-btn"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? 'Hide Details' : 'View Recipe'}
        </button>
        
        {showDetails && (
          <div className="recipe-details">
            <div className="recipe-section">
              <h4>Ingredients:</h4>
              <ul className="ingredients-list">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>
            
            <div className="recipe-section">
              <h4>Instructions:</h4>
              <ol className="instructions-list">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeaRecipeCard;