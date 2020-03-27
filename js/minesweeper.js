window.onload = init;
const windowSize = 300;
const boardSize = 12;
const mines = 20;
var context;
var board;
let gameOver = false,hasWon = false;

// initialises the canvas
function init(){
    newGame();
    let canvas = document.getElementById("game-canvas");
    canvas.width = windowSize;
    canvas.height = windowSize;
    
    canvas.addEventListener('mouseup',function(e){
        if(gameOver) return;

        let mousePos = getMousePos(canvas,e);
        let gridPos = getGridPos(mousePos.x,mousePos.y);

        if(e.button === 0){
            uncoverCell(gridPos.col,gridPos.row);

        } else if(e.button === 2) {
            flagCell(gridPos.col,gridPos.row);
        }

        hasWon = isGameWon();
        if(hasWon) gameOver = true;
        render();
    })

    canvas.addEventListener('dblclick',function(e){
        if(gameOver) return;
        let mousePos = getMousePos(canvas,e);
        let gridPos = getGridPos(mousePos.x,mousePos.y);
        if(e.button === 0){
            console.log(`${gridPos.col} ${gridPos.row}`);
        }
    })

    context = canvas.getContext("2d");
    context.textAlign = "center";
    context.textBaseline = "middle";
    render();
}

// initiates a new game
function newGame(){
    gameOver = false;
    //reset the board and populate it with cells
    board = [];
    for(let col = 0; col < boardSize; col++){
        let col = [];
        for(let row = 0; row < boardSize; row++){
            col.push({
                hasMine: false,
                isCovered: true,
                isFlagged: false,
                neighboringMines: 0
            });
        }
        board.push(col);

        
    }

    //add mines to the the board
    let count = 0;
    while(count < mines){
        let randomRow = Math.floor(Math.random()*boardSize);
        let randomCol = Math.floor(Math.random()*boardSize);

        if(!board[randomRow][randomCol].hasMine){
            board[randomRow][randomCol].hasMine = true;
            count++;
        }
    }
    //assign each cell a count of neighboring mines
    for(let col = 0; col < boardSize; col++){
        for(let row = 0; row < boardSize; row++){
            board[col][row].neighboringMines=neighboringMines(col,row);
        }
    }
}

// uncovers a single cell
function uncoverCell(col,row){
    let cell = board[col][row];
    if(cell.isFlagged){
        return;
    }
    if(cell.hasMine){
        gameOver = true;
        console.log('Game over!');
    } else {
        uncoverNeighbors(col,row);       
    }

}

// recursively uncovers the cell and it's neighbors
function uncoverNeighbors(col,row){
    let cell = board[col][row];
    
    cell.isCovered = false;

    if(cell.neighboringMines === 0){
        for(let c = Math.max(col-1,0); c < Math.min(col+2,boardSize); c++){
            for(let r = Math.max(row-1,0); r < Math.min(row+2,boardSize); r++){
                if(c !== col || r !== row){
                    if(board[c][r].isCovered){
                        uncoverNeighbors(c,r);
                    }
                    
                }
            }
        }
    }
}

// flags a cell on the board
function flagCell(col,row){
    if(board[col][row].isCovered){
        board[col][row].isFlagged = !board[col][row].isFlagged;
    }
}

// renders the board to the given context
function render(){

    context.clearRect(0,0,windowSize,windowSize);
    let cellSize = windowSize/boardSize;

    //render each cell
    for(let col = 0; col < boardSize; col++){
        for(let row = 0; row < boardSize; row++){
            renderCell(col,row,cellSize,context);
        }

    }

    //draw the grid
    context.fillStyle="black";
    context.beginPath();
    for(let i = 0; i < boardSize; i++){
        context.moveTo(0,cellSize*i);
        context.lineTo(windowSize,cellSize*i);
        context.moveTo(cellSize*i,0);
        context.lineTo(cellSize*i,windowSize);
    }
    context.stroke();

    if(gameOver){
        if(hasWon){
            drawText("YOU WIN!");
        } else {
            drawText("GAME OVER!");
        }
    }
    
}

// renders an individual cell to the context
function renderCell(col,row,cellSize) {
    if(board[col][row].isCovered){
        context.fillStyle = "rgb(239,120,64)";
        context.fillRect(col*cellSize,row*cellSize,cellSize,cellSize);
        if(board[col][row].isFlagged){
            let flagImg = document.getElementById('flag-img');
            context.drawImage(flagImg,col*cellSize,row*cellSize,cellSize,cellSize);
        }
    } else { //draw the number of neighbors
        let neighbors = board[col][row].neighboringMines;
        if(neighbors !== 0){
            context.fillStyle = "black";
            context.font = "17px arial";
            context.fillText(neighbors,col*cellSize+cellSize/2,row*cellSize+cellSize/2,cellSize);
        }
        
    }

}

// determines if the current game has been won
function isGameWon(){
    for(let col = 0; col < boardSize; col++){
        for(let row = 0; row < boardSize; row++){
            if(board[col][row].hasMine && !board[col][row].isFlagged 
                || !board[col][row].hasMine && board[col][row].isCovered){
                return false;
            }
        }
    }
    return true;
}

// calculates the neighboring mines of a cell
function neighboringMines(col,row){
    count=0;
    for(let c = Math.max(col-1,0); c < Math.min(col+2,boardSize); c++){
        for(let r = Math.max(row-1,0); r < Math.min(row+2,boardSize); r++){
            if(board[c][r].hasMine) count++;
            
        }
    }
    return count;
}

// calculates the gird position from pixel coordinates
function getGridPos(x,y){
    let cellSize = windowSize/boardSize;

    return {
        col: Math.floor(x/cellSize),
        row: Math.floor(y/cellSize)
    };
}

// from https://www.html5canvastutorials.com/advanced/html5-canvas-mouse-coordinates/
function getMousePos(canvas, e){
    let rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
}

// draws text to the canvas
function drawText(text){
    context.font = "italic bold 50px Impact";
        context.fillStyle="white";
        context.fillText(text,windowSize/2,windowSize/2,windowSize);
        context.lineWidth=3;
        context.fillStyle="black";
        context.strokeText(text,windowSize/2,windowSize/2,windowSize);
        context.lineWidth=1;
}