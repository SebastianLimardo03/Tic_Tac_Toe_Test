/* eslint-disable no-use-before-define */
let gameBoard = ["", "", "", "", "", "", "", "", ""];
const gameBoardElement = document.querySelector(".js-board-container");

let computerPiece, playerPiece;

function renderGameBoard() {
    gameBoardElement.innerHTML = "";
    gameBoard.forEach((move, index) => {
        const boardElement = document.createElement('div');
        boardElement.classList.add('board-element');
        
        const greySquare = document.createElement('img');
        greySquare.classList.add('grey-square');
        greySquare.alt = "Grey Square";
        greySquare.src = "images/grey-square.png";
        greySquare.addEventListener("click", () => {
            if (gameStatus.innerHTML === "Your move" && !gameBoard[index]) {
                gameBoard.splice(index, 1, playerPiece);
                renderGameBoard();

                const status = checkGameStatus();

                if (!status) playComputerMove();
            }
        });

        boardElement.appendChild(greySquare);

        if (move === "x" || move === "o") {
            const moveIcon = document.createElement('div');
            moveIcon.classList.add('move');
            const iconImage = document.createElement('img');
            iconImage.classList.add('move-icon');
            iconImage.alt = move.toUpperCase();
            iconImage.src = `images/${move}.png`;
            moveIcon.appendChild(iconImage);
            boardElement.appendChild(moveIcon);
        }

        gameBoardElement.appendChild(boardElement);
    });
}

function pickRandomMove() {
    const filteredGameBoard = gameBoard
        .map((move, index) => ({
            move,
            index,
        }))
        .filter((move) => !move.move);

    return filteredGameBoard[Math.floor(Math.random() * filteredGameBoard.length)]
        .index;
}

function pickBestMove() {
    let bestMove;

    gameBoard.forEach((move, index) => {
        if (
            !move &&
            // Horizontal row check.
            ((index % 3 === 0 &&
                gameBoard[index + 1] === computerPiece &&
                gameBoard[index + 2] === computerPiece) ||
                (index % 3 === 1 &&
                    gameBoard[index - 1] === computerPiece &&
                    gameBoard[index + 1] === computerPiece) ||
                (index % 3 === 2 &&
                    gameBoard[index - 2] === computerPiece &&
                    gameBoard[index - 1] === computerPiece) ||
                // Vertical row check.
                (index < 3 &&
                    gameBoard[index + 3] === computerPiece &&
                    gameBoard[index + 6] === computerPiece) ||
                (index > 2 &&
                    index < 6 &&
                    gameBoard[index - 3] === computerPiece &&
                    gameBoard[index + 3] === computerPiece) ||
                (index > 5 &&
                    gameBoard[index - 6] === computerPiece &&
                    gameBoard[index - 3] === computerPiece) ||
                // Diagonal up to down check.
                (index === 0 &&
                    gameBoard[4] === computerPiece &&
                    gameBoard[8] === computerPiece) ||
                (gameBoard[0] === computerPiece &&
                    index === 4 &&
                    gameBoard[8] === computerPiece) ||
                (gameBoard[0] === computerPiece &&
                    gameBoard[4] === computerPiece &&
                    index === 8) ||
                // Diagonal down to up check.
                (index === 2 &&
                    gameBoard[4] === computerPiece &&
                    gameBoard[6] === computerPiece) ||
                (gameBoard[2] === computerPiece &&
                    index === 4 &&
                    gameBoard[6] === computerPiece) ||
                (gameBoard[2] === computerPiece &&
                    gameBoard[4] === computerPiece &&
                    index === 6))
        ) {
            bestMove = index;
        }
    });

    if (!bestMove) {
        gameBoard.forEach((move, index) => {
            if (
                !move &&
                // Horizontal row check.
                ((index % 3 === 0 &&
                    gameBoard[index + 1] === playerPiece &&
                    gameBoard[index + 2] === playerPiece) ||
                    (index % 3 === 1 &&
                        gameBoard[index - 1] === playerPiece &&
                        gameBoard[index + 1] === playerPiece) ||
                    (index % 3 === 2 &&
                        gameBoard[index - 2] === playerPiece &&
                        gameBoard[index - 1] === playerPiece) ||
                    // Vertical row check.
                    (index < 3 &&
                        gameBoard[index + 3] === playerPiece &&
                        gameBoard[index + 6] === playerPiece) ||
                    (index > 2 &&
                        index < 6 &&
                        gameBoard[index - 3] === playerPiece &&
                        gameBoard[index + 3] === playerPiece) ||
                    (index > 5 &&
                        gameBoard[index - 6] === playerPiece &&
                        gameBoard[index - 3] === playerPiece) ||
                    // Diagonal up to down check.
                    (index === 0 &&
                        gameBoard[4] === playerPiece &&
                        gameBoard[8] === playerPiece) ||
                    (gameBoard[0] === playerPiece &&
                        index === 4 &&
                        gameBoard[8] === playerPiece) ||
                    (gameBoard[0] === playerPiece &&
                        gameBoard[4] === playerPiece &&
                        index === 8) ||
                    // Diagonal down to up check.
                    (index === 2 &&
                        gameBoard[4] === playerPiece &&
                        gameBoard[6] === playerPiece) ||
                    (gameBoard[2] === playerPiece &&
                        index === 4 &&
                        gameBoard[6] === playerPiece) ||
                    (gameBoard[2] === playerPiece &&
                        gameBoard[4] === playerPiece &&
                        index === 6))
            ) {
                bestMove = index;
            }
        });
    }

    if (!bestMove && !gameBoard[4]) bestMove = 4;

    if (!bestMove) {
        if (!gameBoard[0]) bestMove = 0;
        if (!gameBoard[2] && gameBoard[5] !== playerPiece) bestMove = 2;
        if (!gameBoard[6] && gameBoard[7] !== playerPiece) bestMove = 6;
        if (!gameBoard[8]) bestMove = 8;
    }

    return bestMove ?? pickRandomMove();
}

function playMove(index, move) {
    gameBoard[index] = move;
    renderGameBoard();
}

const gameStatus = document.querySelector(".js-game-status");

const difficultySelectionElement = document.querySelector(".js-difficult-selector");

let difficultySelection;

if (difficultySelectionElement instanceof HTMLSelectElement) {
    difficultySelection = difficultySelectionElement;
} else {
    console.error("Element with class 'js-difficult-selector' is not an HTMLSelectElement.");
    // Handle the error or fallback gracefully
}


function playComputerMove() {
    gameStatus.innerHTML = "Computer's move";

    setTimeout(() => {
        const moveIndex =
            difficultySelection.value === "Easy" ||
            (difficultySelection.value === "Medium" && Math.random() > 0.5)
                ? pickRandomMove()
                : pickBestMove();
        playMove(moveIndex, computerPiece);

        const status = checkGameStatus();

        if (!status) gameStatus.innerHTML = "Your move";
    }, Math.random() * 1000 + 1000);
}

const startGameButton = document.querySelector(".js-start-game-button");

function checkGameStatus() {
    let status;

    gameBoard.forEach((move, index) => {
        if (
            move &&
            ((index % 3 === 0 &&
                gameBoard[index + 1] === move &&
                gameBoard[index + 2] === move) ||
                (gameBoard[index + 3] === move && gameBoard[index + 6] === move) ||
                (move === gameBoard[0] &&
                    move === gameBoard[4] &&
                    move === gameBoard[8]) ||
                (move === gameBoard[2] &&
                    move === gameBoard[4] &&
                    move === gameBoard[6]))
        ) {
            status = `${move === playerPiece ? "You win!" : "You lose!"}`;
        }
    });

    if (!status && !gameBoard.includes("")) status = "Tie";

    if (status) {
        startGameButton.innerHTML = "Reset Game";
        gameStatus.innerHTML = status;
    }

    return status;
}

startGameButton.addEventListener("click", () => {
    if (startGameButton.innerHTML === "End Game" || startGameButton.innerHTML === "Reset Game") {
        gameBoard = ["", "", "", "", "", "", "", "", ""];
        renderGameBoard();

        startGameButton.classList.remove("end-game-button", "js-end-game-button");
        startGameButton.classList.add("start-game-button", "js-start-game-button");

        startGameButton.innerHTML = "Start Game";
        gameStatus.innerHTML = "";
    } else if (!gameStatus.innerHTML && difficultySelection.value !== "Select Difficulty") {
        startGameButton.classList.remove("start-game-button", "js-start-game-button");
        startGameButton.classList.add("end-game-button", "js-end-game-button");

        startGameButton.innerHTML = "End Game";

        gameBoard = ["", "", "", "", "", "", "", "", ""];
        renderGameBoard();

        const firstMove = Math.random() > 0.5 ? "player" : "computer";

        computerPiece = firstMove === "computer" ? "x" : "o";
        playerPiece = firstMove === "player" ? "x" : "o";

        if (firstMove === "computer") {
            playComputerMove();
        } else {
            gameStatus.innerHTML = "Your move";
        }
    }
});
