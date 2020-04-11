class NumberButton extends React.Component {
    render(){
        return (
            <button className="number-button" onClick={this.props.onClick} >
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
        let className = this.props.selected ? "square selected" : "square"
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
        if(row == this.props.selected[0] && col == this.props.selected[1]) {
            selected = true;
        }
        return (
            <Square
                value={this.props.squares[row][col] == 0 ? null : this.props.squares[row][col]}
                onClick={() => this.props.onClick(row, col)}
                selected={selected}
            />
        );
    }

    renderSegment(i) {
        let topRow = Math.floor(i / 3) * 3;
        let leftCol = (i - topRow) * 3;
        return (
            <div className="grid-item">
                <div className="board-row">
                    {this.renderSquare(topRow+0,leftCol+0)}
                    {this.renderSquare(topRow+0,leftCol+1)}
                    {this.renderSquare(topRow+0,leftCol+2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(topRow+1,leftCol+0)}
                    {this.renderSquare(topRow+1,leftCol+1)}
                    {this.renderSquare(topRow+1,leftCol+2)}
                </div>
                <div className="board-row">
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
            squares: easy,
            selected: [-1, -1],
        };
    }

    handleKeyPress(e) {
        if(e.code.startsWith("Digit")){
            console.log(e.key)
            let num = e.key*1;
            let squares = this.state.squares.slice();
            squares[this.state.selected[0]][this.state.selected[1]] = num;
            this.setState({
                squares: squares,
            });

        }
        
    }

    handleClick(row, col) {
        this.setState({
            selected: [row, col],
        });
    }

    handleNumberButton(i) {
        if(this.state.selected[0] < 0 || this.state.selected[1] < 0) return;

        let squares = this.state.squares.slice();
        squares[this.state.selected[0]][this.state.selected[1]] = i;
        this.setState({
            squares: squares,
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
                    />
                </div>
                <NumberButtons onClick={(i) => this.handleNumberButton(i)}/>
            </div>
        );
    }
}
  

  
  // ========================================
  
ReactDOM.render(<Game />, document.getElementById('game_container') );
