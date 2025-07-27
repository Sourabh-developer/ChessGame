import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { tick, switchPlayer } from '../app/store';
import './Timer.css';

const Timer = () => {
  const dispatch = useDispatch();
  const { whiteTime, blackTime, isWhiteActive, isPaused } = useSelector(state => state.timer);
  const { currentPlayer, gameOver } = useSelector(state => state.game);

  // Timer effect
  useEffect(() => {
    if (gameOver || isPaused) return;

    const interval = setInterval(() => {
      dispatch(tick());
    }, 1000);

    return () => clearInterval(interval);
  }, [dispatch, gameOver, isPaused]);

  // Switch active timer when player changes
  useEffect(() => {
    if (currentPlayer === 'white' && !isWhiteActive) {
      dispatch(switchPlayer());
    } else if (currentPlayer === 'black' && isWhiteActive) {
      dispatch(switchPlayer());
    }
  }, [currentPlayer, isWhiteActive, dispatch]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTimerClass = (isActive, time) => {
    let className = 'timer';
    if (isActive) className += ' active';
    if (time <= 30) className += ' low-time';
    if (time <= 10) className += ' critical';
    return className;
  };

  return (
    <div className="timer-container">
      <div className="timer-wrapper">
        <div className="player-label">Black</div>
        <div className={getTimerClass(!isWhiteActive, blackTime)}>
          {formatTime(blackTime)}
        </div>
      </div>
      
      <div className="timer-divider">vs</div>
      
      <div className="timer-wrapper">
        <div className="player-label">White</div>
        <div className={getTimerClass(isWhiteActive, whiteTime)}>
          {formatTime(whiteTime)}
        </div>
      </div>
    </div>
  );
};

export default Timer;