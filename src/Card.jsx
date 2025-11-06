import React from 'react'
import './App.css'

function Card(props) {
  return (
    <div className="card" onClick={props.onClick} style={{cursor: 'pointer'}}>
      <img className="card-img" src={props.url} alt={props.data} />
      <div className="card-text">{props.data}</div>
    </div>
  );
}

export default Card
