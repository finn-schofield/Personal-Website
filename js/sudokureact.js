class NumberButton extends React.Component {
    render(){
        return (
            <button className="btn btn-light" onClick={this.props.onClick} >
                {this.props.value}
            </button>
        );
    }
}

class NumberButtons extends React.Component {

    renderButton(i) {
        return <NumberButton value={i} onClick={() => this.props.onClick(i)}/>
    }

    render() {
        return (
            <div className="number-buttons">
                {this.renderButton(1)}
                {this.renderButton(2)}
                {this.renderButton(3)}
                {this.renderButton(4)}
                {this.renderButton(5)}
                {this.renderButton(6)}
                {this.renderButton(7)}
                {this.renderButton(8)}
                {this.renderButton(9)}
            </div>
        );
    }
}


class Square extends React.Component {
    
    render() {
        // let className = this.props.selected ? "square selected" : "square"
        let className = "square";
        if(this.props.error) className += " error";
        else if(this.props.selected) className += " selected";
        else if(this.props.highlight && this.props.value != null) className += " highlight";
        if(this.props.permanent) className += " permanent";
        return (
            <button className={className} onClick={this.props.onClick}>
                {this.props.value}
            </button>
        );
    }
}

class Board extends React.Component {

    renderSquare(row, col) {
        let selected = false;
        let highlight = false;
        let error = false;

        if(this.props.errors.has(this.props.squares[row][col].value)){
            error = true;
        }
        else if(row == this.props.selected[0] && col == this.props.selected[1]) {
            selected = true;
        }
        else if(this.props.selected[0] >= 0 && this.props.selected[1] >= 0 && // check selected cell is valid
            (this.props.squares[this.props.selected[0]][this.props.selected[1]].value
            == this.props.squares[row][col].value)){ 
                highlight = true;
            }
        
        return (
            <Square
                value={this.props.squares[row][col].value == 0 ? null : this.props.squares[row][col].value}
                permanent={this.props.squares[row][col].permanent}
                onClick={() => this.props.onClick(row, col)}
                selected={selected}
                highlight={highlight}
                error={error}
            />
        );
    }

    renderSegment(i) {
        let topRow = Math.floor(i / 3) * 3;
        let leftCol = (i - topRow) * 3;
        return (
            <div className="grid-item">
                <div>
                    {this.renderSquare(topRow+0,leftCol+0)}
                    {this.renderSquare(topRow+0,leftCol+1)}
                    {this.renderSquare(topRow+0,leftCol+2)}
                </div>
                <div>
                    {this.renderSquare(topRow+1,leftCol+0)}
                    {this.renderSquare(topRow+1,leftCol+1)}
                    {this.renderSquare(topRow+1,leftCol+2)}
                </div>
                <div>
                    {this.renderSquare(topRow+2,leftCol+0)}
                    {this.renderSquare(topRow+2,leftCol+1)}
                    {this.renderSquare(topRow+2,leftCol+2)}
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="grid-container">
                {this.renderSegment(0)}
                {this.renderSegment(1)}
                {this.renderSegment(2)}
                {this.renderSegment(3)}
                {this.renderSegment(4)}
                {this.renderSegment(5)}
                {this.renderSegment(6)}
                {this.renderSegment(7)}
                {this.renderSegment(8)}
            </div>
            
        );
    }
}

class Game extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            status: "",
            squares: createBoard(easy),
            selected: [-1, -1],
            hasWon: false,
            errors: new Set(),
        };
        console.log(this.state.squares);
    }

    restart() {
        this.setState({
            squares: createBoard(easy),
            errors: new Set(),
        });
    }

    handleKeyPress(e) {

        if(e.code.startsWith("Arrow")){
            if(this.state.selected[0] < 0 || this.state.selected[1] < 0){
                return;
            } 
            let currentRow = this.state.selected[0];
            let currentCol = this.state.selected[1];
            if(e.code == "ArrowUp"){
                this.setState({
                    selected: [Math.max(0,currentRow-1), currentCol]
                });
            }
            if(e.code == "ArrowDown"){
                this.setState({
                    selected: [Math.min(8, currentRow+1), currentCol]
                });
            }
            if(e.code == "ArrowLeft"){
                this.setState({
                    selected: [currentRow, Math.max(0, currentCol-1)]
                });
            }
            if(e.code == "ArrowRight"){
                this.setState({
                    selected: [currentRow, Math.min(8, currentCol+1)]
                });
            }
        }
        if(e.code.startsWith("Digit")){
            console.log(e.key)
            let num = e.key*1;
            
            this.updateSquare(this.state.selected[0], this.state.selected[1], num);

        }
        
    }

    handleClick(row, col) {
        this.setState({
            selected: [row, col],
        });
    }

    handleNumberButton(i) {
        if(this.state.selected[0] < 0 || this.state.selected[1] < 0) return;

        this.updateSquare(this.state.selected[0], this.state.selected[1], i);
    }

    updateSquare(row, col, newValue){
        if(this.state.squares[row][col].permanent) return;
        
        let squares = JSON.parse(JSON.stringify(this.state.squares))
        squares[row][col].value = newValue;
        let errors = checkIfWon(squares);
        this.setState({
            squares: squares,
            errors: errors,
        });
    }

    componentDidMount() {
        document.addEventListener("keydown", (e) => {this.handleKeyPress(e)}, false);
    }

    componenetWillUnmount() {
        document.removeEventListener("keydown", (e) => {this.handleKeyPress(e)}, false);
    }

    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board 
                        squares={this.state.squares}
                        onClick={(row, col) => this.handleClick(row, col)}
                        selected={this.state.selected}
                        errors={this.state.errors}
                    />
                </div>
                <NumberButtons onClick={(i) => this.handleNumberButton(i)}/>
                <button type="button" className="btn btn-light" onClick={() => this.restart()}>reset</button>
                <a>{this.state.status}</a>
            </div>
        );
    }
}

// code to disable scrolling page with arrow keys
window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

function checkIfWon(squares){
    let errors = new Set();
    let emptyCells = false;

    // check rows and columns for duplicates
    for(let i = 0; i < 9; i++){
        let rowValues = new Set();
        let colValues = new Set();

        for(let cell = 0; cell < 9; cell++){

            //check row
            if(squares[i][cell].value == 0){
                emptyCells = true;
            }
            else if(rowValues.has(squares[i][cell].value)){
                errors.add(squares[i][cell].value);
            }
            rowValues.add(squares[i][cell].value);


            //check column
            if(squares[cell][i].value == 0){
                emptyCells = true;
            }
            else if(colValues.has(squares[cell][i].value)){
                errors.add(squares[cell][i].value);
            }
            colValues.add(squares[cell][i].value);
        }

    }

    // check 3x3 board segments from top left square for duplicates
    emptyCells = emptyCells && checkSegment(0, 0, squares, errors);
    emptyCells = emptyCells && checkSegment(0, 3, squares, errors);
    emptyCells = emptyCells && checkSegment(0, 6, squares, errors);
    emptyCells = emptyCells && checkSegment(3, 0, squares, errors);
    emptyCells = emptyCells && checkSegment(3, 3, squares, errors);
    emptyCells = emptyCells && checkSegment(3, 6, squares, errors);
    emptyCells = emptyCells && checkSegment(6, 0, squares, errors);
    emptyCells = emptyCells && checkSegment(6, 3, squares, errors);
    emptyCells = emptyCells && checkSegment(6, 6, squares, errors);

    return errors;

}

function checkSegment(row, col, squares, errors){
    let values = new Set();
    let emptyCells = false;

    for(let i = 0; i < 3; i++){
        for(let j = 0; j < 3; j++){
            if(squares[row+i][col+j].value == 0){
                emptyCells = true;
            }
            else if(values.has(squares[row+i][col+j].value)){
                errors.add(squares[row+i][col+j].value);
            }
            values.add(squares[row+i][col+j].value);
        }
    }

}

function createBoard(values){
    let board = [];
    for(let row = 0; row < values.length; row++){
        let newRow = [];
        for(let col = 0; col < values[0].length; col++){
            newRow.push({
                value: values[row][col],
                permanent: values[row][col] != 0,
            });
        }
        board.push(newRow);
    }
    return board;
}


  
  // ========================================
  
ReactDOM.render(<Game />, document.getElementById('game_container') );
