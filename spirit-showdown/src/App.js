import { Component } from 'react';
import Deck from './components/Deck';
import MultiplayerHandler from './components/MultiplayerHandler';

import './App.css';
import DemoBoard from './demo/DemoBoard';
import Spirit from './components/Spirit';
import { gameReadySpirit } from './components/spriteUtilities';

export class App extends Component {
  state = {
    // A deck is a list of spirit seeds, from which 
    // the actual spirits can be generated.
    deck: [], 
    prevDeck: [],

    page: 'build',
    started: false,

    buttonSound: new Audio(require('./assets/click.wav')),
  }

  componentDidMount() {
    this.buildNewDeck();
  }
  
  // Builds a new deck using the current time multiplyed by random 
  // noise as the seeds. Stores it to state and updates prevDeck.
  buildNewDeck = () => {
    const deck = [];
    for (let i = 0; i < 6; i++) {
      const seed = (new Date()).getTime() * Math.random();
      deck.push(seed);
    }
    this.setState({ deck: deck, prevDeck: this.state.deck });
  }

  // Takes a string of comma separated seeds and converts it to a deck.
  // The resulting deck is stored to state, and prevDeck is updated.
  buildFromSeed = (seeds) => {
    this.state.buttonSound.play();

    const deck = [];
    for (let i = 0; i < 6; i++) {
      deck.push(seeds[i]);
    }
    this.setState({ deck: deck, prevDeck: this.state.deck });
  }

  // Generates a string of comma separated seeds from the current deck
  // for easy pasting, and copies it to the clipboard. Displays a tooltip.
  saveDeck = () => {
    navigator.clipboard.writeText(this.state.deck);
    document.querySelector('.tooltip').classList.remove('hidden');
    setTimeout(() => {
      document.querySelector('.tooltip').classList.add('hidden');
    }, 1500);

    this.state.buttonSound.play();
  }

  // Seeds generated from saveDeck() should not have <>,(),[],: or / characters in them,
  // but we remove them here in case the user pastes something else in. Those characters
  // are used for game logic so it could break the game.
  loadDeck = () => {
    const seed = prompt('Enter the seed to load your deck: (must be at least 6 characters)')
      .replaceAll('<', '').replaceAll('>', '')
      .replaceAll('(', '').replaceAll(')', '')
      .replaceAll('[', '').replaceAll(']', '')
      .replaceAll(':', '').replaceAll('/', '');
    let seeds = seed.split(',');
    if (seeds.length < 6) {
      const size = Math.floor(seeds.length / 6);
      const parts_regex = new RegExp(`/.{1,${size}}/`);
      this.buildFromSeed(seed.match(parts_regex));
    } else {
      this.buildFromSeed(seeds);
    }
  }

  // Sets the state to the given page and plays the button sound effect.
  setPage(page) {
    this.state.buttonSound.play();
    this.setState({ page: page });
  }

  render() {
    let content;
    switch (this.state.page) {
      case 'build':
        content = () => {
          return(
            <>
              <div style={{display: 'flex', flexDirection: 'row', marginBottom: '1rem'}}>
                {this.state.prevDeck.length > 0 && 
                  <button onClick={ () => { this.buildFromSeed(this.state.prevDeck); }}>Previous deck</button>
                }
                <button onClick={ () => { this.buildNewDeck(); this.state.buttonSound.play(); }}>Create a new deck</button>

                <button onClick={this.saveDeck}>Save this deck<span className="tooltip hidden">Copied to<br/>Clipboard!</span></button>
                
                <button onClick={this.loadDeck}>Load saved deck</button>
                <hr className={"menu-hr"}/>
                <button onClick={ () => { this.setPage('play'); }}>Use this deck</button>
                <button onClick={ () => { this.setPage('how'); }}>How to play?</button>
              </div>
              <Deck deck={this.state.deck} display={true}/>
            </>
          );
        };
        break;
      case 'how':
        content = () => {
          return(
            <>
              <div style={{display: 'flex', flexDirection: 'row', marginBottom: '1rem'}}>
                <button onClick={() => { this.setPage('build'); }}>Back to deck select</button>
              </div>
              <h2>How to Play</h2>
              <p style={{maxWidth: "min(80vw, 400px)"}}>
                Spirit Showdown is a turn-based, two-player board game. The objective of the game is
                to maneuver your pieces (or spirits) to take over your opponent's spawn tiles.
              </p>
              <DemoBoard/>
              <p style={{maxWidth: "min(80vw, 400px)", marginTop: 40}}>
                Each turn, you get <strong>2</strong> actions. An action can either be deploying a
                spirit from your hand to one of your spawn tiles, or moving a spirit that is already
                on the board. 
                <br/><br/> 
                To move a spirit, select it by clicking on it, then click on the tile where you would 
                like it to go. Only certain spirits can go on water tiles or use portal tiles.
                <br/><br/> 
                When an enemy spirit is in the way, you will need to fight it. After selecting one
                of your spirits, click on an adjacent enemy spirit to begin combat. During each combat
                turn, both players select one of several moves, which are then executed at the same time
                (rock, paper, scissors style).
              </p>
              <div className="demo-buttons-container">
                <button id="demo-attack-button">Attack</button>
                <button id="demo-meditate-button">Meditate</button>
                <button id="demo-dodge-button">Dodge</button>
                <button id="demo-charge-button">Charge</button>
                <p className="demo-move-label"></p>
              </div>
              <p style={{maxWidth: "min(80vw, 400px)"}}>
                Each spirit has a set of abilities and 3 stats. The abilities come with helpful little
                descriptions which can be viewed by hovering the spirit. The 3 stats, are <strong>HP</strong>, 
                or the total amount of hit points a spirit has, <strong>DMG</strong>, or the amount of hit 
                points of damage a spirit deals per attack, and <strong>SPD</strong>, or the amount of turns 
                a spirit is KOed for before can be played again.
              </p>
              <Deck deck={[103141751262.48557,1303217234003.8604,1642128299815.441]} display={true}/>
              <p style={{maxWidth: "min(80vw, 400px)", paddingBottom: 80}}>
                That's all you need to get started. Get out there and have some fun!
              </p>
            </>
          );
        };
        break;
      default:
        content = () => {
          return(
            <>
              {!this.state.started &&
              <div style={{display: 'flex', flexDirection: 'row', marginBottom: '1rem'}}>
                <button onClick={() => { this.setPage('build'); }}>Back to deck select</button>
                {this.state.page === 'play' && <button onClick={() => { this.setPage('create'); }}>Create custom lobby</button>}
                {this.state.page === 'create' && <button onClick={() => { this.setPage('play'); }}>Join existing lobby</button>}
              </div>}
              <MultiplayerHandler page={this.state.page} deck={this.state.deck} sound={this.state.buttonSound}
                startedCallback={(started) => { this.setState({ started: started }) }}/>
            </>
          );
        };
        break;
    }

    return (
      <div className="App">
        <div style={{
          display: 'flex', flexDirection: 'row', 
          width: '95vw', justifyContent: 'center', alignItems: 'center',
        }}>
          <span style={{width: '50%', paddingRight: '5%'}}><hr/></span>
          <h1>Spirit&nbsp;Showdown</h1>
          <span style={{width: '50%', paddingLeft: '5%'}}><hr/></span>
        </div>
        {content()}
      </div>
    );
  }
}

export default App;
