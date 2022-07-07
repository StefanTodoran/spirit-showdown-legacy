import { Component } from "react";
import { ability_descriptions } from '../assets/abilities.js';
import './Components.css';
import { activeEffect } from "./spriteUtilities.js";

export default class StatsCard extends Component {
  render() {
    const abilities = [];
    for (let i = 0; i < this.props.spirit.abilities.length; i++) {
      const active = activeEffect(this.props.spirit, this.props.spirit.abilities[i]);
      abilities.push(
        <p key={`ability<${i}>`}>
          <strong>{this.props.spirit.abilities[i]}</strong>{active && " (active)"}<br />
          {ability_descriptions[this.props.spirit.abilities[i]]}
        </p>
      );
    }

    const effects = [];
    if (this.props.showEffects) {
      for (let i = 0; i < this.props.spirit.effects.length; i++) {
        const effect = this.props.spirit.effects[i];
        if (effect.duration) {
          effects.push(<p key={`effect<${i}>`}><strong>{effect.effect}</strong>&nbsp;({effect.duration} turns)</p>);
        }
      }
    }

    return (
      <section className={this.props.styleClass}>
        <h2 style={{paddingTop: '1rem'}}>{this.props.spirit.name}</h2>
        <h3>({this.props.spirit.tier} tier){this.props.spirit.type && (" (" + this.props.spirit.type + " type)")}</h3>
        {abilities}
        {effects.length > 0 && <p style={{textAlign: 'center'}}>{effects}</p>}
        <p style={{
          paddingBottom: '1rem',
          ...(this.props.horizontalStats && {display: 'flex', flexDirection: 'row' , justifyContent: 'space-between'}),
        }}>
          <span>
            <strong>HP:&nbsp;</strong>
            {this.props.spirit.current_hp === this.props.spirit.HP ? this.props.spirit.HP : `${this.props.spirit.current_hp} / ${this.props.spirit.HP}`}
            {this.props.spirit.hp_boost !== 0 && <>&nbsp;(<strong>+{this.props.spirit.hp_boost}</strong>)</>}
          </span>
          <span>
            <strong>ATK:&nbsp;</strong>{this.props.spirit.ATK}
            {this.props.spirit.dmg_boost !== 1 && <>&nbsp;(<strong>x{this.props.spirit.dmg_boost}</strong>)</>}
          </span>
          <span>
            <strong>SPD:&nbsp;</strong>{this.props.spirit.speed}
          </span>
        </p>
        {this.props.showHealth &&
        <div className="health-bar horizontal" style={{ '--fill': (this.props.spirit.current_hp / this.props.spirit.HP), marginBottom: '1rem' }}/>}
      </section>
    );
  }
}