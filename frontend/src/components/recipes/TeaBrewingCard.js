// frontend/src/components/recipes/TeaBrewingCard.js
import React from 'react';
import './RecipeCards.css';

const TeaBrewingCard = ({ method }) => {
  return (
    <div className="recipe-card brewing-card">
      <div className="recipe-image">
        <img src={method.image} alt={method.title} />
        <div className="brewing-badge">Brewing Guide</div>
      </div>
      <div className="recipe-content">
        <h3 className="recipe-title">{method.title}</h3>
        <div className="recipe-meta">
          <span className="recipe-time">⏱ {method.time}</span>
          <span className="recipe-temp">🌡️ {method.temp}</span>
        </div>
        <div className="brewing-steps">
          {method.steps.map((step, index) => (
            <p key={index} className="brewing-step">
              <span className="step-number">{index + 1}</span> {step}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeaBrewingCard;