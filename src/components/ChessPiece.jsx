import React from 'react';
import './ChessPiece.css';

const ChessPiece = ({ type, color, isSelected }) => {
  const getImageSrc = () => {
    const pieceCode = color[0] + type[0].toUpperCase(); // e.g., wK, bQ
    return `/assets/pieces/cburnett/${pieceCode}.svg`;
  };

  return (
    <div className={`chess-piece ${color} ${isSelected ? 'selected' : ''}`}>
      <img src={getImageSrc()} alt={`${color} ${type}`} className="piece-img" />
    </div>
  );
};

export default ChessPiece;
