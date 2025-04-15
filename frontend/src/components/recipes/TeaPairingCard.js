// frontend/src/components/recipes/TeaPairingCard.js
import React from 'react';
import './RecipeCards.css';

const TeaPairingCard = ({ pairing }) => {
  return (
    <div className="recipe-card pairing-card">
      <div className="recipe-image">
        <img src={pairing.image} alt={pairing.title} />
        <div className="pairing-badge">Food Pairings</div>
      </div>
      <div className="recipe-content">
        <h3 className="recipe-title">{pairing.title}</h3>
        <div className="pairing-items">
          {pairing.items.map((item, index) => (
            <div key={index} className="pairing-item">
              <span className="pairing-icon">🍽️</span> {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeaPairingCard;