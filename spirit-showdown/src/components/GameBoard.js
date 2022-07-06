import { Component } from "react";
import BoardTile from "./BoardTile";
import './Components.css';

export default class GameBoard extends Component {
  onComponentWillRecieveProps(nextProps) {
    console.log(this.props.tiles_board);
    console.log(this.props.spirits_board);
  }

  render() {
    const board = [];
    for (let i = 0; i < this.props.tiles_board.length; i++) {
      const row = [];
      for (let j = 0; j < this.props.tiles_board[i].length; j++) {
        const spirit = this.props.spirits_board[i][j];
        const enemy = (spirit) ? spirit.owner !== this.props.player : false;

        const id = (spirit) ? spirit : `board-tile<${i},${j}>`;
        const selected = (spirit) ? this.props.selectedSpirit === id : this.props.selectedTile === id;
        const callback = (spirit) ? this.props.selectSpiritCallback : this.props.selectTileCallback;

        row.push(
          <BoardTile
            key={`board-tile<${i},${j}>`} id={id} selectCallback={callback}
            type={this.props.tiles_board[i][j]} flipped={this.props.flipped}
            pos={[i, j]} max={[this.props.tiles_board[i].length, this.props.tiles_board.length]}
            spirit={spirit} enemy={enemy} selected={selected}
          />
        );
      }

      // we flip by row below, but this prevents mirroring
      if (this.props.flipped) {
        row.reverse();
      }
      board.push(<div key={`board-row<${i}>`} style={{display: 'flex', flexDirection: 'row', margin: 0}}>{row}</div>);
    }

    // if we are player two, flip the board to match our perspective
    if (this.props.flipped) {
      board.reverse();
    }

    return (
      <div style={{ 
        position: "relative", 
        backgroundColor: '#f0f0f0', 
        border: '1px solid #ccc', 
        borderRadius: '5px', 
        padding: 10, 
        margin: 10 
      }}>
        {board}
        <div className={(this.props.winner) ? 'game-over-message' : 'game-over-message hidden'}>
          {this.props.winner === this.props.player ? "You won!" : "You lost!"}
        </div>
      </div>
    );
  }
}
