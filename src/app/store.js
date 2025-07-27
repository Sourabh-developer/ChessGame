import { configureStore, createSlice } from '@reduxjs/toolkit';
import { initialBoard, makeMove as makeChessMove, isInCheck, isCheckmate, moveToNotation } from '../chessLogic';

// Game state slice
const gameSlice = createSlice({
  name: 'game',
  initialState: {
    board: initialBoard(),
    currentPlayer: 'white',
    selectedPiece: null,
    legalMoves: [],
    isCheck: false,
    isCheckmate: false,
    gameOver: false,
    winner: null,
    moveHistory: [],
    capturedPieces: { white: [], black: [] }
  },
  reducers: {
    selectPiece: (state, action) => {
      const { row, col } = action.payload;
      const piece = state.board[row][col];
      
      if (piece && piece.color === state.currentPlayer) {
        state.selectedPiece = { row, col };
        // Calculate legal moves here
        state.legalMoves = []; // This will be calculated in a thunk
      } else {
        state.selectedPiece = null;
        state.legalMoves = [];
      }
    },
    
    setLegalMoves: (state, action) => {
      state.legalMoves = action.payload;
    },
    
    makeMove: (state, action) => {
      const { fromRow, fromCol, toRow, toCol, isCastling, castlingType } = action.payload;
      const piece = state.board[fromRow][fromCol];
      const targetPiece = state.board[toRow][toCol];
      
      // Handle captured pieces
      if (targetPiece) {
        state.capturedPieces[state.currentPlayer].push(targetPiece);
      }
      
      // Make the move
      state.board = makeChessMove(state.board, fromRow, fromCol, toRow, toCol, isCastling, castlingType);
      
      // Check for check/checkmate
      const opponentColor = state.currentPlayer === 'white' ? 'black' : 'white';
      const isCheck = isInCheck(state.board, opponentColor);
      const isCheckmateResult = isCheckmate(state.board, opponentColor);
      
      state.isCheck = isCheck;
      state.isCheckmate = isCheckmateResult;
      
      if (isCheckmateResult) {
        state.gameOver = true;
        state.winner = state.currentPlayer;
      }
      
      // Add move to history
      const notation = moveToNotation(
        state.board, fromRow, fromCol, toRow, toCol, isCheck, isCheckmateResult, piece, isCastling, castlingType
      );
              state.moveHistory.push({
          from: { row: fromRow, col: fromCol },
          to: { row: toRow, col: toCol },
          piece: piece,
          notation: notation,
          isCheck: isCheck,
          isCheckmate: isCheckmateResult,
          isCastling: isCastling,
          castlingType: castlingType
        });
      
      // Switch players
      state.currentPlayer = opponentColor;
      state.selectedPiece = null;
      state.legalMoves = [];
    },
    
    resetGame: (state) => {
      state.board = initialBoard();
      state.currentPlayer = 'white';
      state.selectedPiece = null;
      state.legalMoves = [];
      state.isCheck = false;
      state.isCheckmate = false;
      state.gameOver = false;
      state.winner = null;
      state.moveHistory = [];
      state.capturedPieces = { white: [], black: [] };
    },
    
    undoMove: (state) => {
      if (state.moveHistory.length > 0) {
        // Remove last move from history
        state.moveHistory.pop();
        
        // Reset game state (this is simplified - in a real implementation you'd need to restore the exact previous state)
        state.board = initialBoard();
        state.currentPlayer = 'white';
        state.selectedPiece = null;
        state.legalMoves = [];
        state.isCheck = false;
        state.isCheckmate = false;
        state.gameOver = false;
        state.winner = null;
        state.capturedPieces = { white: [], black: [] };
        
        // Replay moves except the last one
        state.moveHistory.forEach(move => {
          state.board = makeChessMove(
            state.board, 
            move.from.row, 
            move.from.col, 
            move.to.row, 
            move.to.col
          );
          state.currentPlayer = state.currentPlayer === 'white' ? 'black' : 'white';
        });
      }
    }
  }
});

// Timer slice
const timerSlice = createSlice({
  name: 'timer',
  initialState: {
    whiteTime: 600, // 10 minutes in seconds
    blackTime: 600,
    isWhiteActive: true,
    isPaused: false
  },
  reducers: {
    tick: (state) => {
      if (!state.isPaused) {
        if (state.isWhiteActive) {
          state.whiteTime = Math.max(0, state.whiteTime - 1);
        } else {
          state.blackTime = Math.max(0, state.blackTime - 1);
        }
      }
    },
    
    switchPlayer: (state) => {
      state.isWhiteActive = !state.isWhiteActive;
    },
    
    pauseTimer: (state) => {
      state.isPaused = true;
    },
    
    resumeTimer: (state) => {
      state.isPaused = false;
    },
    
    resetTimers: (state) => {
      state.whiteTime = 600;
      state.blackTime = 600;
      state.isWhiteActive = true;
      state.isPaused = false;
    }
  }
});

export const { 
  selectPiece, 
  setLegalMoves, 
  makeMove, 
  resetGame, 
  undoMove 
} = gameSlice.actions;

export const { 
  tick, 
  switchPlayer, 
  pauseTimer, 
  resumeTimer, 
  resetTimers 
} = timerSlice.actions;

export const store = configureStore({
  reducer: {
    game: gameSlice.reducer,
    timer: timerSlice.reducer
  }
});