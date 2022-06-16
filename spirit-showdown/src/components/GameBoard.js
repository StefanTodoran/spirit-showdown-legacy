import { Component } from "react";
import BoardTile from "./BoardTile";
import './Components.css';
import { createRandomSpirit } from '../spiritGeneration';

export default class GameBoard extends Component {
  render() {
    const board = [];
    for (let i = 0; i < this.props.tiles_board.length; i++) {
      const row = [];
      for (let j = 0; j < this.props.tiles_board[i].length; j++) {
        let spirit = null;
        let enemy = null;

        const contents = this.props.spirits_board[i][j]; // tile's spirit board contents
        const hasSpirit = contents !== '';
        if (hasSpirit) {
          const seed_regex = /(?<=\[)(.*?)(?=\])/; // Grabs everything between < and >, not including < and >
          const player_regex = /(?<=\()(.*?)(?=\))/; // Grabs everything between ( and ), not including ( and )

          const seed = contents.match(seed_regex)[0];
          const player = contents.match(player_regex)[0];
          spirit = createRandomSpirit(seed);

          enemy = (player !== this.props.player);
        }

        const id = (hasSpirit) ? contents : `board-tile<${i},${j}>`;
        const selected = (hasSpirit) ? this.props.selectedSpirit === contents : this.props.selectedTile === id;
        const callback = (hasSpirit) ? this.props.selectSpiritCallback : this.props.selectTileCallback;

        row.push(
          <BoardTile
            key={id} id={id}
            type={this.props.tiles_board[i][j]} flipped={this.props.flipped}
            pos={[i, j]} max={[this.props.tiles_board[i].length, this.props.tiles_board.length]}
            spirit={spirit} enemy={enemy} selected={selected}
            selectCallback={callback} 
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
      <div style={{ backgroundColor: '#f0f0f0', border: '1px solid #ccc', borderRadius: '5px', padding: 10, margin: 10 }}>
        {board}
      </div>
    );
  }
}
