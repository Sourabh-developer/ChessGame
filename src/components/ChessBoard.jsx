import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectPiece, makeMove, setLegalMoves } from '../app/store';
import { getLegalMoves } from '../chessLogic';
import ChessPiece from './ChessPiece';
import './ChessBoard.css';

const ChessBoard = () => {
  const dispatch = useDispatch();
  const { 
    board, 
    currentPlayer, 
    selectedPiece, 
    legalMoves, 
    isCheck, 
    isCheckmate,
    gameOver 
  } = useSelector(state => state.game);

  const handleSquareClick = (row, col) => {
    if (gameOver) return;

    const piece = board[row][col];
    
    // If a piece is already selected
    if (selectedPiece) {
      const { row: fromRow, col: fromCol } = selectedPiece;
      
      // Check if the clicked square is a legal move
      const legalMove = legalMoves.find(move => move.row === row && move.col === col);
      
      if (legalMove) {
        // Make the move
        const moveData = { 
          fromRow, 
          fromCol, 
          toRow: row, 
          toCol: col 
        };
        
        // Add castling information if it's a castling move
        if (legalMove.isCastling) {
          moveData.isCastling = true;
          moveData.castlingType = legalMove.castlingType;
        }
        
        dispatch(makeMove(moveData));
        return;
      }
      
      // If clicking on a piece of the same color, select it instead
      if (piece && piece.color === currentPlayer) {
        dispatch(selectPiece({ row, col }));
        return;
      }
      
      // Otherwise, deselect
      dispatch(selectPiece(null));
    } else {
      // Select a piece if it belongs to the current player
      if (piece && piece.color === currentPlayer) {
        dispatch(selectPiece({ row, col }));
      }
    }
  };

  // Calculate legal moves when a piece is selected
  useEffect(() => {
    if (selectedPiece) {
      const moves = getLegalMoves(board, selectedPiece.row, selectedPiece.col);
      dispatch(setLegalMoves(moves));
    } else {
      dispatch(setLegalMoves([]));
    }
  }, [selectedPiece, board, dispatch]);

  const isSquareSelected = (row, col) => {
    return selectedPiece && selectedPiece.row === row && selectedPiece.col === col;
  };

  const isLegalMoveSquare = (row, col) => {
    return legalMoves.some(move => move.row === row && move.col === col);
  };

  const isSquareLight = (row, col) => {
    return (row + col) % 2 === 0;
  };

  return (
    <div className="chess-board">
      <div className="board-container">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="board-row">
            {row.map((piece, colIndex) => {
              const isLight = isSquareLight(rowIndex, colIndex);
              const isSelected = isSquareSelected(rowIndex, colIndex);
              const isLegalMove = isLegalMoveSquare(rowIndex, colIndex);
              
              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`board-square ${isLight ? 'light' : 'dark'} ${
                    isSelected ? 'selected' : ''
                  } ${isLegalMove ? 'legal-move' : ''}`}
                  onClick={() => handleSquareClick(rowIndex, colIndex)}
                >
                  {piece && (
                    <ChessPiece 
                      type={piece.type} 
                      color={piece.color} 
                      isSelected={isSelected}
                    />
                  )}
                  {isLegalMove && !piece && <div className="legal-move-indicator" />}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      
      {isCheck && !isCheckmate && (
        <div className="check-indicator">Check!</div>
      )}
      
      {isCheckmate && (
        <div className="checkmate-indicator">
          Checkmate! {currentPlayer === 'white' ? 'Black' : 'White'} wins!
        </div>
      )}
    </div>
  );
};

export default ChessBoard;