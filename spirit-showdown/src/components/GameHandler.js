import { Component } from "react";
import Deck from "./Deck";
import GameBoard from "./GameBoard";

export default class GameHandler extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSpirit: null,
      selectedTile: null,
    };

    this.selectSpirit = this.selectSpirit.bind(this);
    this.selectTile = this.selectTile.bind(this);
  }

  // selects the provided spirit, unless it is already selected,
  // in which case it deselects the provided spirit leaving none selected
  selectSpirit(spirit_id) {
    if (this.state.selectedSpirit !== spirit_id) {
      this.setState({
        selectedSpirit: spirit_id,
      });
    } else {
      this.setState({
        selectedSpirit: null,
      });
    }
  }

  // selects the provided tile, unless it is already selected,
  // in which case it deselects the provided tile leaving none selected
  selectTile(tile_id) {
    if (this.state.selectedTile !== tile_id) {
      this.setState({
        selectedTile: tile_id,
      });
      this.moveSpiritToTile(this.state.selectedSpirit, tile_id);
    } else {
      this.setState({
        selectedTile: null,
      });
    }
  }

  moveSpiritToTile(spirit_id, tile_id) {
    if (this.props.gameState.turn !== this.props.player_id) {
      this.selectSpirit(null);
      this.selectTile(null);
      console.log("not my turn"); // implement visual feedback for user
    } else {
      if (spirit_id !== null && tile_id !== null) {
        this.props.doMoveCallback(spirit_id, tile_id);
        // Deselect after move attempt
        this.selectSpirit(null);
        this.selectTile(null);
      }
    }
  }

  render() {
    const hand = (this.props.player_id === this.props.gameState.player_one) ? this.props.gameState.player_one_hand : this.props.gameState.player_two_hand;
    return (
      <>
        <GameBoard 
          selectTileCallback={this.selectTile} selectSpiritCallback={this.selectSpirit}
          selectedTile={this.state.selectedTile} selectedSpirit={this.state.selectedSpirit}
          tiles_board={this.props.gameState.tiles_board}
          spirits_board={this.props.gameState.spirits_board}
          player={this.props.player_id}
          flipped={this.props.player_id !== this.props.gameState.player_one}
        />
        <Deck 
          deck={hand}
          selectCallback={this.selectSpirit}
          selected={this.state.selectedSpirit}
          player={this.props.player_id}
          display={false} 
        />
      </>
    );
  }
}