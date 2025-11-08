import React from 'react'
import './App.css'

function Card(props) {
  return (
    <div className="card" onClick={props.onClick} style={{cursor: 'pointer'}}>
     
      <div className="card-text">{props.data}</div>
    </div>
  );
}

export default Card
