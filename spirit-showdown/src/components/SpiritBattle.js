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
    const spirit = (this.props.player_one) ? this.props.battle.player_one_spirit : this.props.battle.player_two_spirit;
    const enemy = (this.props.player_one) ? this.props.battle.player_two_spirit : this.props.battle.player_one_spirit;

    const battleOver = spirit.current_hp === 0 || enemy.current_hp === 0;

    let flashing = (this.props.events !== null) ? this.props.events : [false, false];
    if (this.props.player_one) {
      flashing.reverse();
    }
    console.log("enemy", flashing[0], "me", flashing[1]);

    let canFlee = false;
    if (this.props.player_one && this.props.battle.initiator === "player_one" || 
      !this.props.player_one && this.props.battle.initiator === "player_two") {
        canFlee = true;
    }

    const enemyPrevMove = (this.props.player_one) ? this.props.battle.player_two_prev : this.props.battle.player_one_prev;
    const myPrevMove = (this.props.player_one) ? this.props.battle.player_one_prev : this.props.battle.player_two_prev;

    const enemyBoost = Math.round(enemy.dmg_boost * enemy.permanent_dmg_boost * 100) / 100;
    const myBoost = Math.round(spirit.dmg_boost * spirit.permanent_dmg_boost * 100) / 100;
    
    const enemyPopDist = (Math.random() * 600) - 300;
    const myPopDist = (Math.random() * 600) - 300;
    return (
      <>
        <div style={{ backgroundColor: '#f0f0f0', border: '1px solid #ccc', borderRadius: '5px', 
          padding: 10, margin: 10, display: 'flex', flexDirection: 'row' }}>
          <div className="health-bar" style={{'--fill': (enemy.current_hp/enemy.HP)}}/>
          <div>
            <Spirit spirit={enemy} flashing={flashing[0]}/>
            <div className="spirit-stats">
              <p>
                <strong>{enemy.current_hp + enemy.hp_boost}</strong> /{enemy.HP} HP
              </p>
              {enemyBoost !== 1 && <p><strong>{enemyBoost}x</strong> ATK</p>}
              {flashing[0] > 0 && 
              <p className='popping-number damage' 
                style={{"--horizontal": `${enemyPopDist}%`, "--rotation": Math.sign(enemyPopDist)}}>
                {flashing[0] * -1}
              </p>}
              {flashing[0] < 0 && 
              <p className='popping-number heal' 
                style={{"--horizontal": `${enemyPopDist}%`, "--rotation": Math.sign(enemyPopDist)}}>
                +{flashing[0] * -1}
              </p>}
            </div>
          </div>
        </div>
        <div style={{ backgroundColor: '#f0f0f0', border: '1px solid #ccc', borderRadius: '5px', 
          padding: 10, margin: 10, display: 'flex', flexDirection: 'row' }}>
          <div className="health-bar" style={{'--fill': (spirit.current_hp/spirit.HP)}}/>
          <div>
            <Spirit spirit={spirit} flashing={flashing[1]}/>
            <div className="spirit-stats">
              <p>
                <strong>{spirit.current_hp + spirit.hp_boost}</strong> /{spirit.HP} HP
              </p>
              {myBoost !== 1 && <p><strong>{myBoost}x</strong> ATK</p>}
              {flashing[1] > 0 && 
              <p className='popping-number damage' 
                style={{"--horizontal": `${myPopDist}%`, "--rotation": Math.sign(myPopDist)}}>
                {flashing[1] * -1}
              </p>}
              {flashing[1] < 0 && 
              <p className='popping-number heal' 
                style={{"--horizontal": `${myPopDist}%`, "--rotation": Math.sign(myPopDist)}}>
                +{flashing[1] * -1}
              </p>}
            </div>
          </div>
          <section style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }}>
            <button disabled={battleOver} onClick={() => { this.selectMove('attack') }} id="attack-button">
              Attack</button>
            <button disabled={battleOver} onClick={() => { this.selectMove('meditate') }} id="meditate-button">
              Meditate</button>
            <button disabled={battleOver} onClick={() => { this.selectMove('dodge') }} id="dodge-button">
              Dodge</button>
            {canFlee && <button disabled={battleOver} onClick={ () => { this.selectMove('flee') } }>Flee</button>}
          </section>
        </div>
        {enemyPrevMove && myPrevMove !== 'flee' && <p style={{marginBottom: 0}}>Opponent used <strong>{enemyPrevMove}</strong></p>}
        {/* {myPrevMove && <p style={{fontSize: 12, marginTop: 0}}>You used <em>{myPrevMove}</em></p>} */}
        {!battleOver && (enemyPrevMove !== 'flee' && myPrevMove !== 'flee') && <>
          {!this.props.queued && <p>Select a move</p>}
          {this.props.queued && <Loader text={"Waiting for opponent's move"}/>}
        </>}
        {myPrevMove === 'flee' && <p>You successfully <strong>fled</strong></p>}
        {battleOver && <p>{(spirit.current_hp > 0) ? "You won!" : "You lost."}</p>}
      </>
    );
  }
}