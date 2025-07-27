// Chess game logic and utilities

// Initial board setup
export const initialBoard = () => {
  const board = Array(8).fill(null).map(() => Array(8).fill(null));
  
  // Set up pawns
  for (let i = 0; i < 8; i++) {
    board[1][i] = { type: 'pawn', color: 'black', hasMoved: false };
    board[6][i] = { type: 'pawn', color: 'white', hasMoved: false };
  }
  
  // Set up other pieces
  const pieces = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
  for (let i = 0; i < 8; i++) {
    board[0][i] = { type: pieces[i], color: 'black', hasMoved: false };
    board[7][i] = { type: pieces[i], color: 'white', hasMoved: false };
  }
  
  return board;
};

// Convert coordinates to chess notation
export const toChessNotation = (row, col) => {
  const files = 'abcdefgh';
  const ranks = '87654321';
  return files[col] + ranks[row];
};

// Convert chess notation to coordinates
export const fromChessNotation = (notation) => {
  const files = 'abcdefgh';
  const ranks = '87654321';
  const file = notation[0];
  const rank = notation[1];
  return { row: ranks.indexOf(rank), col: files.indexOf(file) };
};

// Get basic moves for a piece (without check validation)
const getBasicMoves = (board, row, col, includeCastling = true) => {
  const piece = board[row][col];
  if (!piece) return [];
  
  const moves = [];
  
  switch (piece.type) {
    case 'pawn':
      moves.push(...getPawnMoves(board, row, col, piece.color));
      break;
    case 'rook':
      moves.push(...getRookMoves(board, row, col, piece.color));
      break;
    case 'knight':
      moves.push(...getKnightMoves(board, row, col, piece.color));
      break;
    case 'bishop':
      moves.push(...getBishopMoves(board, row, col, piece.color));
      break;
    case 'queen':
      moves.push(...getQueenMoves(board, row, col, piece.color));
      break;
    case 'king':
      moves.push(...getKingMoves(board, row, col, piece.color, includeCastling));
      break;
  }
  
  return moves;
};

// Get all legal moves for a piece
export const getLegalMoves = (board, row, col) => {
  const piece = board[row][col];
  if (!piece) return [];
  
  const basicMoves = getBasicMoves(board, row, col);
  
  // Filter out moves that would put own king in check
  return basicMoves.filter(move => !wouldBeInCheck(board, row, col, move.row, move.col, piece.color));
};

// Pawn move logic
const getPawnMoves = (board, row, col, color) => {
  const moves = [];
  const direction = color === 'white' ? -1 : 1;
  const startRow = color === 'white' ? 6 : 1;
  
  // Forward move
  if (row + direction >= 0 && row + direction < 8 && !board[row + direction][col]) {
    moves.push({ row: row + direction, col });
    
    // Double move from starting position
    if (row === startRow && row + 2 * direction >= 0 && row + 2 * direction < 8 && !board[row + 2 * direction][col]) {
      moves.push({ row: row + 2 * direction, col });
    }
  }
  
  // Diagonal captures
  for (const colOffset of [-1, 1]) {
    const newCol = col + colOffset;
    if (newCol >= 0 && newCol < 8 && row + direction >= 0 && row + direction < 8) {
      const targetPiece = board[row + direction][newCol];
      if (targetPiece && targetPiece.color !== color) {
        moves.push({ row: row + direction, col: newCol });
      }
    }
  }
  
  return moves;
};

// Rook move logic
const getRookMoves = (board, row, col, color) => {
  const moves = [];
  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  
  for (const [dRow, dCol] of directions) {
    let newRow = row + dRow;
    let newCol = col + dCol;
    
    while (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
      const targetPiece = board[newRow][newCol];
      if (!targetPiece) {
        moves.push({ row: newRow, col: newCol });
      } else {
        if (targetPiece.color !== color) {
          moves.push({ row: newRow, col: newCol });
        }
        break;
      }
      newRow += dRow;
      newCol += dCol;
    }
  }
  
  return moves;
};

// Knight move logic
const getKnightMoves = (board, row, col, color) => {
  const moves = [];
  const knightMoves = [
    [-2, -1], [-2, 1], [-1, -2], [-1, 2],
    [1, -2], [1, 2], [2, -1], [2, 1]
  ];
  
  for (const [dRow, dCol] of knightMoves) {
    const newRow = row + dRow;
    const newCol = col + dCol;
    
    if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
      const targetPiece = board[newRow][newCol];
      if (!targetPiece || targetPiece.color !== color) {
        moves.push({ row: newRow, col: newCol });
      }
    }
  }
  
  return moves;
};

// Bishop move logic
const getBishopMoves = (board, row, col, color) => {
  const moves = [];
  const directions = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
  
  for (const [dRow, dCol] of directions) {
    let newRow = row + dRow;
    let newCol = col + dCol;
    
    while (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
      const targetPiece = board[newRow][newCol];
      if (!targetPiece) {
        moves.push({ row: newRow, col: newCol });
      } else {
        if (targetPiece.color !== color) {
          moves.push({ row: newRow, col: newCol });
        }
        break;
      }
      newRow += dRow;
      newCol += dCol;
    }
  }
  
  return moves;
};

// Queen move logic (combination of rook and bishop)
const getQueenMoves = (board, row, col, color) => {
  return [...getRookMoves(board, row, col, color), ...getBishopMoves(board, row, col, color)];
};

// King move logic
const getKingMoves = (board, row, col, color, includeCastling = true) => {
  const moves = [];
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], [0, 1],
    [1, -1], [1, 0], [1, 1]
  ];
  
  for (const [dRow, dCol] of directions) {
    const newRow = row + dRow;
    const newCol = col + dCol;
    
    if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
      const targetPiece = board[newRow][newCol];
      if (!targetPiece || targetPiece.color !== color) {
        moves.push({ row: newRow, col: newCol });
      }
    }
  }
  
  // Add castling moves if allowed
  if (includeCastling) {
    const castlingMoves = getCastlingMoves(board, row, col, color);
    moves.push(...castlingMoves);
  }
  
  return moves;
};

// Check if castling is possible
const getCastlingMoves = (board, row, col, color) => {
  const moves = [];
  const king = board[row][col];
  
  // King must not have moved
  if (king.hasMoved) return moves;
  
  // King must not be in check
  if (isInCheck(board, color)) return moves;
  
  // Check kingside castling (short castle)
  const kingsideRook = board[row][7];
  if (kingsideRook && kingsideRook.type === 'rook' && kingsideRook.color === color && !kingsideRook.hasMoved) {
    // Check if squares between king and rook are empty
    if (!board[row][5] && !board[row][6]) {
      // Check if king would not be in check after moving
      if (!wouldBeInCheck(board, row, col, row, 5, color) && !wouldBeInCheck(board, row, col, row, 6, color)) {
        moves.push({ row: row, col: 6, isCastling: true, castlingType: 'kingside' });
      }
    }
  }
  
  // Check queenside castling (long castle)
  const queensideRook = board[row][0];
  if (queensideRook && queensideRook.type === 'rook' && queensideRook.color === color && !queensideRook.hasMoved) {
    // Check if squares between king and rook are empty
    if (!board[row][1] && !board[row][2] && !board[row][3]) {
      // Check if king would not be in check after moving
      if (!wouldBeInCheck(board, row, col, row, 2, color) && !wouldBeInCheck(board, row, col, row, 3, color)) {
        moves.push({ row: row, col: 2, isCastling: true, castlingType: 'queenside' });
      }
    }
  }
  
  return moves;
};

// Check if a move would put the king in check
const wouldBeInCheck = (board, fromRow, fromCol, toRow, toCol, color) => {
  const newBoard = board.map(row => row.map(cell => cell ? { ...cell } : null));
  newBoard[toRow][toCol] = newBoard[fromRow][fromCol];
  newBoard[fromRow][fromCol] = null;
  
  return isInCheck(newBoard, color);
};

// Check if a king is in check
export const isInCheck = (board, color) => {
  // Find the king
  let kingRow, kingCol;
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.type === 'king' && piece.color === color) {
        kingRow = row;
        kingCol = col;
        break;
      }
    }
  }
  
  // Check if any opponent piece can attack the king
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color !== color) {
        // Disable castling checks when checking for attacks to prevent recursion
        const moves = getBasicMoves(board, row, col, false);
        if (moves.some(move => move.row === kingRow && move.col === kingCol)) {
          return true;
        }
      }
    }
  }
  
  return false;
};

// Check if a king is in checkmate
export const isCheckmate = (board, color) => {
  if (!isInCheck(board, color)) return false;
  
  // Check if any legal move can get out of check
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === color) {
        const basicMoves = getBasicMoves(board, row, col);
        // Check if any basic move can get out of check
        const legalMoves = basicMoves.filter(move => !wouldBeInCheck(board, row, col, move.row, move.col, color));
        if (legalMoves.length > 0) {
          return false;
        }
      }
    }
  }
  
  return true;
};

// Convert move to chess notation
export const moveToNotation = (board, fromRow, fromCol, toRow, toCol, isCheck, isCheckmate, piece = null, isCastling = false, castlingType = null) => {
  // If piece is not provided, try to get it from the board (for backward compatibility)
  const movingPiece = piece || board[fromRow][fromCol];
  const targetPiece = board[toRow][toCol];
  const fromSquare = toChessNotation(fromRow, fromCol);
  const toSquare = toChessNotation(toRow, toCol);
  
  let notation = '';
  
  // Handle castling notation
  if (isCastling && movingPiece.type === 'king') {
    if (castlingType === 'kingside') {
      notation = 'O-O';
    } else if (castlingType === 'queenside') {
      notation = 'O-O-O';
    }
  } else {
    // Add piece symbol (except for pawns)
    if (movingPiece.type !== 'pawn') {
      const pieceSymbols = { king: 'K', queen: 'Q', rook: 'R', bishop: 'B', knight: 'N' };
      notation += pieceSymbols[movingPiece.type];
    }
    
    // Add capture symbol
    if (targetPiece) {
      if (movingPiece.type === 'pawn') {
        notation += fromSquare[0] + 'x';
      } else {
        notation += 'x';
      }
    }
    
    notation += toSquare;
  }
  
  // Add check/checkmate symbols
  if (isCheckmate) {
    notation += '#';
  } else if (isCheck) {
    notation += '+';
  }
  
  return notation;
};

// Make a move on the board
export const makeMove = (board, fromRow, fromCol, toRow, toCol, isCastling = false, castlingType = null) => {
  const newBoard = board.map(row => row.map(cell => cell ? { ...cell } : null));
  const piece = newBoard[fromRow][fromCol];
  
  // Mark piece as moved
  piece.hasMoved = true;
  
  // Handle pawn promotion
  if (piece.type === 'pawn' && (toRow === 0 || toRow === 7)) {
    piece.type = 'queen';
  }
  
  newBoard[toRow][toCol] = piece;
  newBoard[fromRow][fromCol] = null;
  
  // Handle castling
  if (isCastling && piece.type === 'king') {
    if (castlingType === 'kingside') {
      // Move rook from h1/h8 to f1/f8
      const rook = newBoard[fromRow][7];
      if (rook && rook.type === 'rook') {
        rook.hasMoved = true;
        newBoard[fromRow][5] = rook; // f1/f8
        newBoard[fromRow][7] = null; // h1/h8
      }
    } else if (castlingType === 'queenside') {
      // Move rook from a1/a8 to d1/d8
      const rook = newBoard[fromRow][0];
      if (rook && rook.type === 'rook') {
        rook.hasMoved = true;
        newBoard[fromRow][3] = rook; // d1/d8
        newBoard[fromRow][0] = null; // a1/a8
      }
    }
  }
  
  return newBoard;
};