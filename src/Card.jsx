import React from 'react';
import './Card.css';

function Card({ data, onClick }) {
  return (
    <div onClick={onClick} className="classic-card">
      <div className="card-shine"></div>
      <div className="card-content">
        <div className="card-icon">{data.split(' ')[0]}</div>
        <h3 className="card-title">{data}</h3>
        <div className="card-arrow">→</div>
      </div>
    </div>
  );
}

export default Card;
