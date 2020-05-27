let boardArray = ['', '', '', '', '', '', '', '', ''];
let winArray = [[0, 1, 2], 
                [3, 4, 5], 
                [6, 7, 8], 
                [0, 3, 6], 
                [1, 4, 7], 
                [2, 5, 8], 
                [0, 4, 8], 
                [6, 4, 2]];

// predefined colours and cell sizing
const playerOne = 'O'.fontcolor("#F2EBD3");
const playerTwo = 'X'.fontcolor("#545454");
const playerAi = 'X'.fontcolor("#545454");
const cellSize = 100;

var currentTurn;
var isTwoPlayer;
var boardIsLoaded = false;
var player1Name, player2Name;
var player1Score, player2Score;
var firstGame;
var lowDifficulty = false;

const maximumDepth = 7; // within the alphaBetaMiniMax() search tree
const cellArray = [];
const currentTurnText = document.getElementById('currentTurnText');
const currentGameMode = document.getElementById('gameMode');
const playerInputLayout = document.getElementById('playerInput');
const player1ScoreText = document.getElementById('player-1-score');
const player2ScoreText = document.getElementById('player-2-score');
const alertMessage = document.getElementById("completeMessage");
const alertText = document.getElementById("completeMessageText");

const beginnerBtn = document.getElementById("setBeginner");
const advancedBtn = document.getElementById("setAdvanced");


showMainMenu();

function setDifficulty(){
    beginnerBtn.style.visibility = "visible";
    advancedBtn.style.visibility = "visible";

    hideAlertMessage();
    if (boardIsLoaded) clearBoard();
    document.getElementById("backToMainMenu").style.visibility = "hidden";
    document.getElementById("restartBtn").style.visibility = "hidden";
    document.getElementById("setDifficulty").style.visibility = "hidden";

    currentGameMode.innerText = "Select a Game Mode";
    document.getElementById("menu").style.display = "grid";
    currentTurnText.style.visibility = "hidden";
    document.getElementById("player-1-input").value = '';
    document.getElementById("player-2-input").value = '';
    player1ScoreText.style.visibility = "hidden";
    player2ScoreText.style.visibility = "hidden";

    document.getElementById("menu").style.display = "none";
    document.getElementById("gameMode").style.visibility = "hidden";
}

function hideDifficulties(){
    beginnerBtn.style.visibility = "hidden";
    advancedBtn.style.visibility = "hidden";
}

function setBeginner(){
    lowDifficulty = true;
    startAi();
    hideDifficulties();
}

function setAdvanced() {
    lowDifficulty = false;
    startAi();
    hideDifficulties();
}


function startTwoPlayer(restart){
    player1Name = document.getElementById("player-1-input").value;
    player2Name = document.getElementById("player-2-input").value;
    if (player1Name.length > 0 && player2Name.length > 0) {
        playerInputLayout.style.display = "none";
        if (!restart || firstGame) {
            player1Score = 0;
            player2Score = 0;
            firstGame = false;
        }
        if (!boardIsLoaded || restart) {
            hideMainMenu();
            loadBoard();
            isTwoPlayer = true;
            currentTurn = true;
            document.getElementById("restartBtn").style.visibility = "visible"
            currentTurnText.style.visibility = "visible"
            player1ScoreText.style.visibility = "visible";
            player2ScoreText.style.visibility = "visible";
            player1ScoreText.innerText = `${ player1Score }`;
            player2ScoreText.innerText = `${player2Score}`;
            currentGameMode.innerText = `${player1Name}` + " vs " + `${player2Name}`;
            currentTurnText.innerText = "It is " + `${player1Name}` + "'s turn (O)";
        }
    }
   document.getElementById("setDifficulty").style.visibility = "hidden";
}
function startAi(restart){
    gameFinished = false;
    if (!restart || firstGame) {
        player1Score = 0;
        player2Score = 0;
        firstGame = false;
    }
    if (!boardIsLoaded || restart){   
        hideMainMenu();
        loadBoard()
        isTwoPlayer = false;
        currentTurnText.style.visibility = "visible"
        player1ScoreText.style.visibility = "visible";
        player2ScoreText.style.visibility = "visible";
        player1ScoreText.innerText = `${player1Score}`;
        player2ScoreText.innerText = `${player2Score}`;
        currentGameMode.innerText = "Player vs AI"
        document.getElementById("restartBtn").style.visibility = "visible"
        currentTurnText.innerText = "It is your turn (O)";
        document.getElementById("setDifficulty").style.visibility = "visible";
    }
}
function alphaBetaMiniMax(player, theBoard, alpha, beta, depth) {
    const availablePositions = getAvailablePositions(theBoard);
    let optimalMove;

    // Set terminating conditions
    if (checkWin(theBoard, playerOne)) {
        // player 1 wins
        return { score: -1 };
    } else if (checkWin(theBoard, playerAi)) {
        // ai wins
        return { score: 1 };
    } else if (availablePositions.length === 0) {
        // draw
        return { score: 0 };
    } else if (depth === maximumDepth) {
        // all depths explored
        return { score: 0 };
    }

    for (let i = 0; i < availablePositions.length; i++) {
        var value;
        theBoard[availablePositions[i]] = player; // assign the player to the position
        // increase depth and switch player       
        if (player === playerAi) { // if it is the ai
            // increase depth
            value = alphaBetaMiniMax(playerOne, theBoard, alpha, beta, depth + 1);
            // alpha value is assigned
            if (value.score > alpha) {
                alpha = value.score;
                optimalMove = availablePositions[i];
            }
        } else { // it is the human
            // increase depth
            value = alphaBetaMiniMax(playerAi, theBoard, alpha, beta, depth + 1);
            // beta value is assigned
            if (value.score < beta) {
                beta = value.score;
                optimalMove = availablePositions[i];
            }
        }
        theBoard[availablePositions[i]] = '';  // reset

        // prune
        if (alpha >= beta) break;
    }

    if (player == playerAi){
        return { index: optimalMove, score: alpha };
    } else {
        return { index: optimalMove, score: beta };
    }
}

/*
 * dynamically create a grid and add cells to it
 */
function loadBoard(){
    var i = 0; // reset before drawing
    boardIsLoaded = true;
    var grid = document.createElement('table');
    var sizeOfGrid = 3;
    
    var column = 0;
    var row = 0;
    while (row < sizeOfGrid) {
        // add new row
        column = 0;
        var newRow = document.createElement('tr');
        grid.appendChild(newRow);
        while (column < sizeOfGrid) { // iterate through 3 columns for 3x3 board
            // add cell current column
            var newCell = document.createElement('td');
            formatCells(newCell, row, column);
            newCell.classList.add('column_' + column, 'row_' + row);

            // left diagonal 
            if (row == column) newCell.classList.add('left_diag_0');

            // right diagonal
            var rightDiagonalPos = sizeOfGrid - row - 1;
            if (column == rightDiagonalPos) newCell.classList.add('right_diag_1');
            newCell.index = i;
            newRow.appendChild(newCell);
            cellArray.push(newCell);
            i++;
            // set on click event to place marker
            newCell.addEventListener('click', onClick);
            console.log("Adding column: " + column);
            column++; // next column
        }
        drawOnTo(grid);
        console.log("Adding row: " + row);
        row++; // next row
    }
    document.getElementById("gameMode").style.visibility = "visible";
    document.getElementById("backToMainMenu").style.visibility= "visible"; 
    document.getElementById('playArea').appendChild(grid);
}

/*
* maps the move onto the board array, which is then drawn
*/
function drawOnTo(theBoard) {
    var boardLength = theBoard.length;
    let col = 0;
    let row = -1;
    let currentPosition = 0;

    while (currentPosition < boardLength){
        if (currentPosition % 3 == 0) { // if we can divise by 3 
            col = 0;
            row++;
        }
        // retrieve the location of the symbol and draw it onto the board with its respective colour
        const symbol = document.getElementsByClassName('column_' + col + ' row_' + row)[0];
        symbol.innerHTML = theBoard[currentPosition];
        col++;
        currentPosition++;
    }
}

/*
* finds unoccupied positions on the board
*/
function getAvailablePositions(theBoard) {
    var boardLength = theBoard.length;
    let availablePosArray = [];
    let currentPosition = 0;

    while (currentPosition < boardLength) {
        if (theBoard[currentPosition] === '') availablePosArray.push(currentPosition);
        currentPosition++;
    }
    return availablePosArray;
}

/*
* used to determine if the player has won or not
*/
function checkWin(theBoard, player) {
    return winArray.some(function (win) {
        return win.every(function (i) {
            return theBoard[i] === player;
        });
    });
}

/*
* handles click events for the grid depending on the game mode
*/
function onClick() {
    var isWinner = false;
    if (!gameFinished) {
        // Return if field  aleady set
        if (this.innerHTML !== '') return

        // Two Player Mode
        if (isTwoPlayer) {
            if (currentTurn) {
                boardArray[this.index] = playerOne;
                currentTurn = false;
                currentTurnText.innerText = "It is " + `${player2Name}` + "'s turn (X)";
            } else {
                boardArray[this.index] = playerTwo;
                currentTurn = true;
                currentTurnText.innerText = "It is " + `${player1Name}` + "'s turn (O)";

            }
            // Place marker on the board
            drawOnTo(boardArray);

            // Player 1 Won
            if (checkWin(boardArray, playerOne)) {
                alertText.innerText = `${player1Name}` + ' wins.';
                currentTurnText.style.visibility = "hidden";
                player1Score++;
                player1ScoreText.innerText = `${player1Score}`;
                showAlertMessage();
                gameFinished = true;
                isWinner = true;
            }

            // Player 2 won
            if (checkWin(boardArray, playerTwo)) {
                alertText.innerText = `${player2Name}` + ' wins.';
                currentTurnText.style.visibility = "hidden";
                player2Score++;
                player2ScoreText.innerText = `${player2Score}`;
                showAlertMessage();
                gameFinished = true;
                isWinner = true;
            }

        } else {
            // Human vs AI
            boardArray[this.index] = playerOne;
            if (lowDifficulty){
                // use MiniMax Alpha Beta to get the optimal move
                const availablePositions = getAvailablePositions(boardArray);
                var move= availablePositions[Math.floor(Math.random() * availablePositions.length)]
                // Place marker on the board
                boardArray[move] = playerAi;
                drawOnTo(boardArray);

            } else {
                // use MiniMax Alpha Beta to get the optimal move
                const optimalMove = alphaBetaMiniMax(playerAi, boardArray, -Infinity, Infinity, 0);
                // Place marker on the board
                boardArray[optimalMove.index] = playerAi;
                drawOnTo(boardArray);
            }
            
            // AI won
            if (checkWin(boardArray, playerAi)) {
                alertText.innerText = 'You lose.';
                currentTurnText.style.visibility = "hidden";
                player2Score++;
                player2ScoreText.innerText = `${player2Score}`;
                showAlertMessage();
                gameFinished = true;
                isWinner = true;
            }
            // Human won
            if (checkWin(boardArray, playerOne)) {
                alertText.innerText = 'You have beat the AI.';
                currentTurnText.style.visibility = "hidden";
                player1Score++;
                player1ScoreText.innerText = `${player1Score}`;
                showAlertMessage();
                gameFinished = true;
                isWinner = true;
            }
        }
        // Draw
        if (!boardArray.includes('') && !isWinner) {
            alertText.innerText = 'It is a draw.';
            currentTurnText.style.visibility = "hidden";
            showAlertMessage();
            gameFinished = true;
        }
    }
}

/*
* used in conjunction with loadBoard() to dynamically add cells
*/
function formatCells(newCell, i, j) {
    newCell.setAttribute('height', cellSize);
    newCell.setAttribute('width', cellSize);
    newCell.setAttribute('align', 'center');
    newCell.setAttribute('valign', 'center');

    if ((j == 0 || j == 1 || j == 2) && i == 0) {
        newCell.className = "borderless-top";
    }
    if ((j == 0 || j == 1 || j == 2) && i == 2) {
        newCell.className = "borderless-bottom";
    }
    if ((j == 0 && (i == 1 || i == 0))) {
        newCell.className = "borderless-top-left";
    }
    if ((j == 2 && (i == 1 || i == 0))) {
        newCell.className = "borderless-top-right";
    }
    if ((j == 0 && (i == 1 || i == 2))) {
        newCell.className = "borderless-bottom-left";
    }
    if ((j == 2 && (i == 1 || i == 2))) {
        newCell.className = "borderless-bottom-right";
    }
}

/* ------------------------------------------------------------------*/
/* -------------------helper functions for UI/UX---------------------*/
/* ------------------------------------------------------------------*/

function playAgain() {
    gameFinished = false;
    hideAlertMessage();
    if (isTwoPlayer) {
        clearBoard();
        startTwoPlayer(true);
    } else {
        clearBoard();
        startAi(true);
    }
}

function enterPlayerNames() {
    firstGame = true;
    gameFinished = false;
    hideMainMenu();
    playerInputLayout.style.display = "grid";
    // configure enter keypress
    playerInputLayout.addEventListener("keyup", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            startTwoPlayer(false);
        }
    });
}

function showMainMenu(){
    hideAlertMessage();
    if (boardIsLoaded) clearBoard();
    document.getElementById("backToMainMenu").style.visibility = "hidden"; 
    document.getElementById("restartBtn").style.visibility = "hidden";
    document.getElementById("setDifficulty").style.visibility = "hidden";

    currentGameMode.innerText = "Select a Game Mode";
    document.getElementById("menu").style.display = "grid";
    currentTurnText.style.visibility = "hidden";
    document.getElementById("player-1-input").value = '';
    document.getElementById("player-2-input").value = '';
    player1ScoreText.style.visibility = "hidden";
    player2ScoreText.style.visibility = "hidden";
    hideDifficulties();
}

function hideMainMenu(){
    document.getElementById("menu").style.display = "none";
    document.getElementById("gameMode").style.visibility = "hidden";
}

function clearBoard(){
    document.getElementById('playArea').children[2].remove();
    boardArray = ['', '', '', '', '', '', '', '', ''];
    boardIsLoaded = false;
    document.getElementById("backToMainMenu").style.visibility = "hidden"; 
}

function hideAlertMessage() {
    alertMessage.style.visibility = "hidden";
}

function showAlertMessage() {
    alertMessage.style.visibility = "visible";
}