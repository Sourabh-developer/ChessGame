import React from 'react';
import './ChessPiece.css';

const ChessPiece = ({ type, color, isSelected }) => {
  const getImageSrc = () => {
  const typeMap = {
    king: 'K',
    queen: 'Q',
    rook: 'R',
    bishop: 'B',
    knight: 'N',
    pawn: 'P'
  };

  const pieceCode = color[0] + typeMap[type];
  return `/assets/pieces/cburnett/${pieceCode}.svg`;
};


  return (
    <div className={`chess-piece ${color} ${isSelected ? 'selected' : ''}`}>
      <img src={getImageSrc()} alt={`${color} ${type}`} className="piece-img" />
    </div>
  );
};

export default ChessPiece;
