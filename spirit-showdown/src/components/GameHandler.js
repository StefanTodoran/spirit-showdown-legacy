import { Component } from "react";
import Deck from "./Deck";
import GameBoard from "./GameBoard";
import SpiritBattle from "./SpiritBattle";
import Loader from './Loader.js';

let cards;

export default class GameHandler extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inBattle: false,
      selectedSpirit: null,
      selectedTile: null,
    };

    this.selectSpirit = this.selectSpirit.bind(this);
    this.selectTile = this.selectTile.bind(this);
  }

  componentDidMount() {
    cards = document.querySelectorAll('.tooltip-card');
    const setPositions = function(e) {
      for (let i = 0; i < cards.length; i++) {
        const bounds = cards[i].getBoundingClientRect();
        let x = e.clientX,
            y = e.clientY;
        cards[i].style.top = Math.min(window.innerHeight - bounds.height - 20, y + 25) + 'px';
        cards[i].style.left = Math.min(window.innerWidth - bounds.width - 20, x + 20) + 'px';

        if (y + 25 + bounds.height > window.innerHeight) {
          cards[i].style.top = y - 10 - bounds.height + 'px';
        }
      }
    };
    window.onmousemove = setPositions;
  }

  componentDidUpdate() {
    cards = document.querySelectorAll('.tooltip-card');
    if (this.props.gameState.battle) {
      if (this.props.gameState.battle.finished) {
        setTimeout(() => {
          this.setState({ inBattle: false });
        }, 3000);
      }

      if (!this.props.gameState.battle.finished && !this.state.inBattle) {
        this.setState({ inBattle: true });
      }
    }
  }

  // TODO: make this more robust
  sameSpirit(a, b) {
    return a.seed === b.seed && a.owner === b.owner;
  }

  // selects the provided spirit, unless it is already selected,
  // in which case it deselects the provided spirit leaving none selected
  selectSpirit(spirit) {
    if (spirit !== null) {
      if (this.state.selectedSpirit === null) {
        this.setState({ selectedSpirit: spirit });
      } else if (this.sameSpirit(spirit, this.state.selectedSpirit)) {
        this.setState({ selectedSpirit: null });
      } else if (this.state.selectedSpirit.owner === this.props.player_id && spirit.owner !== this.props.player_id) {
        this.props.beginBattleCallback(this.state.selectedSpirit, spirit);
        this.setState({ selectedSpirit: null });
      } else {
        this.setState({ selectedSpirit: spirit });
      }
    } else {
      this.setState({ selectedSpirit: null });
    }
    this.selectTile(null);
  }

  // selects the provided tile, unless it is already selected,
  // in which case it deselects the provided tile leaving none selected
  selectTile(tile_id) {
    if (this.state.selectedTile !== tile_id) {
      this.setState({
        selectedTile: tile_id,
      });
      if (this.state.selectedSpirit) {
        this.moveSpiritToTile(this.state.selectedSpirit, tile_id);
        this.selectSpirit(null);
      }
    } else {
      this.setState({
        selectedTile: null,
      });
    }
  }

  moveSpiritToTile(spirit, tile_id) {
    if (this.props.gameState.turn !== this.props.player_id) {
      this.selectSpirit(null);
      this.selectTile(null);
    } else {
      if (spirit !== null && tile_id !== null) {
        this.props.doMoveCallback(spirit, tile_id);
        // Deselect after move attempt
        this.selectSpirit(null);
        this.selectTile(null);
      }
    }
  }

  render() {
    const hand = (this.props.player_id === this.props.gameState.player_one) ? this.props.gameState.player_one_hand : this.props.gameState.player_two_hand;
    const actions = () => {
      if (this.props.gameState.actions.length === 0) {
        return "Two actions remaining";
      } else {
        return "One action remaining";
      }
    }
    
    return (
      <>
        {!this.state.inBattle && <>
          <GameBoard 
            selectTileCallback={this.selectTile} selectSpiritCallback={this.selectSpirit}
            selectedTile={this.state.selectedTile} selectedSpirit={this.state.selectedSpirit}
            tiles_board={this.props.gameState.tiles_board}
            spirits_board={this.props.gameState.spirits_board}
            player={this.props.player_id}
            flipped={this.props.player_id !== this.props.gameState.player_one}
            winner={this.props.gameState.winner}
          />
          <Deck 
            deck={hand}
            graveyard={this.props.gameState.graveyard}
            selectCallback={this.selectSpirit}
            selected={this.state.selectedSpirit}
            player={this.props.player_id}
            display={false}
          />
          {this.props.gameState.turn === this.props.player_id && 
          <>
            <p style={{textAlign: "center"}}>
              Your turn to play<br/>
              {actions()}
            </p>
          </>
          }
          {this.props.gameState.turn !== this.props.player_id && <Loader text={"Waiting for opponent's move"}/>}
        </>}
        {this.state.inBattle && <>
          <SpiritBattle
            battle={this.props.gameState.battle}
            battleMoveCallback={this.props.doBattleMoveCallback}
            queued={this.props.battleMoveQueued} events={this.props.battleEvents}
            player_one={this.props.player_id === this.props.gameState.player_one}
          />
        </>}
      </>
    );
  }
}