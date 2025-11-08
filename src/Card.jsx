import React from 'react';

function Card({ data, onClick }) {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-center h-20 px-20 py-20 text-lg font-semibold text-center text-white transition-all duration-300 shadow-lg cursor-pointer select-none bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-2xl hover:shadow-2xl hover:scale-105"
    >
      {data}
    </div>
  );
}

export default Card;
