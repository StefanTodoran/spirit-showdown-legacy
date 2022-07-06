import { Component } from 'react';
import Spirit from './Spirit';
import SpiritTile from './SpiritTile';
import { createRandomSpirit } from '../spiritGeneration';

export default class Deck extends Component {
  gameReadySpirit(seed) {
    const spirit = createRandomSpirit(seed);
    return {
      ...spirit,
      owner: this.props.player,
      position: null, // null if in hand
      seed: seed,

      turns_unmoved: 0,
      cooldown: 0, // incremented if dead, revived when it hits 0 again

      current_hp: spirit.HP,
      hp_boost: 0, // this number is stacked on health
      dmg_boost: 1, // this is a multiplier on damage
    
      effects: [],
    }
  }

  sameSpirit(a, b) {
    return a.seed === b.seed && a.owner === b.owner;
  }

  render() {
    const deck = [];
    for (let i = 0; i < this.props.deck.length; i++) {
      const seed = this.props.deck[i];
      const spirit = this.gameReadySpirit(seed);
      const id = `spirit(${this.props.player})[${seed}]`;
      
      if (this.props.display) {
        deck.push( <Spirit key={id} spirit={spirit}/> );
      } else {
        const selected = (this.props.selected) ? this.sameSpirit(this.props.selected, spirit) : false;
        deck.push(
          <SpiritTile key={id} spirit={spirit} selectCallback={this.props.selectCallback} selected={selected}/>
        );
      }
    }

    const graveyard = [];
    if (this.props.graveyard) {
      for (let i = 0; i < this.props.graveyard.length; i++) {
        const spirit = this.props.graveyard[i];
        if (spirit.owner === this.props.player) {
          const id = `spirit(${this.props.player})[${spirit.seed}]`;
          graveyard.push(
            <SpiritTile key={id} spirit={this.props.graveyard[i]} selected={false} dead={true}/>
          );
        }
      }
    }

    return (
      <div style={{
        display: 'grid', 
        width: 'min(95vw, 1500px)',
        justifyContent: 'center',
        maxWidth: 700,
        ...( this.props.display ? { gridTemplateColumns: 'repeat(auto-fit, 225px)' } : { gridTemplateColumns: 'repeat(auto-fit, 100px)' } ),
      }}>
        {deck}{graveyard}
      </div>
    );
  }
}