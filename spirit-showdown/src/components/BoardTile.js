import { Component } from 'react';
import { ability_descriptions, ability_names } from '../assets/abilities.js';
import './Components.css';

export default class BoardTile extends Component {
  state = {
    hovered: false,
  }

  handleClick = () => {
    this.props.selectCallback(this.props.id);
  }

  render() {
    const wallColors = ['#404040', '#3A3A3A']; // light, dark
    const waterColors = ["#93EAEA", "#93FFFF"];
    const portalColors = ["#D77DFF", "#CD72F4"];
    const player1Colors = ["#7DFF8D", "#72EC80"];
    const player2Colors = ["#FF7D9D", "#EC7290"];
    const animated = ['water', 'portal', 'p1-spawn', 'p2-spawn'];

    let colors = ['#F3F3F3', '#EAEAEA'];
    if (this.props.type === 'wall') {
      colors = wallColors;
    } else if (this.props.type === 'water') {
      colors = waterColors;
    } else if (this.props.type === 'portal') {
      colors = portalColors;
    } else if (this.props.type === 'p1-spawn') {
      colors = (this.props.flipped) ? player2Colors : player1Colors;
    } else if (this.props.type === 'p2-spawn') {
      colors = (this.props.flipped) ? player1Colors : player2Colors;
    }

    let className = 'tile';
    if (this.props.selected) {
      className += ' selected-tile';
    }
    if (animated.includes(this.props.type)) {
      className += ' animated-tile';
    }
    if (this.props.spirit) {
      className += ' spirit-tile';
    }

    /* here we define the tiles that make up the sprite */
    /* we pass the tile i and j position so it can have a unique key */
    const blankTile = (i, j) => {
      return <div key={`st-sprite<${i},${j}>`} style={{
        minWidth: `calc(6vmin / ${this.props.spirit.sprite.length})`,
        minHeight: `calc(6vmin / ${this.props.spirit.sprite.length})`,
        borderTop: '1px solid transparent',
        borderLeft: '1px solid transparent',
        // backgroundColor: 'white',

      }} />
    }
    const fillTile = (i, j, color) => {
      return <div key={`st-sprite<${i},${j}>`} style={{
        minWidth: `calc(6vmin / ${this.props.spirit.sprite.length})`,
        minHeight: `calc(6vmin / ${this.props.spirit.sprite.length})`,
        borderRight: `1px solid ${color}`,
        borderBottom: `1px solid ${color}`,
        backgroundColor: color,
      }} />
    }
    /* ===== */

    const sprite = [];
    const abilities = [];
    if (this.props.spirit) {    
      // build up the sprite from the array tile by tile
      for (let i = 0; i < this.props.spirit.sprite.length; i++) {
        const row = [];
        for (let j = 0; j < this.props.spirit.sprite[i].length; j++) {
          const color = (this.props.spirit.sprite[i][j] === 1) ? this.props.spirit.lightColor : this.props.spirit.darkColor;
          const tile = (this.props.spirit.sprite[i][j] === 0) ? blankTile(i, j) : fillTile(i, j, color);
          row.push(tile);
        }
        sprite.push(<div key={`st-sprite-row<${i}>`} style={{ display: 'flex', flexDirection: 'row', margin: 0 }}>{row}</div>);
      }
    
      for (let i = 0; i < this.props.spirit.abilities.length; i++) {
        abilities.push(
          <p>
            <strong>{ability_names[this.props.spirit.abilities[i]]}</strong><br />
            {ability_descriptions[this.props.spirit.abilities[i]]}
          </p>
        );
      }
    }

    const valid = [];
    if (!this.props.enemy && this.props.selected) {
      for (let x = -2; x < 3; x++) {
        for (let y = -2; y < 3; y++) {
          if (!(x === 0 && y === 0) && (Math.abs(x) + Math.abs(y) <= 2)) {
            const selection = [this.props.pos[1] + x, this.props.pos[0] + y];
            if (!(selection[0] < 0 || selection[1] < 0 || selection[0] >= this.props.max[0] || selection[1] >= this.props.max[1])) {
              valid.push(
                <div 
                  className={(this.props.flipped) ? 'valid-move flipped' :'valid-move tile'} 
                  key={`selection<${x},${y}>`} style={{
                    '--xdistance': x, '--ydistance': y,
                    ...( ((Math.abs(x) + Math.abs(y)) > 1) ? { backgroundColor: "#00000022" } : { backgroundColor: "#00000055" })
                  }}
                />
              );
            }
          }
        }
      }
    }
    
    return (
      <div 
      className={className} onClick={this.handleClick}
      onMouseEnter={() => this.setState({ hovered: true })}
      onMouseLeave={() => this.setState({ hovered: false })}
      style={{
        position: 'relative',
        ...( ((this.props.pos[0] + this.props.pos[1]) % 2 === 0) ? { backgroundColor: colors[0] } : { backgroundColor: colors[1]} ),
        ...( (this.state.hovered && this.props.spirit) ? { zIndex: 2 } : {} ),
      }}>
        {this.props.spirit &&
          <>
            <div className={((this.props.enemy) ? 'player-two' : 'player-one') + ' spirit-container'}>
              {sprite}
            </div>
            {this.props.enemy && 
              <section className='card hover-card'>
                <br/>
                <h2>{this.props.spirit.name}</h2>
                <h3>({this.props.spirit.tier} tier)</h3>
                {abilities}
                <p>
                  <span><strong>HP:&nbsp;</strong>{this.props.spirit.HP}</span>
                  <span><strong>ATK:&nbsp;</strong>{this.props.spirit.ATK}</span>
                  <span><strong>Priority:&nbsp;</strong>{this.props.spirit.priority}</span>
                  <br />
                </p>
              </section>
            }
            {valid}
          </>
        }
      </div>
    );
  }
}