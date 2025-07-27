import React from 'react';
import { useSelector } from 'react-redux';
import ChessBoard from './components/ChessBoard';
import Timer from './components/Timer';
import MoveList from './components/MoveList';
import GameControls from './components/GameControls';
import CapturedPieces from './components/CapturedPieces';
import './App.css';

const App = () => {
  const { currentPlayer, gameOver, winner } = useSelector(state => state.game);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Chess Game</h1>
        <div className="game-status">
          {gameOver ? (
            <div className="game-over">
              Game Over! {winner === 'white' ? 'White' : 'Black'} wins!
            </div>
          ) : (
            <div className="current-player">
              Current Player: <span className={`player ${currentPlayer}`}>
                {currentPlayer === 'white' ? 'White' : 'Black'}
              </span>
            </div>
          )}
        </div>
      </header>

      <main className="game-container">
        <div className="game-left-panel">
          <Timer />
          <CapturedPieces />
        </div>

        <div className="game-center">
          <ChessBoard />
          <GameControls />
        </div>

        <div className="game-right-panel">
          <MoveList />
        </div>
      </main>
    </div>
  );
};

export default App;
