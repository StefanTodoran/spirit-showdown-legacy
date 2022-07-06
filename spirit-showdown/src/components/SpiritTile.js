import { Component } from 'react';
import { buildSprite } from './buildSprite';
import StatsCard from './StatsCard.js';
import './Components.css';

export default class SpiritTile extends Component {
  handleClick = () => {
    if (!this.props.dead) {
      this.props.selectCallback(this.props.spirit);
    }
  }

  render() {
    const sideLength = this.props.spirit.sprite.length / 7.5;

    /* here we define the tiles that make up the sprite */
    /* we pass the tile i and j position so it can have a unique key */
    const blankTile = (i, j) => {
      return <div key={`st-sprite<${i},${j}>`} style={{
        width: `${sideLength}px`,
        height: `${sideLength}px`,
        borderTop: '1px solid transparent',
        borderLeft: '1px solid transparent',
        // backgroundColor: 'white',

      }} />
    }
    const fillTile = (i, j, color) => {
      return <div key={`st-sprite<${i},${j}>`} style={{
        width: `${sideLength}px`,
        height: `${sideLength}px`,
        borderRight: `1px solid ${color}`,
        borderBottom: `1px solid ${color}`,
        backgroundColor: color,
      }} />
    }
    /* ===== */

    const sprite = (this.props.spirit) ? buildSprite(this.props.spirit, blankTile, fillTile) : [];
    const class_name = this.props.selected ? 'deck selected' : this.props.dead ? 'deck selectable dead' : 'deck selectable';

    return (
      <div className={class_name} onClick={this.handleClick} 
        style={{...(this.props.dead ? {"--cooldown": `"${this.props.spirit.cooldown}"`} : {})}}>
        {sprite}
        <StatsCard spirit={this.props.spirit} styleClass={'card hover-card'}/>
      </div>
    );
  }
}