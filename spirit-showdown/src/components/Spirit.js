import {Component} from 'react';
import { ability_descriptions, ability_names } from '../assets/abilities.js';
import './Components.css';

export default class Spirit extends Component {
  render() {
    /* here we define the tiles that make up the sprite */
    /* we pass the tile i and j position so it can have a unique key */
    const blankTile = (i, j) => {
      return <div key={`sprite<${i},${j}>`} style={{
        width: 9,
        height: 9,
        ...( (i !== 0 ) ? { borderTop: '1px solid lightgray' } : { borderTop: '1px solid transparent' } ),
        ...( (j !== 0 ) ? { borderLeft: '1px solid lightgray' } : { borderLeft: '1px solid transparent' } ),
        // backgroundColor: 'white',
        
      }}/>
    }
    const fillTile = (i, j, color) => {
      return <div key={`sprite<${i},${j}>`} style={{
        width: 9,
        height: 9,
        borderRight: `1px solid ${color}`,
        borderBottom: `1px solid ${color}`,
        backgroundColor: color,
      }}/>
    }
    /* ===== */

    // build up the sprite from the array tile by tile
    const sprite = [];
    for (let i = 0; i < this.props.spirit.sprite.length; i++) {
      const row = [];
      for (let j = 0; j < this.props.spirit.sprite[i].length; j++) {
        const color = (this.props.spirit.sprite[i][j] === 1) ? this.props.spirit.lightColor : this.props.spirit.darkColor;
        const tile = (this.props.spirit.sprite[i][j] === 0) ? blankTile(i, j) : fillTile(i, j, color);
        row.push(tile);
      }
      sprite.push(
        <div key={`sprite-row<${i}>`} className='sprite-pixel'
        style={{display: 'flex', flexDirection: 'row', margin: 0}}>
          {row}
        </div>
      );
    }

    const abilities = [];
    for (let i = 0; i < this.props.spirit.abilities.length; i++) {
      abilities.push(
        <p>
          <strong>{ability_names[this.props.spirit.abilities[i]]}</strong><br/>
          {ability_descriptions[this.props.spirit.abilities[i]]}
        </p>
      );
    }

    return (
      <div className={(this.props.flashing) ? 'deck flashing-sprite' : 'deck'}>
        {sprite}
        <section className='card cover-card'>
          <br/><br/>
          <h2>{this.props.spirit.name}</h2>
          <h3>({this.props.spirit.tier} tier)</h3>
          {abilities}
          <p>
            <span><strong>HP:&nbsp;</strong>{this.props.spirit.HP}</span>
            <span><strong>ATK:&nbsp;</strong>{this.props.spirit.ATK}</span>
            <span><strong>Priority:&nbsp;</strong>{this.props.spirit.priority}</span>
            <br/>
          </p>
        </section>
      </div>
    );
  }
}