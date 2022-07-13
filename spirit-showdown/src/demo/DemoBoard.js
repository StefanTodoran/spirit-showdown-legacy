import { Component } from "react";
import DemoTile from "./DemoTile";
import '../components/Components.css';

export default class DemoBoard extends Component {
  render() {
    const tiles_board = [
      ['wall','wall','wall','wall','p2-spawn','wall','wall','wall','wall','p2-spawn','wall','wall',],
      ['portal','none','wall','none','none','none','none','none','none','none','none','wall',],
      ['wall','none','none','none','wall','wall','wall','none','none','none','none','wall',],
      ['wall','water','water','wall','none','none','none','none','none','water','water','wall',],
      ['wall','water','water','none','none','none','none','none','wall','water','water','wall',],
      ['wall','none','none','none','none','wall','wall','wall','none','none','none','wall',],
      ['wall','none','none','none','none','none','none','none','none','wall','none','portal',],
      ['wall','wall','p1-spawn','wall','wall','wall','wall','p1-spawn','wall','wall','wall','wall',],
    ];

    const board = [];
    for (let i = 0; i < tiles_board.length; i++) {
      const row = [];
      for (let j = 0; j < tiles_board[i].length; j++) {
        
        row.push(
          <DemoTile
            key={`board-tile<${i},${j}>`} type={tiles_board[i][j]} pos={[i, j]}
          />
        );
      }

      board.push(<div key={`board-row<${i}>`} style={{display: 'flex', flexDirection: 'row', margin: 0}}>{row}</div>);
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
      </div>
    );
  }
}
