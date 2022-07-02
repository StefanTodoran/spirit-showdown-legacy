import { Component } from "react";
import { createRandomSpirit } from "../spiritGeneration";
import Spirit from "./Spirit";
import Loader from "./Loader";

export default class SpiritBattle extends Component {
  selectMove(move) {
    this.props.battleMoveCallback(move);
    this.setState({
      selected: move,
    });
  }

  render() {
    const spirit_tag = (this.props.player_one) ? this.props.battle.player_one_spirit : this.props.battle.player_two_spirit;
    const enemy_tag = (this.props.player_one) ? this.props.battle.player_two_spirit : this.props.battle.player_one_spirit;

    const seed_regex = /(?<=\[)(.*?)(?=\])/;
    const spirit_seed = String(spirit_tag).match(seed_regex)[0];
    const enemy_seed = String(enemy_tag).match(seed_regex)[0];

    const spirit = createRandomSpirit(spirit_seed);
    const enemy = createRandomSpirit(enemy_seed);

    const hp_regex = /:\d+/ // Matches the part at the end of a spirit tag of the format :###
    const spirit_HP = parseInt(spirit_tag.match(hp_regex)[0].slice(1));
    const enemy_HP = parseInt(enemy_tag.match(hp_regex)[0].slice(1));
    const battleOver = spirit_HP === 0 || enemy_HP === 0;

    let flashing = (this.props.events !== null) ? this.props.events : [false, false];
    if (this.props.player_one) {
      flashing.reverse();
    }

    let canFlee = false;
    if (this.props.player_one && this.props.battle.initiator === "player_one" || 
      !this.props.player_one && this.props.battle.initiator === "player_two") {
        canFlee = true;
    }

    const prevMove = (this.props.player_one) ? this.props.battle.player_two_prev : this.props.battle.player_one_prev;
    return (
      <>
        <div style={{ backgroundColor: '#f0f0f0', border: '1px solid #ccc', borderRadius: '5px', 
          padding: 10, margin: 10, display: 'flex', flexDirection: 'row' }}>
          <div className="health-bar" style={{'--fill': (enemy_HP/enemy.HP)}}/>
          <Spirit spirit={enemy} flashing={flashing[0]}/>
        </div>
        <div style={{ backgroundColor: '#f0f0f0', border: '1px solid #ccc', borderRadius: '5px', 
          padding: 10, margin: 10, display: 'flex', flexDirection: 'row' }}>
          <div className="health-bar" style={{'--fill': (spirit_HP/spirit.HP)}}/>
          <Spirit spirit={spirit} flashing={flashing[1]}/>
          <section style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }}>
            <button disabled={battleOver} onClick={ () => { this.selectMove('attack') } }>Attack</button>
            <button disabled={battleOver} onClick={ () => { this.selectMove('meditate') } }>Meditate</button>
            <button disabled={battleOver} onClick={ () => { this.selectMove('dodge') } }>Dodge</button>
            {canFlee && <button disabled={battleOver} onClick={ () => { this.selectMove('flee') } }>Flee</button>}
          </section>
        </div>
        {prevMove && <p>Opponent used <strong>{prevMove}</strong></p>}
        {!battleOver && <>
          {!this.props.queued && <p>Select a move</p>}
          {this.props.queued && <Loader text={"Waiting for opponent's move"}/>}
        </>}
        {battleOver && <p>{(spirit_HP > 0) ? "You won!" : "You lost."}</p>}
      </>
    );
  }
}