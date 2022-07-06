import { Component } from "react";
import './Components.css';
import { ability_descriptions } from '../assets/abilities.js';

export default class StatsCard extends Component {
  render() {
    const abilities = [];
    for (let i = 0; i < this.props.spirit.abilities.length; i++) {
      abilities.push(
        <p key={`ability<${i}>`}>
          <strong>{this.props.spirit.abilities[i]}</strong><br />
          {ability_descriptions[this.props.spirit.abilities[i]]}
        </p>
      );
    }

    return (
      <section className={this.props.styleClass}>
        <br/>
        <h2>{this.props.spirit.name}</h2>
        <h3>({this.props.spirit.tier} tier){this.props.spirit.type && (" (" + this.props.spirit.type + " type)")}</h3>
        {abilities}
        <p>
          <span>
            <strong>HP:&nbsp;</strong>{this.props.spirit.HP}
            {this.props.spirit.hp_boost !== 0 && <>&nbsp;(<strong>+{this.props.spirit.hp_boost}</strong>)</>}
          </span>
          <span>
            <strong>ATK:&nbsp;</strong>{this.props.spirit.ATK}
            {this.props.spirit.dmg_boost !== 1 && <>&nbsp;(<strong>x{this.props.spirit.dmg_boost}</strong>)</>}
          </span>
          <span><strong>SPD:&nbsp;</strong>{this.props.spirit.speed}</span>
          <br/>
        </p>
        {this.props.showHealth &&
        <div className="health-bar horizontal" style={{ '--fill': (this.props.spirit.current_hp / this.props.spirit.HP) }}/>}
        <br/>
      </section>
    );
  }
}