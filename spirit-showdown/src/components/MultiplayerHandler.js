import { Component } from 'react';
import { io } from 'socket.io-client';

import LobbyForm from './LobbyForm';
import JoinForm from './JoinForm';

import Loader from './Loader.js';
import GameHandler from './GameHandler';

// This class handles most functionality of the site after the use deck button 
// has been clicked. It first displays either the JoinForm or LobbyForm pages,
// and handles the socket connection used for both of those and the GameHandler.
// Once a lobby has been joined, the GameHandler is displayed and that component
// handles most interactions from then on, although it uses callbacks to communicate
// to the server.
export default class MultiplayerHandler extends Component {
  constructor(props) {
    super(props);
    this.state = {
      connected: false,
      socket: null,

      lobby_id: null,
      player_id: null,
      game_state: null,
    
      battle_move_queued: false,
      battle_events: null,
    };

    this.setLobbyId = this.setLobbyId.bind(this);
    this.leaveLobbyCreation = this.leaveLobbyCreation.bind(this);
    this.doMove = this.doMove.bind(this);
    this.doBattleMove = this.doBattleMove.bind(this);
    this.beginBattle = this.beginBattle.bind(this);
  }

  componentDidMount() {
    const callback = (player_id) => {
      this.setState({ player_id: player_id });
    };

    const socket = io.connect('http://localhost:8080');
    // const socket = io.connect('192.168.0.174:8080');
    socket.on('connect', () => {
      socket.emit('get-player-id', callback);

      setTimeout(() => {
        this.setState({
          connected: true,
          socket: socket,
        });
      }, 750); // otherwise it flashes too fast on good connections, looks wack
    });

    socket.on('start-game', () => {
      socket.emit('provide-deck', this.props.deck, this.state.lobby_id);
      this.props.startedCallback(); // informs parent to remove menu buttons
    });

    socket.on('init-game-state', (game_state) => {
      this.setState({ game_state: game_state });
    });

    socket.on('turn-update', (game_state) => {
      this.setState({ game_state: game_state });
    });

    socket.on('battle-update', (game_state, battle_events) => {
      this.setState({ game_state: game_state, battle_events: battle_events, battle_move_queued: false });
      setTimeout(() => {
        this.setState({ battle_events: null });
      }, 750);
    });

    socket.on('turn-update:battle+move', (game_state) => {
      const battle = game_state.battle;
      game_state.battle = null;
      this.setState({ game_state: game_state });
      setTimeout(() => {
        game_state.battle = battle;
        this.setState({ game_state: game_state });
      }, 3000);
    });
  }

  // Used as a callback by JoinForm and LobbyForm to set the lobby_id
  // that the player is in. The socket emitting to the server is handled
  // by the child components.
  setLobbyId(lobby_id) {
    this.setState({ lobby_id: lobby_id });
  }

  // Used by LobbyForm when it is unmounting to leave the lobby if the
  // player created one but did not follow through.
  leaveLobbyCreation() {
    if (!this.state.game_state && this.state.lobby_id !== null) {
      this.state.socket.emit('exit-lobby', this.state.lobby_id);
      this.setState({ lobby_id: null });
    }
  }

  // Used by GameHandler to send a move to the server.
  doMove(spirit, tile) {
    this.state.socket.emit('do-spirit-move', spirit, tile, this.state.lobby_id);
  }

  doBattleMove(move) {
    this.setState({ battle_move_queued: true });
    this.state.socket.emit('do-battle-move', move, this.state.lobby_id);
  }

  beginBattle(spirit, enemy) {
    this.state.socket.emit('begin-battle', spirit, enemy, this.state.lobby_id);
  }

  render() {
    // Page is set by App, the parent component since the navbar is there.
    const page = (this.props.page === 'create') 
      ? <LobbyForm socket={this.state.socket} setLobbyCallback={this.setLobbyId} leaveLobbyCallback={this.leaveLobbyCreation}/>
      : <JoinForm socket={this.state.socket} setLobbyCallback={this.setLobbyId}/>;
    
    return (
      <>
        {!this.state.connected && <Loader text={'Connecting to server'}/>}
        {!this.state.game_state && this.state.connected && <>{page}</>}
        {this.state.game_state && 
          <>
            <GameHandler 
              deck={this.props.deck} player_id={this.state.player_id}
              doMoveCallback={this.doMove} doBattleMoveCallback={this.doBattleMove}
              beginBattleCallback={this.beginBattle}
              battleMoveQueued={this.state.battle_move_queued}
              gameState={this.state.game_state} battleEvents={this.state.battle_events}
            />
          </>
        }
      </>
    )
  }
}