import React from 'react';
import { useDispatch } from 'react-redux';
import { resetGame, undoMove } from '../app/store';
import { resetTimers } from '../app/store';
import './GameControls.css';

const GameControls = () => {
  const dispatch = useDispatch();

  const handleReset = () => {
    dispatch(resetGame());
    dispatch(resetTimers());
  };

  const handleUndo = () => {
    dispatch(undoMove());
  };

  return (
    <div className="game-controls">
      <button className="control-btn reset-btn" onClick={handleReset}>
        New Game
      </button>
      <button className="control-btn undo-btn" onClick={handleUndo}>
        Undo Move
      </button>
    </div>
  );
};

export default GameControls;