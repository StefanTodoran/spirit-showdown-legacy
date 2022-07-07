import { Component } from 'react';
import { buildSprite, createFire, hasEffect } from './spriteUtilities';
import StatsCard from './StatsCard.js';
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
    // const waterColors = ["#93FFFF", "#93EAEA"];
    const waterColors = ['#B3FBFB', '#B0EAEA'];
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
      }} className={hasEffect(this.props.spirit, "Frozen") ? 'frozen-pixel' : ''}/>
    }
    /* ===== */

    const sprite = (this.props.spirit) ? buildSprite(this.props.spirit, blankTile, fillTile) : [];
    const fire = (this.props.spirit) ? createFire(this.props.spirit, 10, 40, 2) : [];

    const valid = [];
    if (this.props.spirit) {    
      if (!this.props.enemy && this.props.selected) {
        const maxDist = 
          this.props.spirit.abilities.includes('Tank') ? 2 :
          this.props.spirit.abilities.includes('Speedster') ? 4 : 3;

        for (let x = -maxDist; x < maxDist + 1; x++) {
          for (let y = -maxDist; y < maxDist + 1; y++) {

            if (!(x === 0 && y === 0) && (Math.abs(x) + Math.abs(y) <= maxDist)) {
              const selection = [this.props.pos[1] + x, this.props.pos[0] + y];
              if (!(selection[0] < 0 || selection[1] < 0 || selection[0] >= this.props.max[0] || selection[1] >= this.props.max[1])) {
                const digit = 2*(maxDist + 1 - (Math.abs(x) + Math.abs(y)));
                const bgColor = `#000000${digit}${digit}`;
                valid.push(
                  <div 
                    className={(this.props.flipped) ? 'valid-move flipped' :'valid-move tile'} 
                    key={`selection<${x},${y}>`} style={{
                      '--xdistance': x, '--ydistance': y,
                      ...( { backgroundColor: bgColor }),
                    }}
                  />
                );
              }
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
              {sprite}{fire}
            </div>
              <StatsCard spirit={this.props.spirit} styleClass={'card tooltip-card'} showHealth={true} horizontalStats={true} showEffects={true}/>
            {valid}
          </>
        }
      </div>
    );
  }
}