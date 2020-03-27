window.onload = init;
const windowSize = 450;
const boardSize = 9;
var context;

var board;
var selectedCell = {col:0, row:0};

var selectedColor = 'lightsteelblue'
var permanentColor = 'black'
var nonPermanentColor = 'mediumblue'


function init(){
    newGame();
    let canvas = document.getElementById("game-canvas")
    canvas.width = windowSize;
    canvas.height = windowSize;

    canvas.addEventListener('mouseup',function(e){
       
        let mousePos = getMousePos(canvas,e);
        let gridPos = getGridPos(mousePos.x,mousePos.y);
        selectedCell = {col: gridPos.col, row: gridPos.row}

        render();
    });

    document.addEventListener('keyup', keyInput);

    context = canvas.getContext("2d");
    context.textAlign = "center";
    context.textBaseline = "middle";
    render();
}

function newGame(){
    // TODO: implement sudoku generator

    
    hasWon = false;
    loaded = easy;
    board = [];
    
    for(let row = 0; row < boardSize; row++){
        currentRow = [];
        for(let col = 0; col < boardSize; col++){
            cell = null;
            if(loaded[row][col] == 0){
                cell = {
                    value: loaded[row][col],
                    permanent: false
                };
            }
            else{
                cell = {
                    value: loaded[row][col],
                    permanent: true
                };
            }
            currentRow.push(cell);
        }
        board.push(currentRow);
    } 
    
}

function checkIfWon(){
    checkRows();
}

function checkRows(){
    
}

function render(){

    context.clearRect(0,0,windowSize,windowSize);
    let cellSize = windowSize/boardSize;
    let selectedValue = -1;

    if(selectedCell != null){
        context.fillStyle = selectedColor;
        context.fillRect(selectedCell.col*cellSize,selectedCell.row*cellSize,cellSize,cellSize);
        selectedValue = board[selectedCell.row][selectedCell.col].value;
        
    }

    for(let row = 0; row < boardSize; row++){
        for(let col = 0; col < boardSize; col++){
            let val = board[row][col].value
            if(val == 0) continue;
            if(val == selectedValue && row != selectedCell.row && col != selectedCell.col){
                context.fillStyle = 'lavender';
                context.fillRect(col*cellSize,row*cellSize,cellSize,cellSize);
            }
            textColor = nonPermanentColor;
            if(board[row][col].permanent){
                textColor = permanentColor;
            }
            context.fillStyle = textColor;
            context.font = "25px Arial";
            context.fillText(val,col*cellSize+cellSize/2,row*cellSize+cellSize/2,cellSize);
        }
    }

    //draw the grid
    context.beginPath();
    for(let i = 0; i < boardSize; i++){
        context.moveTo(0,cellSize*i);
        context.lineTo(windowSize,cellSize*i);
        context.moveTo(cellSize*i,0);
        context.lineTo(cellSize*i,windowSize);
    }
    context.strokeStyle = 'lightgrey'
    context.stroke();

    context.beginPath();
    for(let i = 0; i < boardSize; i+=3){
        context.moveTo(0,cellSize*i);
        context.lineTo(windowSize,cellSize*i);
        context.moveTo(cellSize*i,0);
        context.lineTo(cellSize*i,windowSize);
    }
    context.strokeStyle = 'black'
    context.stroke();
}

// calculates the grid position from pixel coordinates
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

function keyInput(e){
    if(selectedCell == null) return;

    if(e.code.startsWith("Digit")){
        num = parseInt(e.key)
        if(num == 0) return;
        if(board[selectedCell.row][selectedCell.col].permanent) return;
        board[selectedCell.row][selectedCell.col].value = parseInt(e.key)
    }

    if(e.code == 'Backspace'){
        if(!board[selectedCell.row][selectedCell.col].permanent){
            board[selectedCell.row][selectedCell.col].value = 0;
        }
    }

    if(e.code == 'ArrowUp') selectedCell.row = Math.max(0,selectedCell.row-1)
    if(e.code == 'ArrowDown') selectedCell.row = Math.min(boardSize-1,selectedCell.row+1)
    if(e.code == 'ArrowLeft') selectedCell.col = Math.max(0,selectedCell.col-1)
    if(e.code == 'ArrowRight') selectedCell.col = Math.min(boardSize-1,selectedCell.col+1)
    

    render();
}