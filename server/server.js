import { createRandomSpirit } from './spiritGeneration.js';

import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000"],
  },
});

/* ===== ===== ===== */
const tiles_boards = [
  [
    ['wall','portal','wall','wall','p2-spawn','wall','wall','wall','wall','p2-spawn','wall','wall',],
    ['wall','none','wall','none','none','none','none','none','none','none','none','wall',],
    ['wall','none','none','none','wall','wall','wall','none','none','none','none','wall',],
    ['wall','water','water','wall','none','none','none','none','none','water','water','wall',],
    ['wall','water','water','none','none','none','none','none','wall','water','water','wall',],
    ['wall','none','none','none','none','wall','wall','wall','none','none','none','wall',],
    ['wall','none','none','none','none','none','none','none','none','wall','none','wall',],
    ['wall','wall','p1-spawn','wall','wall','wall','wall','p1-spawn','wall','wall','portal','wall',],
  ],
  [
    ['wall','portal','portal','wall','water','water','water','wall','wall','p2-spawn','wall','wall',],
    ['wall','none','none','none','water','water','water','none','none','none','none','wall',],
    ['wall','none','wall','none','none','wall','none','none','none','none','none','p2-spawn',],
    ['wall','none','wall','none','wall','none','none','none','none','wall','none','wall',],
    ['wall','none','wall','none','none','none','none','wall','none','wall','none','wall',],
    ['p1-spawn','none','none','none','none','none','wall','none','none','wall','none','wall',],
    ['wall','none','none','none','none','water','water','water','none','none','none','wall',],
    ['wall','wall','p1-spawn','wall','wall','water','water','water','wall','portal','portal','wall',],
  ],
  [
    ['wall','p2-spawn','wall','wall','wall','wall','wall','wall','wall','wall','p2-spawn','wall',],
    ['wall','none','none','none','none','water','water','none','none','none','none','wall',],
    ['wall','none','none','wall','none','wall','water','none','none','none','none','wall',],
    ['portal','none','none','none','none','wall','water','none','none','wall','wall','wall',],
    ['wall','wall','wall','none','none','water','wall','none','none','none','none','portal',],
    ['wall','none','none','none','none','water','wall','none','wall','none','none','wall',],
    ['wall','none','none','none','none','water','water','none','none','none','none','wall',],
    ['wall','p1-spawn','wall','wall','wall','wall','wall','wall','wall','wall','p1-spawn','wall',],
  ],
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

const BOARD_WIDTH = spirits_board[0].length;
const BOARD_HEIGHT = spirits_board.length;
/* ===== ===== ===== */

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
    tiles_board: fakeDeepCopy(tiles_boards[Math.floor(Math.random()*tiles_boards.length)]),
    spirits_board: fakeDeepCopy(spirits_board),

    battle: null, 
    // When the battle object is null, the client will know to display
    // the battle screen. This object should have a structure as follows:
    // game.battle = {
    //   initiator: game.player_one, <-- the player who started combat, only they can flee
    //   player_one_spirit: `spirit(${game.player_one})[${487728996579.8983}]<3,1>:500`,
    //   player_two_spirit: `spirit(${game.player_two})[${748118784003.3025}]<3,2>:400`,
    //   player_one_move: null, <-- moves are executed at the same time, so we wait for both
    //   player_two_move: null, <-- players to queue up their moves for each battle turn.
    //   player_one_prev: null,
    //   player_two_prev: null, <-- the previous move that was executed.
    // }

    player_one: firstPlayer,
    player_two: secondPlayer,
    
    player_one_deck: null, // deck is spirits they have, hand is spirits not in play
    player_two_deck: null, // deck never changes, hand starts off as deck but cards are played (removed)
    
    player_one_hand: [],
    player_two_hand: [],

    graveyard: {
      spirits: [],
      cooldowns: [],
    },
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
  const public_list = [];
  for (let id in list) {
    const lobby = list[id];
    if (validLobby(lobby) && lobby.public) {
      public_list.push(lobby);
    }
  }
  return public_list;
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



/* ===== ======== ===== */
/* GAME LOGIC FUNCTIONS */
/* ===== ======== ===== */



/* = TILE LOGIC HELPERS = */
// Simple helper shorthand to check if an x,y position is within the board array.
function validPosition(y, x) {
  return x >= 0 && x < BOARD_WIDTH && y >= 0 && y < BOARD_HEIGHT;  
}

// Given some 'tile<x,y>' this will return ['x,y', 'x', 'y']
// Finds digits seperaterd by a comma inside some < >
function tilePosition(tile) {
  const pos_regex = /(?<=\<)(-*\d+),(-*\d+)(?=\>)/;
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

// Returns true if (moving only horizontally and vertically) the second tile can be reached
// from the first in 'distance' or less steps. Passing 'true' to 'square' means diagonal moves
// count as one step.
function tileWithinDistance(tile_A, tile_B, distance, square) {
  const pos_A = tilePosition(tile_A);
  const pos_B = tilePosition(tile_B);
  if (square) {
    return Math.max(Math.abs(pos_A[1] - pos_B[1]), Math.abs(pos_A[2] - pos_B[2])) <= distance;
  } else {
    return Math.abs(pos_A[1] - pos_B[1]) + Math.abs(pos_A[2] - pos_B[2]) <= distance;
  }
}

// Mirrors a tile across the center of the board both vertically and horizontally.
function mirrorTile(board, tile) {
  const pos = tilePosition(tile);
  return `board-tile<${board.length - pos[1] - 1},${board[0].length - pos[2] - 1}>`;
}
/* = TILE LOGIC HELPERS = */



/* = SPIRIT LOGIC HELPERS = */
// All spirit logic helpers which deal with the spirit tag take some spirit tag of the 
// form 'spirit(player_id)[seed]<board_pos>:hp' and return part of it. Behavior is unspecified
// if the tag is invalid.

// Return the spirit's seed as a string.
function spiritSeed(spirit_id) {
  const seed_regex = /(?<=\[)(.*?)(?=\])/; // Grabs everything between [ and ], not including [ and ]
  return String(spirit_id.match(seed_regex)[0]);
}

// Returns the spirit's owner's player id as a string.
function spiritOwner(spirit_id) {
  const player_regex = /(?<=\()(.*?)(?=\))/; // Grabs everything between ( and ), not including ( and )
  return String(spirit_id.match(player_regex)[0]);
}

// Returns the spirit's current HP parsed as an integer.
function spiritHP(spirit_id) {
  const hp_regex = /:\d+/ // Matches the part at the end of a spirit tag of the format :###
  return parseInt(spirit_id.match(hp_regex)[0].slice(1));
}

// Creates a spirit tag with the provided parameters. Passing null or undefined for any of the
// parameters result in the value in the provided spirit tag being used. If all are being replaced,
// the 'spirit' parameter is irrelevant. Output format: spirit(player_id)[seed]<board_pos>:hp
function getSpiritTag(spirit, player_id, seed, board_pos, hp) {
  const _player_id = player_id || spiritOwner(spirit);
  const _seed = seed || spiritSeed(spirit);
  const _board_pos = board_pos || tilePosition(spirit)[0];
  const _hp = hp || spiritHP(spirit);

  return `spirit(${_player_id})[${_seed}]<${_board_pos}>:${_hp}`;
}
/* = SPIRIT LOGIC HELPERS = */



/* = MISCELLANEOUS HELPERS = */
// Recursive function that checks whether there is a valid path from the start tile to the end tile.
// Takes into account the type of tiles the specific spirit can walk on, and the maximum distance.
function hasValidPath(game, spirit, destination, distance) {
  const pos_raw = tilePosition(spirit);
  const pos = [parseInt(pos_raw[1]), parseInt(pos_raw[2])];

  return validRecurs(game, `board-tile<${pos[0] + 1},${pos[1]}>`, destination, spirit, 0, distance) ||
    validRecurs(game, `board-tile<${pos[0] - 1},${pos[1]}>`, destination, spirit, 0, distance) ||
    validRecurs(game, `board-tile<${pos[0]},${pos[1] + 1}>`, destination, spirit, 0, distance) ||
    validRecurs(game, `board-tile<${pos[0]},${pos[1] - 1}>`, destination, spirit, 0, distance);
}

// Helper for recursive function hasValidPath. Do not call directly.
function validRecurs(game, curr, dest, spirit, depth, MAX_DEPTH) {
  const pos = tilePosition(curr);
  if (!validPosition(pos[1], pos[2])) {
    return false;
  } else if (depth === MAX_DEPTH || !canWalkTile(game, curr, spirit) || !tileEmpty(game, curr)) {
    return false;
  } else if (curr === dest) {
    return true;
  } else {
    const pos_raw = tilePosition(curr);
    const pos = [parseInt(pos_raw[1]), parseInt(pos_raw[2])];

    return validRecurs(game, `board-tile<${pos[0] + 1},${pos[1]}>`, dest, spirit, depth + 1, MAX_DEPTH) ||
      validRecurs(game, `board-tile<${pos[0] - 1},${pos[1]}>`, dest, spirit, depth + 1, MAX_DEPTH) ||
      validRecurs(game, `board-tile<${pos[0]},${pos[1] + 1}>`, dest, spirit, depth + 1, MAX_DEPTH) ||
      validRecurs(game, `board-tile<${pos[0]},${pos[1] - 1}>`, dest, spirit, depth + 1, MAX_DEPTH);
  }
}
/* MISCELLANEOUS HELPERS */


/* ACTION FUNCTIONS */
// Sets the occupant of the give tile to the given spirit.
function setTileOccupant(game, tile, spirit) {
  const pos = tilePosition(tile);
  game.spirits_board[pos[1]][pos[2]] = spirit;
}

// Moves a spirit from the given tile to the destination tile, provided that the destination
// is within range and there is a valid path. For portals, also checks that the other end is unoccupied.
// Returns true or false representing the success of the operation.
function doSpiritMove(game, tile_curr, tile_dest, spirit) {
  if (tileWithinDistance(tile_curr, tile_dest, 3) && hasValidPath(game, spirit, tile_dest, 3)) {
    // We check distance even though hasValidPath will not exceed the distance since tileWithinDistance is
    // a cheaper check and if it returns false we don't need to bother with hasValidPath.
    const type = tileType(game, tile_dest);
    const seed = spiritSeed(spirit);
    
    let true_dest = tile_dest;
    if (type === 'portal') {
      true_dest = mirrorTile(game.tiles_board, tile_dest);
      if (!tileEmpty(game, true_dest)) {
        return false;
      }
    }

    setTileOccupant(game, tile_curr, '');
    setTileOccupant(game, true_dest, getSpiritTag(spirit, game.turn, seed, tilePosition(true_dest)[0]));
    return true;
  } else {
    return false;
  }
}

// Returns true if the given tile is walkable by all spirits, or if the given spirit has the 
// appropriate abilities to walk on that tile if it is a special tile (e.g. "Aquatic" for water tiles).
function canWalkTile(game, tile, spirit) {
  const type = tileType(game, tile);
  const spirit_obj = createRandomSpirit(spiritSeed(spirit));

  if (type === 'none' || type === 'p1-spawn' || type === 'p2-spawn') {
    return true;
  }
  if (type === 'water' && (spirit_obj.abilities.includes(0) || spirit_obj.abilities.includes(7) || spirit_obj.abilities.includes(8))) {
    return true;
  } 
  if (type === 'portal' && (spirit_obj.abilities.includes(9) || spirit_obj.abilities.includes(28))) {
    return true;
  }
  return false;
}

// Simulates one turn of a battle. Both player_one_move and player_two_move must not be
// null. Returns a list with two items: the first is whether the first player was hit and
// the second is whether the second player was hit.
function doBattleTurn(battle) {
  // We set these first, before even fleeing so that on flee the opponent
  // can see that their enemy selected to flee.
  battle.player_one_prev = battle.player_one_move;
  battle.player_two_prev = battle.player_two_move;

  if ((battle.initiator === 'player_one' && battle.player_one_move === 'flee') ||
    (battle.initiator === 'player_two' && battle.player_two_move === 'flee')) {
    battle.finished = true;
    return [false, false];
  }

  const random = function(min, max) { // Returns a random integer between min and max
    return Math.max(min, Math.floor(Math.random() * max));
  };

  let spirit_1 = createRandomSpirit(spiritSeed(battle.player_one_spirit));
  let spirit_1_HP = spiritHP(battle.player_one_spirit);
  const starting_spirit_1_HP = spirit_1_HP;
  let spirit_2 = createRandomSpirit(spiritSeed(battle.player_two_spirit));
  let spirit_2_HP = spiritHP(battle.player_two_spirit);
  const starting_spirit_2_HP = spirit_2_HP;

  let spirit_1_DMG = random(spirit_1.ATK * 0.8, spirit_1.ATK * 1.2);
  let spirit_2_DMG = random(spirit_2.ATK * 0.8, spirit_2.ATK * 1.2);

  // If a spirit meditated last turn, they will deal extra damage this turn.
  if (battle.player_one_prev === 'meditate') {
    spirit_1_DMG *= 1.5;
  }
  if (battle.player_two_prev === 'meditate') {
    spirit_2_DMG *= 1.5;
  }

  // If a spirit meditates, all incoming damage is reduced by half.
  if (battle.player_one_move === 'meditate') {
    spirit_2_DMG = spirit_2_DMG * 0.5;
  }
  if (battle.player_two_move === 'meditate') {
    spirit_1_DMG = spirit_1_DMG * 0.5;
  }

  // Make sure we are dealing with integers only.
  spirit_1_DMG = Math.ceil(spirit_1_DMG);
  spirit_2_DMG = Math.ceil(spirit_2_DMG);

  // If a spirit attempts to dodge, it has a chance to avoid all damage.
  if (battle.player_one_move === 'dodge') {
    const chance = (spirit_1.abilities.includes(5)) ? 0.6 : 0.5;
    if (Math.random() < chance) {
      spirit_2_DMG = 0;
    }
  }
  if (battle.player_two_move === 'dodge') {
    const chance = (spirit_2.abilities.includes(5)) ? 0.6 : 0.5;
    if (Math.random() < chance) {
      spirit_1_DMG = 0;
    }
  }

  // Finally, we do damage calculations and update the HPs.
  if (battle.player_one_move === 'attack') {
    spirit_2_HP = Math.max(0, spirit_2_HP - spirit_1_DMG);
  }
  if (battle.player_two_move === 'attack') {
    spirit_1_HP = Math.max(0, spirit_1_HP - spirit_2_DMG);
  }

  if (spirit_1_HP === 0 || spirit_2_HP === 0) {
    battle.finished = true;
  }

  // Clear the moves.
  battle.player_one_move = null; battle.player_two_move = null;
  
  // Update the spirits and return the battle events.
  battle.player_one_spirit = `${battle.player_one_spirit.split(':')[0]}:${spirit_1_HP}`;
  battle.player_two_spirit = `${battle.player_two_spirit.split(':')[0]}:${spirit_2_HP}`;
  return [spirit_1_HP !== starting_spirit_1_HP, spirit_2_HP !== starting_spirit_2_HP];
}

// Adds the knocked out spirits to the graveyard. Also, if the spirit was
// not knocked out, it's tag on the board is updated to ensure damage persists.
function addToGraveyard(game, battle) {
  addToGraveyardHelper(game, battle.player_one_spirit);
  addToGraveyardHelper(game, battle.player_two_spirit);
}

// Helper function for addToGraveyard. Do not call directly.
function addToGraveyardHelper(game, spirit) {
  if (spiritHP(spirit) === 0) {
    game.graveyard.spirits.push(spirit);
    game.graveyard.cooldowns.push(20);
    
    setTileOccupant(game, spirit, '');
  } else {
    setTileOccupant(game, spirit, spirit);
  }
}

// TODO: rework how the graveyard works. Atm, the remove call
// on the cooldown will have issues if two spirits have the same cooldown value, potentially?
// ig they would both get removed, still sus...
function updateGraveyard(game) {
  for (let i = 0; i < game.graveyard.spirits.length; i++) {
    let cooldown = game.graveyard.cooldowns[i];
    if (cooldown === 0) {
      const spirit = game.graveyard.spirits[i];
      remove(game.graveyard.spirits, spirit);
      remove(game.graveyard.cooldowns, cooldown);
      
      const owner = spiritOwner(spirit);
      const seed = spiritSeed(spirit);
      if (owner === game.player_one) {
        game.player_one_hand.push(seed);
      } else if (owner === game.player_two) {
        game.player_two_hand.push(seed);
      }
      
    } else {
      game.graveyard.cooldowns[i] -= 1;
    }
  }
  console.log("===\nCURRENT GRAVEYARD: ", game.graveyard);
}

// Changes the turn of the game to the player whose turn it is currently not.
function turnChange(game) {
  for (let y = 0; y < BOARD_HEIGHT; y++) {
    for (let x = 0; x < BOARD_WIDTH; x++) {
      const spirit = game.spirits_board[y][x];
      if (spirit !== '') {
        const spirit_obj = createRandomSpirit(spiritSeed(spirit));
        let updated_tag = spirit;

        if (spirit_obj.abilities.includes(2)) {
          let hp = spiritHP(spirit);
          if (hp < spirit_obj.HP) {
            hp += Math.min(spirit_obj.HP - hp, spirit_obj.HP * 0.05);
          }
          updated_tag = getSpiritTag(spirit, null, null, null, hp);
        }

        game.spirits_board[y][x] = updated_tag;
      }
    }
  }

  game.turn = (game.turn === game.player_one) ? game.player_two : game.player_one;
  updateGraveyard(game);
}

/* ===== ========== ===== */
/* END GAME LOGIC SECTION */
/* ===== ========== ===== */



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
  socket.on('do-spirit-move', (spirit, tile, lobby_id) => {
    /*DEBUG*/ console.log(socket.id + " > Doing spirit move:\n" + spirit + " to tile: " + tile);

    const lobby = lobbies[lobby_id];
    if (!validLobby(lobby)) {
      return; // TODO: handle error better?
    }
    
    const game = lobby.game;
    if (!(game.turn === socket.id)) {
      return;
    }
    
    // First, we figure out if this is a spirit being deployed from the players hand, 
    // or simply moving on the board. We don't just call tilePosition() a undeployed
    // spirit has nothing between the <>, so the function would error.
    
    const pos_regex = /(?<=\<)(.*?)(?=\>)/; // Grabs everything between < and >, not including < and >
    const pos = spirit.match(pos_regex)[0];

    if (pos !== '') {
      // This means the spirit is on the board. The next step is therefore
      // to check if the move is valid, e.g. within range & to a walkable tile.

      const spirit_tile = `board-tile<${pos}>`;
      if (doSpiritMove(game, spirit_tile, tile, spirit)) {
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
      const seed = spiritSeed(spirit);
      if (hand.includes(seed)) {
        remove(hand, seed);

        const tile_type = tileType(game, tile);
        const required = (game.turn === game.player_one) ? 'p1-spawn' : 'p2-spawn';

        // Spirits can only be played to the spawn tiles and those tiles must be empty.
        if (tile_type === required && tileEmpty(game, tile)) {
          setTileOccupant(game, tile, getSpiritTag(spirit, game.turn, seed, tilePosition(tile)[0]));

          /* ABILITY: MOMENTUM */
          const spirit_obj = createRandomSpirit(spiritSeed(spirit));
          if (!spirit_obj.abilities.includes(23)) {
            turnChange(game);
          }

          io.in(lobby_id).emit('turn-update', game);
        }
      }
    }
  });

  socket.on('begin-battle', (spirit, enemy, lobby_id) => {
    /*DEBUG*/ console.log(socket.id + " > Beginning battle with spirit: " + spirit + " and enemy: " + enemy);

    const lobby = lobbies[lobby_id];
    if (!validLobby(lobby)) {
      return; // TODO: handle error better
    }

    const game = lobby.game;
    if (!(game.turn === socket.id)) {
      return;
    }

    // First, we figure out if either spirit is not on the board, in which case
    // this would be an invalid battle.
    
    const pos_regex = /(?<=\<)(.*?)(?=\>)/; // Grabs everything between < and >, not including < and >
    
    const spirit_pos = spirit.match(pos_regex)[0];
    const enemy_pos = enemy.match(pos_regex)[0];

    // Secondly we need to ensure the player isn't trying to battle their
    // own spirit on accident.

    const enemy_owner = spiritOwner(enemy);

    if (spirit_pos === '' || enemy_pos === '' || enemy_owner === socket.id) {
      /*DEBUG*/ console.log("RETURN > Spirit or enemy is not on the board");
      return;
    }

    if (!game.battle || game.battle.finished)  {
      let update_type = 'turn-update';

      outerloop:
      if (!tileWithinDistance(spirit, enemy, 1, true)) {
        const enemy_pos_ = enemy_pos.split(',');
        for (let x = -1; x <= 1; x++) {
          for (let y = -1; y <= 1; y++) {
            const tile_dest = `board-tile<${parseInt(enemy_pos_[0]) + x},${parseInt(enemy_pos_[1]) + y}>`;
            if (hasValidPath(game, spirit, tile_dest, 3)) {
              doSpiritMove(game, `board-tile<${spirit_pos}>`, tile_dest, spirit);
              spirit = getSpiritTag(spirit, null, null, tile_dest, null);
              update_type = 'turn-update:battle+move';
              break outerloop;
            }
          }
        }
      }

      if (tileWithinDistance(spirit, enemy, 1, true)) {
        const initiator = (game.player_one === socket.id) ? 'player_one' : 'player_two';

        game.battle = {
          initiator: initiator,
          finished: false,
          player_one_spirit: (initiator === 'player_one') ? spirit : enemy,
          player_two_spirit: (initiator === 'player_two') ? spirit : enemy,
          player_one_move: null,
          player_two_move: null,
          player_one_prev: null,
          player_two_prev: null,
        }
  
        turnChange(game);
        io.in(lobby_id).emit(update_type, game);
      }
    }
  });

  socket.on('do-battle-move', (move, lobby_id) => {
    /*DEBUG*/ console.log(socket.id + " > Doing battle move: " + move);

    const lobby = lobbies[lobby_id];
    if (!validLobby(lobby)) {
      return;
    }    
    const game = lobby.game;

    if (!game.battle.finished) {
      if (socket.id === game.player_one) {
        game.battle.player_one_move = move;
      } else if (socket.id === game.player_two) {
        game.battle.player_two_move = move;
      }

      // If both players have made their moves, we can start do the turn logic.
      if (game.battle.player_one_move && game.battle.player_two_move) {
        const events = doBattleTurn(game.battle);
        if (game.battle.finished) {
          addToGraveyard(game, game.battle);
        }
        io.in(lobby_id).emit('battle-update', game, events);
      }
    }
  });
});

httpServer.listen(8080, '0.0.0.0');