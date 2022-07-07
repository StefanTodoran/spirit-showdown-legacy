import {Component} from 'react';
import { buildSprite, createFire, hasEffect } from './spriteUtilities.js';
import './Components.css';
import StatsCard from './StatsCard.js';

export default class Spirit extends Component {
  render() {
    let pixel_class = (this.props.flashing < 0) ? 'heal-pixel' : '';
    if (hasEffect(this.props.spirit, "Frozen")) {
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
    const fire = createFire(this.props.spirit, 15, 100);

    return (
      <div className={(this.props.flashing > 0) ? 'deck flashing-sprite' : 'deck'} style={{overflow: 'hidden'}}>
        {sprite}{fire}
        <StatsCard spirit={this.props.spirit} styleClass={'card cover-card'}/>
        {this.props.dodged && <p className='dodge-text'>MISS</p>}
      </div>
    );
  }
}