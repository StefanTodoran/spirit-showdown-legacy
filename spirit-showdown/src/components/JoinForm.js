import { Component } from "react";
import Loader from "./Loader.js";
import './Components.css';

export default class LobbyForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lobby_id: null,
      lobby_name: null, // sent from server, null if fail or not submitted
      available: [],
      submitted: false,
      replied: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.refreshLobbies = this.refreshLobbies.bind(this);
  }

  componentDidMount() {
    this.refreshLobbies();
  }

  refreshLobbies() {
    this.props.socket.emit('get-lobbies', (lobbies) => {
      this.setState({ available: lobbies });
    });
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  handleSubmit(event) {
    if (this.state.lobby_id !== null) {
      this.joinLobby(this.state.lobby_id);
    }
    event.preventDefault();
  }

  joinLobby(lobby_id) {
    const callback = (lobby_id, lobby_name) => { // lobby name is null on fail
      this.setState({ replied: true, lobby_name: lobby_name, lobby_id: lobby_id });
      this.props.setLobbyCallback(lobby_id);
    };
    this.props.socket.emit('join-lobby', lobby_id, callback);
    this.setState({ submitted: true });
    this.refreshLobbies();
  }

  render() {
    const statusMessage = (this.state.lobby_name !== null) ? `Joined lobby ${this.state.lobby_name} (${this.state.lobby_id})` : `Failed to join lobby ${this.state.lobby_name} (${this.state.lobby_id})`;
    const lobbies = [];
    for (let i = 0; i < this.state.available.length; i++) {
      const lobby = this.state.available[i];
      lobbies.push(
        <>
          <span onClick={() => { this.joinLobby(lobby.id) }} className="server-listing">
            {lobby.name} ({lobby.players.length}/2)
          </span><br/>
        </>
      );
    }
    return (
      <>
        <fieldset disabled={(this.state.submitted) ? "disabled" : ""}>
          <form onSubmit={this.handleSubmit}>
            <label className="setting-label" htmlFor="lobby_id">Enter lobby id:</label><br/>
            <input type="text" name="lobby_id" onChange={this.handleChange} value={this.state.lobby_id}/><br/><br/>
            {!this.state.submitted &&
              <input id="submit-btn" type="submit" value="Join Lobby"/>}
          </form>
        </fieldset>
        {(this.state.submitted && !this.state.replied) && <Loader text={`Joining lobby with id: ${this.state.lobby_id}`}/>}
        {this.state.replied && <p>{statusMessage}</p>}
        <br/>
        <section style={{
           display: 'flex', 
           flexDirection: 'column',
           justifyContent: 'flex-start',
           alignItems: 'center' ,
           backgroundColor: '#f0f0f0',
           border: '1px solid #ccc',
           borderRadius: '5px',
           padding: '10px',
           margin: '10px',
          }}>
          {lobbies.length === 0 && <p>No lobbies found</p>}
          {lobbies.length > 0 && <p>{lobbies}</p>}
          <button onClick={ () => { this.refreshLobbies(); this.props.sound.play(); } }>Refresh</button>
          <br/>
        </section>
      </>
    );
  }
}