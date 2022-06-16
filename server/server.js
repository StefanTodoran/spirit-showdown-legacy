const io = require('socket.io')(8080, {
  cors: {
    origin: ["http://localhost:3000"],
  },
});

const tiles_board = [
  ['wall','portal','wall','wall','p2-spawn','wall','wall','wall','wall','p2-spawn','wall','wall',],
  ['wall','none','wall','none','none','none','none','none','none','none','none','wall',],
  ['wall','none','none','none','wall','wall','wall','none','none','none','none','wall',],
  ['wall','water','water','wall','wall','none','none','none','wall','water','water','wall',],
  ['wall','water','water','wall','none','none','none','wall','wall','water','water','wall',],
  ['wall','none','none','none','none','wall','wall','wall','none','none','none','wall',],
  ['wall','none','none','none','none','none','none','none','none','wall','none','wall',],
  ['wall','wall','p1-spawn','wall','wall','wall','wall','p1-spawn','wall','wall','portal','wall',],
];
const spirits_board = [
  ['','','','','','','','','','','','',],
  ['','','','','','','','','','','','',],
  ['','','','','','','','','','','','',],
  ['','','','','','','','','','','','',],
  ['','','','','','','','','','','','',],
  ['','','','','','','','','','','','',],
  ['','','','','','','','','','','','',],
  ['','','','','','','','','','','','',],
];

// NOT an actual deep copy, but since we just need to use it for objects that contain
// numbers and strings, it should be ok. BE WARNED: THIS FUNCTION IS DANGEROUS!
function fakeDeepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// Iterates over each item in a list, turning each element into a string.
function stringifyList(list) {
  for (let i = 0; i < list.length; i++) {
    list[i] = String(list[i]);
  }
}

// removes the given item from the list
function remove(list, item) {
  const pos = list.indexOf(item);
  return list.splice(pos,  1);
}

// TODO:
// Replace this with writing to a file or sql database.
// When this is implemented, some kind of garbage cleanup for
// dead lobbies will also need to be implemented.
var lobbies = {};

// This function creates a new id that starts with some letters
// and ends with some digits. It will return a lobby id that does not
// exist in `lobbyIDs`. If it has failed to generate a novel id MAX_DEPTH
// times, it will return null. This does not mean the entire id namespace is filled.
function createNovelID(letters, numbers, depth) {
  const MAX_DEPTH = 5;
  let id = '';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let i = 0; i < letters; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  for (let i = 0; i < numbers; i++) {
    id += parseInt(Math.floor(Math.random() * 10));
  }
  if (id in lobbies) {
    return (depth < MAX_DEPTH) ? createNovelID(letters, numbers, depth + 1) : null;
  } else {
    return id;
  }
}

function createGameObj(players) {
  const firstPlayer = players[Math.floor(Math.random() * players.length)];
  const secondPlayer = players[(players.indexOf(firstPlayer) + 1) % players.length];

  // TODO:
  // This game state will be passed back and form between the server
  // and the clients many times throughout the the course of a game.
  // 
  // To minimize the amount of data being passed back and forth, stuff
  // that will not change (e.g. player_one, player_two, and their decks)
  // should be factored out into a different object that will only be sent
  // one time.
  //
  // Another potential future optimization could be to only send back the 
  // moves that successfully occur, rather than the entire board.
  const game = {
    turn: firstPlayer,
    tiles_board: fakeDeepCopy(tiles_board),
    spirits_board: fakeDeepCopy(spirits_board),

    player_one: firstPlayer,
    player_two: secondPlayer,
    
    player_one_deck: null, // deck is spirits they have, hand is spirits not in play
    player_two_deck: null, // deck never changes, hand starts off as deck but cards are played (removed)
    
    player_one_hand: [],
    player_two_hand: [],

    player_one_graveyard: {},
    player_two_graveyard: {},
  }
  return game;
}

function createLobby(id, name, access, socket) {
  const lobby = {
    id: id,
    name: name,
    public: (access === 'public'),
    players: [],
    game: null,
  }
  lobbies[id] = lobby;
  joinLobby(id, socket);
  return lobby;
}

function joinLobby(id, socket) {
  const lobby = lobbies[id];
  if (validLobby(lobby) && lobby.players.length < 2) {  
    lobby.players.push(socket.id);
    socket.join(id);
    return lobby;
  } else {
    return null; // fail, lobby full
  }
}

// Removes socket from lobby with given id.
// If the lobby is now empty, it is deleted.
function exitLobby(id, socket) {
  const lobby = lobbies[id];
  if (validLobby(lobby)) {
    remove(lobby.players, socket.id);
    socket.leave(id);
    if (lobby.players.length === 0) {
      lobbies[id] = null;
      // We set it to null to be safe. I would just
      // delete it, but it is unclear if that is good practice.
      // TODO: investigate
    }
    return true;
  }
  return false;
}

// Given a list of lobby ids, returns those which are public.
function publicLobbies(list) {
  const public = [];
  for (let id in list) {
    const lobby = list[id];
    if (validLobby(lobby) && lobby.public) {
      public.push(lobby);
    }
  }
  return public;
}

// Given a list of lobby ids, returns those which are not yet full.
function nonFullLobbies() {
  const nonFull = [];
  for (let id in lobbies) {
    const lobby = lobbies[id];
    if (validLobby(lobby) && lobby.players.length < 2) {
      nonFull.push(lobby);
    }
  }
  return nonFull;
}

function validLobby(lobby) {
  return lobby !== undefined && lobby !== null;
}

/* ===== ============== ===== */
/* GAME LOGIC RELATED HELPERS */

// Changes the turn of the game to the player whose turn it is currently not.
function turnChange(game) {
  game.turn = (game.turn === game.player_one) ? game.player_two : game.player_one;
}

// Given some 'tile<x,y>' this will return ['x,y', 'x', 'y']
function tilePosition(tile) {
  const pos_regex = /(\d+),(\d+)/;
  return tile.match(pos_regex);
}

// Given a board and position, returns the type of the tile at that position.
function tileType(game, tile) {
  const pos = tilePosition(tile);
  return game.tiles_board[pos[1]][pos[2]];
}

// Returns true if no spirits occupy the given tile and false otherwise.
function tileEmpty(game, tile) {
  const pos = tilePosition(tile);
  return game.spirits_board[pos[1]][pos[2]] === '';
}

// Sets the occupant of the give tile to the given spirit.
function setTileOccupant(game, tile, spirit) {
  const pos = tilePosition(tile);
  game.spirits_board[pos[1]][pos[2]] = spirit;
}

function tileWithinDistance(tile_A, tile_B, distance) {
  const pos_A = tilePosition(tile_A);
  const pos_B = tilePosition(tile_B);
  const x_diff = Math.abs(pos_A[1] - pos_B[1]);
  const y_diff = Math.abs(pos_A[2] - pos_B[2]);
  return x_diff + y_diff <= distance;
}

/* END GAME LOGIC HELPERS SECTION */
/* ===== ================== ===== */

io.on('connection', (socket) => {
  /*DEBUG*/ console.log("Initiated connection, id:" + socket.id);

  // Creates a new lobby (room) and adds the calling socket to it.
  socket.on('create-lobby', (lobby_name, access_setting, callback) => {
    console.log(socket.id + " > Creating lobby with name: " + lobby_name + " and access: " + access_setting);
    
    const lobby_id = createNovelID(4, 4, 0);
    if (lobby_id !== null) { // got a new lobby
      /*DEBUG*/ console.log(socket.id + " > Successfully created lobby with id: " + lobby_id);
      createLobby(lobby_id, lobby_name, access_setting, socket);
      callback(lobby_id);
    }
    /*DEBUG*/ console.log("DEBUG > ALL LOBBIES INFO: ", lobbies);
  });
  
  // Adds the calling socket to the provided lobby, then, if the lobby
  // now has two players, starts the game. Removes the player from any other 
  // lobbies they may mistakenly still be in.
  socket.on('join-lobby', (lobby_id, callback) => {
    /*DEBUG*/ console.log(socket.id + " > Joining lobby with id: " + lobby_id);

    const lobby = joinLobby(lobby_id, socket);
    callback(lobby_id, (lobby === null) ? null : lobby.name);
    if (validLobby(lobby) && lobby.players.length === 2) {
      const game = createGameObj(lobby.players);
      lobby.game = game;
      io.in(lobby_id).emit('start-game');
    }

    /*DEBUG*/ console.log("DEBUG > ALL LOBBIES INFO: ", lobbies);
  });

  // Removes the player (socket) from the lobby (room).
  socket.on('exit-lobby', (lobby_id) => {
    /*DEBUG*/ console.log(socket.id + " > Exiting lobby with id: " + lobby_id);

    exitLobby(lobby_id, socket);

    /*DEBUG*/ console.log("DEBUG > ALL LOBBIES INFO: ", lobbies);
  });

  // Returns a list of all public lobbies.
  socket.on('get-lobbies', (callback) => {
    /*DEBUG*/ console.log(socket.id + " > Requesting lobbies");
    const joinable = nonFullLobbies(publicLobbies(lobbies));
    callback(joinable);
  });

  // Returns the id of the socket calling this function,
  // since we keep track of players by socket id.
  socket.on('get-player-id', (callback) => {
    /*DEBUG*/ console.log(socket.id + " > Requesting their player id");
    callback(socket.id);
  });

  // Should be called by the client upon recieving the callback
  // from 'start-game'. Used to update the lobby's game object.
  socket.on('provide-deck', (deck, lobby_id) => {
    /*DEBUG*/ console.log(socket.id + " > Provided deck for game init");

    const lobby = lobbies[lobby_id];
    if (!validLobby(lobby)) {
      return; // TODO: handle error better
    }

    const game = lobby.game;
    if (game.player_one === socket.id) {
      game.player_one_deck = fakeDeepCopy(deck);
      stringifyList(game.player_one_deck);
      game.player_one_hand = fakeDeepCopy(deck);
      stringifyList(game.player_one_hand);
    } else if (game.player_two === socket.id) {
      game.player_two_deck = fakeDeepCopy(deck);
      stringifyList(game.player_two_deck);
      game.player_two_hand = fakeDeepCopy(deck);
      stringifyList(game.player_two_hand);
    }

    // Once we have both player's decks, we can reply with the initial game state.
    if (game.player_one_deck && game.player_two_deck) {
      io.in(lobby_id).emit('init-game-state', game);
    }
  });

  // Handles a player's move. Checks game logic server side, then
  // returns the updated game state to the client, or uses the failure callback.
  socket.on('do-spirit-move', (spirit, tile, lobby_id, callback) => {
    /*DEBUG*/ console.log(socket.id + " > Doing spirit move: " + spirit + " to tile: " + tile);

    const lobby = lobbies[lobby_id];
    if (!validLobby(lobby)) {
      callback(false, null); // TODO: handle error better
    }
    
    const game = lobby.game;
    if (!(game.turn === socket.id)) {
      callback(false, game);
    }

    const seed_regex = /(?<=\[)(.*?)(?=\])/; // Grabs everything between [ and ], not including [ and ]
    const pos_regex = /(?<=\<)(.*?)(?=\>)/; // Grabs everything between < and >, not including < and >

    // First, we figure out if this is a spirit being deployed from
    // the players hand, or simply moving on the board.

    const pos = spirit.match(pos_regex)[0];
    const seed = String(spirit.match(seed_regex)[0]);
    if (pos !== '') {
      // This means the spirit is on the board. The next step is therefore
      // to check if the move is valid, e.g. within range & to a walkable tile.

      const tile_type = tileType(game, tile);
      const spirit_tile = `tile<${pos}>`;

      if (tile_type !== 'wall' && tileWithinDistance(spirit_tile, tile, 2)) {
        setTileOccupant(game, spirit_tile, '');
        setTileOccupant(game, tile, `spirit(${game.turn})[${seed}]<${tilePosition(tile)[0]}>`);
        turnChange(game);
        io.in(lobby_id).emit('turn-update', game);
      }
    } else {
      // We set hand to the hand of the player who is doing a move.
      // Since it will just point to that hand, modifying it modifies the original.
      let hand;
      if (game.turn === game.player_one) {
        hand = game.player_one_hand;
      } else if (game.turn === game.player_two) {
        hand = game.player_two_hand;
      }

      // Now we must make sure the spirit is actually in their hand
      if (hand.includes(seed)) {
        remove(hand, seed);

        const tile_type = tileType(game, tile);
        const required = (game.turn === game.player_one) ? 'p1-spawn' : 'p2-spawn';

        // Spirits can only be played to the spawn tiles and those tiles must be empty.
        if (tile_type === required && tileEmpty(game, tile)) {
          setTileOccupant(game, tile, `spirit(${game.turn})[${seed}]<${tilePosition(tile)[0]}>`);
          turnChange(game);
          io.in(lobby_id).emit('turn-update', game);
        }
      }
    }
  });
});
