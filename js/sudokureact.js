
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

    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
                selected={this.props.selected == i}
            />
        );
    }

    renderSegment(i) {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSegment(0)}
                    {this.renderSegment(1)}
                    {this.renderSegment(2)}
                </div>
                <div className="board-row">
                    {this.renderSegment(3)}
                    {this.renderSegment(4)}
                    {this.renderSegment(5)}
                </div>
                <div className="board-row">
                    {this.renderSegment(6)}
                    {this.renderSegment(7)}
                    {this.renderSegment(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            squares: Array(9).fill(null),
            selected: -1,
        };
    }

    handleKeyPress(e) {
        if(e.code.startsWith("Digit")){
            console.log(e.key)
            let num = e.key*1;
            let squares = this.state.squares.slice();
            squares[this.state.selected] = num;
            this.setState({
                squares: squares,
            });

        }
        
    }

    handleClick(i) {
        this.setState({
            selected: i,
        });
        console.log("selected "+this.state.selected)
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
                        onClick={(i) => this.handleClick(i)}
                        selected={this.state.selected}
                    />
                </div>
            </div>
        );
    }
}
  

  
  // ========================================
  
ReactDOM.render(<Game />, document.getElementById('game_container') );
