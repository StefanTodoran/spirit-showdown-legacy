import { Component } from 'react';

import Deck from './components/Deck';
import MultiplayerHandler from './components/MultiplayerHandler';

import './App.css';

export class App extends Component {
  state = {
    // A deck is a list of spirit seeds, from which 
    // the actual spirits can be generated.
    deck: [], 
    prevDeck: [],

    page: 'build',
    started: false,
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
    const deck = [];
    for (let i = 0; i < 6; i++) {
      deck.push(seeds[i]);
    }
    this.setState({ deck: deck, prevDeck: this.state.deck });
  }

  // Generates a string of comma separated seeds from the current deck
  // for easy pasting, and copies it to the clipboard. Displays a tooltip.
  saveDeck = () => {
    navigator.clipboard.writeText(this.state.seed);
    document.querySelector('.tooltip').classList.remove('hidden');
    setTimeout(() => {
      document.querySelector('.tooltip').classList.add('hidden');
    }, 1500);
  }

  // Seeds generated from saveDeck() should not have <>,(), or [] characters in them,
  // but we remove them here in case the user pastes something else in. Those characters
  // are used for game logic so it could break the game.
  loadDeck = () => {
    const seed = prompt('Enter the seed to load your deck: (must be at least 6 characters)')
      .replaceAll('<', '').replaceAll('>', '')
      .replaceAll('(', '').replaceAll(')', '')
      .replaceAll('[', '').replaceAll(']', '');
    let seeds = seed.split(', ');
    if (seeds.length < 6) {
      const size = Math.floor(seeds.length / 6);
      const parts_regex = new RegExp(`/.{1,${size}}/`);
      this.buildFromSeed(seed.match(parts_regex));
    } else {
      this.buildFromSeed(seeds);
    }
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
                <button onClick={this.buildNewDeck}>Create a new deck</button>

                <button onClick={this.saveDeck}>Save this deck</button>
                <span className="tooltip hidden">Copied to Clipboard!</span>
                
                <button onClick={this.loadDeck}>Load saved deck</button>
                <hr className={"menu-hr"}/>
                <button onClick={() => { this.setState({ page: 'play' }); }}>Use this deck</button>
              </div>
              <Deck deck={this.state.deck} display={true}/>
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
                <button onClick={() => { this.setState({ page: 'build' }); }}>Back to deck select</button>
                {this.state.page === 'play' && <button onClick={() => { this.setState({ page: 'create' }); }}>Create custom lobby</button>}
                {this.state.page === 'create' && <button onClick={() => { this.setState({ page: 'play' }); }}>Join existing lobby</button>}
              </div>}
              <MultiplayerHandler page={this.state.page} deck={this.state.deck} 
                startedCallback={() => { this.setState({ started: true }) }}/>
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
