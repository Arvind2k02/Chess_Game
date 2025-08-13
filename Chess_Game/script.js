// Unicode for pieces
const pieces = {
    'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟',
    'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙'
};

// Piece values for scoring
const pieceValue = {
    'p': 1, 'n': 3, 'b': 3, 'r': 5, 'q': 9,
    'P': 1, 'N': 3, 'B': 3, 'R': 5, 'Q': 9
};

let whiteScore = 0, blackScore = 0;
let gameOver = false;
let turn = 'white';

// Initial chess board setup
let boardState = [
    ['r','n','b','q','k','b','n','r'],
    ['p','p','p','p','p','p','p','p'],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['P','P','P','P','P','P','P','P'],
    ['R','N','B','Q','K','B','N','R']
];

let selected = null;
const chessboard = document.getElementById("chessboard");
const whiteScoreDisplay = document.getElementById("whiteScore");
const blackScoreDisplay = document.getElementById("blackScore");

// Render board
function renderBoard() {
    chessboard.innerHTML = '';
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            let square = document.createElement("div");
            square.classList.add("square");
            square.classList.add((row + col) % 2 === 0 ? "light" : "dark");
            square.dataset.row = row;
            square.dataset.col = col;
            let piece = boardState[row][col];
            if (piece) square.textContent = pieces[piece];
            square.addEventListener("click", () => handleSquareClick(row, col));
            chessboard.appendChild(square);
        }
    }
}

// Simple move validation
function isValidMove(start, end) {
    let piece = boardState[start.row][start.col];
    if (!piece) return false;
    let isWhite = piece === piece.toUpperCase();
    if ((turn === 'white' && !isWhite) || (turn === 'black' && isWhite)) return false;

    let targetPiece = boardState[end.row][end.col];
    if (targetPiece && ((isWhite && targetPiece === targetPiece.toUpperCase()) || (!isWhite && targetPiece === targetPiece.toLowerCase()))) {
        return false;
    }
    return true; // simplified rules
}

// Click handling
function handleSquareClick(row, col) {
    if (gameOver) return;
    if (!selected) {
        let piece = boardState[row][col];
        if (!piece) return;
        let isWhite = piece === piece.toUpperCase();
        if ((turn === 'white' && isWhite) || (turn === 'black' && !isWhite)) {
            selected = { row, col };
        }
    } else {
        if (isValidMove(selected, { row, col })) {
            movePiece(selected, { row, col });
            turn = turn === 'white' ? 'black' : 'white';
        }
        selected = null;
    }
    renderBoard();
}

// Move a piece
function movePiece(start, end) {
    let captured = boardState[end.row][end.col];
    if (captured) {
        // Check if king is captured → game over
        if (captured === 'K') {
            alert("Black wins! White's king is captured.");
            gameOver = true;
        } else if (captured === 'k') {
            alert("White wins! Black's king is captured.");
            gameOver = true;
        }
        // Update scores
        if (captured === captured.toUpperCase()) {
            blackScore += pieceValue[captured] || 0;
            blackScoreDisplay.textContent = blackScore;
        } else {
            whiteScore += pieceValue[captured] || 0;
            whiteScoreDisplay.textContent = whiteScore;
        }
    }
    boardState[end.row][end.col] = boardState[start.row][start.col];
    boardState[start.row][start.col] = '';
}

renderBoard();