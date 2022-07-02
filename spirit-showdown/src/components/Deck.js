import { Component } from 'react';
import Spirit from './Spirit';
import SpiritTile from './SpiritTile';
import { createRandomSpirit } from '../spiritGeneration';

export default class Deck extends Component {
  render() {
    const deck = [];
    for (let i = 0; i < this.props.deck.length; i++) {
      const seed = this.props.deck[i];
      // SPIRIT TAG CONSTRUCTION: (note how board_pos is empty in hand)
      // spirit(player_id)[seed]<board_pos>:hp
      const spirit = createRandomSpirit(seed);
      const id = `spirit(${this.props.player})[${seed}]<>:${spirit.HP}`;
      if (this.props.display) {
        deck.push( <Spirit key={id} spirit={spirit}/> );
      } else {
        const selected = this.props.selected === id;
        deck.push(
          <SpiritTile key={id} spirit={spirit} id={id} 
            selectCallback={this.props.selectCallback} selected={selected}
          />
        );
      }
    }

    return (
      <div style={{
        display: 'grid', 
        width: 'min(95vw, 1500px)',
        justifyContent: 'center',
        // gridTemplateColumns: 'repeat(auto-fit, 225px)',
        ...( (this.props.display) ? { gridTemplateColumns: 'repeat(auto-fit, 225px)' } : { gridTemplateColumns: 'repeat(auto-fit, 100px)' } ),
      }}>
        {deck}
      </div>
    );
  }
}