import React from 'react';
import { useSelector } from 'react-redux';
import './CapturedPieces.css';

const CapturedPieces = () => {
  const { capturedPieces } = useSelector(state => state.game);

  const getPieceSymbol = (type, color) => {
    const symbols = {
      king: { white: '♔', black: '♚' },
      queen: { white: '♕', black: '♛' },
      rook: { white: '♖', black: '♜' },
      bishop: { white: '♗', black: '♝' },
      knight: { white: '♘', black: '♞' },
      pawn: { white: '♙', black: '♟' }
    };
    
    return symbols[type][color];
  };

  const renderCapturedPieces = (pieces) => {
    if (pieces.length === 0) {
      return <div className="no-captures">No captures</div>;
    }

    const pieceCounts = pieces.reduce((acc, piece) => {
      const key = `${piece.type}-${piece.color}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return (
      <div className="captured-pieces-list">
        {Object.entries(pieceCounts).map(([key, count]) => {
          const [type, pieceColor] = key.split('-');
          return (
            <div key={key} className="captured-piece">
              <span className="piece-symbol">{getPieceSymbol(type, pieceColor)}</span>
              {count > 1 && <span className="piece-count">×{count}</span>}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="captured-pieces-container">
      <div className="captured-section">
        <h4>Black Captures</h4>
        <div className="captured-pieces black-captures">
          {renderCapturedPieces(capturedPieces.black)}
        </div>
      </div>
      
      <div className="captured-section">
        <h4>White Captures</h4>
        <div className="captured-pieces white-captures">
          {renderCapturedPieces(capturedPieces.white)}
        </div>
      </div>
    </div>
  );
};

export default CapturedPieces;