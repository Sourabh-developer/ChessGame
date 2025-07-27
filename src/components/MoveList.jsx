import React from 'react';
import { useSelector } from 'react-redux';
import './MoveList.css';

const MoveList = () => {
  const { moveHistory } = useSelector(state => state.game);

  const renderMove = (move, index) => {
    const moveNumber = Math.floor(index / 2) + 1;
    const isWhiteMove = index % 2 === 0;
    
    return (
      <div key={index} className="move-entry">
        {isWhiteMove && (
          <span className="move-number">{moveNumber}.</span>
        )}
        <span className={`move-notation ${move.isCheckmate ? 'checkmate' : ''} ${move.isCheck ? 'check' : ''}`}>
          {move.notation}
        </span>
      </div>
    );
  };

  return (
    <div className="move-list-container">
      <h3>Move History</h3>
      <div className="move-list">
        {moveHistory.length === 0 ? (
          <div className="no-moves">No moves yet</div>
        ) : (
          moveHistory.map((move, index) => renderMove(move, index))
        )}
      </div>
    </div>
  );
};

export default MoveList;