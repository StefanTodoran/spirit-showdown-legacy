import { Component } from "react";
import Loader from "./Loader.js";

export default class LobbyForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      access: 'public', 
      name: `Lobby ${Math.floor(Math.random()*10000)}`,
      lobby_id: null,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillUnmount() {
    this.props.leaveLobbyCallback();
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  handleSubmit(event) {
    const callback = (lobby_id) => {
      this.setState({ lobby_id: lobby_id });
      this.props.setLobbyCallback(lobby_id);
    };
    this.props.socket.emit('create-lobby', this.state.name, this.state.access, callback);
    event.preventDefault();
  }

  render() {
    return (
      <>
        <fieldset disabled={(this.state.lobby_id === null) ? "" : "disabled"}>
          <form onSubmit={this.handleSubmit}>
            <label className="setting-label" htmlFor="name">Lobby name:</label><br/>
            <input type="text" name="name" onChange={this.handleChange} value={this.state.name}/><br/><br/>
            <label className="setting-label" htmlFor="access">Set accessibility:</label><br/>
            <span>
              <input type="radio" id="public" name="access" value="public" onChange={this.handleChange} defaultChecked={true}/>
              <label htmlFor="public">Public</label><br/>
              <input type="radio" id="private" name="access" value="private" onChange={this.handleChange}/>
              <label htmlFor="private">Join by id ONLY</label><br/>
            </span><br/>
            {this.state.lobby_id === null &&
              <input id="submit-btn" type="submit" value="Create Lobby"/>}
          </form>
        </fieldset>
        {this.state.lobby_id !== null && <Loader text={`Lobby created with id: ${this.state.lobby_id}|Waiting for opponent`}/>}
        <br/>
        <p style={{maxWidth: "min(80vw, 400px)"}}>
          HOW IT WORKS: <br/>
          Public lobbies will be visible to anyone looking for opponents on the 
          matchmaking page. Join by id lobbies will not be visible, and can only be joined by 
          clicking 'Join lobby by id', then, entering the id # given during lobby creation.
        </p>
      </>
    );
  }
}