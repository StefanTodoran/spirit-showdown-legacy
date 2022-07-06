import {Component} from 'react';
import { buildSprite } from './buildSprite.js';
import './Components.css';
import StatsCard from './StatsCard.js';

export default class Spirit extends Component {
  // Return whether or not the given spirit has the given effect.
  hasEffect(effect) {
    const matches = this.props.spirit.effects.filter(e => e.effect === effect);
    return matches.length !== 0;
  }

  render() {
    let pixel_class = (this.props.flashing < 0) ? 'heal-pixel' : '';
    if (this.hasEffect("Frozen")) {
      pixel_class += ' frozen-pixel';
    }

    /* here we define the tiles that make up the sprite */
    /* we pass the tile i and j position so it can have a unique key */
    const blankTile = (i, j) => {
      return <div key={`sprite<${i},${j}>`} style={{
        width: 9,
        height: 9,
        ...( (i !== 0 ) ? { borderTop: '1px solid lightgray' } : { borderTop: '1px solid transparent' } ),
        ...( (j !== 0 ) ? { borderLeft: '1px solid lightgray' } : { borderLeft: '1px solid transparent' } ),
      }}/>
    }
    const fillTile = (i, j, color) => {
      return <div key={`sprite<${i},${j}>`} style={{
        width: 9,
        height: 9,
        borderRight: `1px solid ${color}`,
        borderBottom: `1px solid ${color}`,
        backgroundColor: color,
      }} className={pixel_class}/>
    }
    /* ===== */

    const sprite = (this.props.spirit) ? buildSprite(this.props.spirit, blankTile, fillTile) : [];

    const fire = [];
    if (this.hasEffect("Burning")) {
      for (let i = 0; i < 15; i++) {
        fire.push(
          <div key={`fire-particle<${i}>`} className={'fire-particle'} 
            style={{
              "--distance": Math.random() * 100, "--delay": `${Math.random() - 0.5}s`,
              "--offset-x": `${Math.random() * 100 - 50}px`, "--offset-y": `${Math.random() * 100 - 50}px`,
            }}
          />
        );
      }
    }

    return (
      <div className={(this.props.flashing > 0) ? 'deck flashing-sprite' : 'deck'}>
        {sprite}{fire}
        <StatsCard spirit={this.props.spirit} styleClass={'card cover-card'}/>
      </div>
    );
  }
}