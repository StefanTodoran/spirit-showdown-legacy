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
    ['wall','wall','wall','wall','p2-spawn','wall','wall','wall','wall','p2-spawn','wall','wall',],
    ['portal','none','wall','none','none','none','none','none','none','none','none','wall',],
    ['wall','none','none','none','wall','wall','wall','none','none','none','none','wall',],
    ['wall','water','water','wall','none','none','none','none','none','water','water','wall',],
    ['wall','water','water','none','none','none','none','none','wall','water','water','wall',],
    ['wall','none','none','none','none','wall','wall','wall','none','none','none','wall',],
    ['wall','none','none','none','none','none','none','none','none','wall','none','portal',],
    ['wall','wall','p1-spawn','wall','wall','wall','wall','p1-spawn','wall','wall','wall','wall',],
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
    ['wall','water','water','water','p2-spawn','wall','wall','wall','wall','wall','wall','wall',],
    ['portal','none','none','none','none','none','none','none','none','none','none','wall',],
    ['wall','none','none','none','none','water','none','none','wall','none','none','p2-spawn',],
    ['wall','wall','none','none','none','water','water','none','none','wall','none','wall',],
    ['wall','none','wall','none','none','water','water','none','none','none','wall','wall',],
    ['p1-spawn','none','none','wall','none','none','water','none','none','none','none','wall',],
    ['wall','none','none','none','none','none','none','none','none','none','none','portal',],
    ['wall','wall','wall','wall','wall','wall','wall','p1-spawn','water','water','water','wall',],
  ],
  [
    ['wall','wall','wall','p2-spawn','none','none','none','none','none','none','p2-spawn','wall',],
    ['wall','none','none','none','wall','none','wall','none','none','none','none','wall',],
    ['none','none','none','none','none','wall','wall','none','none','none','none','none',],
    ['portal','wall','none','none','water','none','none','water','none','wall','none','none',],
    ['none','none','wall','none','water','none','none','water','none','none','wall','portal',],
    ['none','none','none','none','none','wall','wall','none','none','none','none','none',],
    ['wall','none','none','none','none','wall','none','wall','none','none','none','wall',],
    ['wall','p1-spawn','none','none','none','none','none','none','p1-spawn','wall','wall','wall',],
  ],
  [
    ['water','p2-spawn','none','none','none','none','none','none','none','none','p2-spawn','water',],
    ['water','none','none','none','none','water','water','none','none','none','none','water',],
    ['water','none','none','none','none','none','water','none','wall','wall','none','water',],
    ['water','wall','none','wall','wall','none','none','none','portal','none','wall','water',],
    ['water','wall','none','portal','none','none','none','wall','wall','none','wall','water',],
    ['water','none','wall','wall','none','water','none','none','none','none','none','water',],
    ['water','none','none','none','none','water','water','none','none','none','none','water',],
    ['water','p1-spawn','none','none','none','none','none','none','none','none','p1-spawn','water',],
  ],
  // [
  //   ['wall','p2-spawn','wall','wall','wall','wall','wall','wall','wall','wall','p2-spawn','wall',],
  //   ['wall','none','none','none','none','water','water','none','none','none','none','wall',],
  //   ['wall','none','none','wall','none','wall','water','none','none','none','none','wall',],
  //   ['portal','none','none','none','none','wall','water','none','none','wall','wall','wall',],
  //   ['wall','wall','wall','none','none','water','wall','none','none','none','none','portal',],
  //   ['wall','none','none','none','none','water','wall','none','wall','none','none','wall',],
  //   ['wall','none','none','none','none','water','water','none','none','none','none','wall',],
  //   ['wall','p1-spawn','wall','wall','wall','wall','wall','wall','wall','wall','p1-spawn','wall',],
  // ],
];
const spirits_board = [
  [null,null,null,null,null,null,null,null,null,null,null,null,],
  [null,null,null,null,null,null,null,null,null,null,null,null,],
  [null,null,null,null,null,null,null,null,null,null,null,null,],
  [null,null,null,null,null,null,null,null,null,null,null,null,],
  [null,null,null,null,null,null,null,null,null,null,null,null,],
  [null,null,null,null,null,null,null,null,null,null,null,null,],
  [null,null,null,null,null,null,null,null,null,null,null,null,],
  [null,null,null,null,null,null,null,null,null,null,null,null,],
];

const BOARD_WIDTH = spirits_board[0].length;
const BOARD_HEIGHT = spirits_board.length;
/* ===== ===== ===== */

// NOT an actual deep copy, but since we just need to use it for objects that contain
// numbers and strings, it should be ok. BE WARNED: THIS FUNCTION IS DANGEROUS!
function fakeDeepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// removes the given item from the list
function remove(list, item) {
  const pos = list.indexOf(item);
  return list.splice(pos,  1);
}

// TODO: REPLACE CALLS TO RANDOM() AND MATH.RANDOM() WITH THIS!!!
// Returns a random integer between min and max
function randInt(min, max) {
  return Math.max(min, Math.floor(Math.random() * max));
};

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
    //   initiator: game.player_one, <-- The player who started combat, only they can flee.
    //   player_one_spirit: (some spirit obj here),
    //   player_two_spirit: (some spirit obj here),
    //   player_one_move: null, <-- Moves are executed at the same time, so we wait for both
    //   player_two_move: null, <-- players to queue up their moves for each battle turn.
    //   player_one_prev: null,
    //   player_two_prev: null, <-- The previous move that was executed.
    // }

    player_one: firstPlayer,
    player_two: secondPlayer,
    winner: null,
    
    player_one_deck: null, // Deck is spirits they have, hand is spirits not in play.
    player_two_deck: null, // Deck never changes, hand starts off as deck but cards are played (removed).
    
    player_one_hand: [],
    player_two_hand: [],

    graveyard: [],
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

// Given some 'tile<x,y>' this will return ['x', 'y'] where x and y are numbers, not strings.
// If a position [x, y] is passed in, it will just be returned unchanged.
function tilePosition(tile) {
  if (typeof tile === 'string') {
    const pos_regex = /(?<=\<)(-*\d+),(-*\d+)(?=\>)/;
    const pos_raw = tile.match(pos_regex);
    return [parseInt(pos_raw[1]), parseInt(pos_raw[2])];
  } else {
    return tile;
  }
}

// Given a board and position, returns the type of the tile at that position.
// If tile is a tile string, it's location will be parsed, otherwise it is assumed to be [x, y] form.
function tileType(game, tile) {
  const pos = tilePosition(tile);
  return game.tiles_board[pos[0]][pos[1]];
}

// Returns true if no spirits occupy the given tile and false otherwise.
// If tile is a tile string, it's location will be parsed, otherwise it is assumed to be [x, y] form.
function tileEmpty(game, tile) {
  const pos = tilePosition(tile);
  return game.spirits_board[pos[0]][pos[1]] === null;
}

// Returns true if (moving only horizontally and vertically) the second tile can be reached
// from the first in 'distance' or less steps. Passing 'true' to 'square' means diagonal moves
// count as one step.
function tileWithinDistance(tile_A, tile_B, distance, square) {
  const pos_A = tilePosition(tile_A);
  const pos_B = tilePosition(tile_B);
  if (square) {
    return Math.max(Math.abs(pos_A[0] - pos_B[0]), Math.abs(pos_A[1] - pos_B[1])) <= distance;
  } else {
    return Math.abs(pos_A[0] - pos_B[0]) + Math.abs(pos_A[1] - pos_B[1]) <= distance;
  }
}

// Mirrors a tile across the center of the board both vertically and horizontally.
function mirrorTile(board, tile) {
  const pos = tilePosition(tile);
  return `board-tile<${board.length - pos[0] - 1},${board[0].length - pos[1] - 1}>`;
}
/* = TILE LOGIC HELPERS = */



/* = SPIRIT LOGIC HELPERS = */

// Removes the spirit from its current position and sets its position to the destination tile.
// If dest_tile is null, this is equivalent to removing the spirit from the board.
function updateSpiritPosition(game, spirit, dest_tile) {
  game.spirits_board[spirit.position[0]][spirit.position[1]] = null;
  
  if (dest_tile) {
    const pos = tilePosition(dest_tile);
    spirit.position = pos;
    
    game.spirits_board[pos[0]][pos[1]] = spirit;
  } else {
    spirit.position = null;
  }
}

// Returns the number of tiles that a spirit can move.
function getSpiritSpeed(spirit) {
  if (spirit.abilities.includes("Tank")) {
    return 2;
  }
  if (spirit.abilities.includes("Speedster")) {
    return 4;
  } 
  return 3;
}

// Shorthand helper for calculating spirit health values, caps the 
// provided value between 0 and spirit.HP, then rounds down to the nearest integer.
function boundHealth(spirit, val) {
  return Math.max(0, Math.min(spirit.HP, Math.floor(val)));
}
/* = SPIRIT LOGIC HELPERS = */



/* = MISCELLANEOUS HELPERS = */
// Recursive function that checks whether there is a valid path from the start tile to the end tile.
// Takes into account the type of tiles the specific spirit can walk on, and the maximum distance.
function hasValidPath(game, spirit_tile, destination, abilities, distance) {
  const pos = tilePosition(spirit_tile);
  const dest_pos = tilePosition(destination);

  return pathHelper(game, [pos[0] + 1, pos[1]], dest_pos, abilities, 0, distance) ||
    pathHelper(game, [pos[0] - 1, pos[1]], dest_pos, abilities, 0, distance) ||
    pathHelper(game, [pos[0], pos[1] + 1], dest_pos, abilities, 0, distance) ||
    pathHelper(game, [pos[0], pos[1] - 1], dest_pos, abilities, 0, distance);
}

// Helper for recursive function hasValidPath. Do not call directly.
function pathHelper(game, pos, dest, abilities, depth, MAX_DEPTH) {
  if (!validPosition(pos[0], pos[1]) || depth === MAX_DEPTH) {
    return false;
  }

  // If the spirit can leap other spirits, then we don't need to check tileEmpty.
  const emptyCheck = abilities.includes("Acrobatic") ? true : tileEmpty(game, pos);
  // If the spirit can leap obstacle tiles, then we don't need to check canWalkTile.
  const walkCheck = abilities.includes("Leaping") ? true : canWalkTile(game, pos, abilities);
  
  if (!walkCheck || !emptyCheck) {
    return false;
  } else if (pos[0] === dest[0] && pos[1] === dest[1]) {
    // At the destination, we DO have to do the checks regardless, since
    // spirits can't end up on a tile that is occupied or they can't walk on.
    return tileEmpty(game, pos) && canWalkTile(game, pos, abilities);
  } else {
    return pathHelper(game, [pos[0] + 1, pos[1]], dest, abilities, depth + 1, MAX_DEPTH) ||
      pathHelper(game, [pos[0] - 1, pos[1]], dest, abilities, depth + 1, MAX_DEPTH) ||
      pathHelper(game, [pos[0], pos[1] + 1], dest, abilities, depth + 1, MAX_DEPTH) ||
      pathHelper(game, [pos[0], pos[1] - 1], dest, abilities, depth + 1, MAX_DEPTH);
  }
}

// Used to update and intiantiate spirit effects. If the effect does not exist, it
// will be created based on one of the template effect starters. Then the (prior 
// existing or newly created) effect is returned to be manipulated. 
function getEffect(spirit, effect) {
  const matches = spirit.effects.filter(e => e.effect === effect);
  const templates = {
    "Rampage": {
      effect: "Rampage",
      kills: 0,
      dmg_boost: 0,
    },
    "Rage": {
      effect: "Rage",
      dmg_boost: 0,
    },
    "Frozen": {
      effect: "Frozen",
      duration: 1,
      display: true, // indicates to client whether to display or not
    },
    "Hydrated": {
      effect: "Hydrated",
      dmg_boost: .5,
    },
    "Meditated": {
      effect: "Meditated",
      dmg_boost: .25,
      one_time: true, // lasts one battle turn, whether used or not
    },
    "Combo": {
      effect: "Combo",
      dmg_boost: .75,
      used: false, // lasts one use, when that use occurs does not matter
    },
    "Charged": {
      effect: "Charged",
      dmg_boost: 0,
      one_time: true,
    },
    "Burning": {
      effect: "Burning",
      duration: 5, // number of turns the effect lasts
      dmg: 35, // amount of damage taken per turn
    },
    "Turtle": {
      effect: "Turtle",
      unmoved: 0, // number of turns the spirit has not moved
      display: false,
    },
    "Arsonist": {
      effect: "Arsonist",
      kills: 0,
      dmg_boost: 0,
    },
    // "Cursed": {
    //   effect: "Cursed",
    //   duration: 0,
    // },
  }
  const effect_ = matches.length === 0 ? fakeDeepCopy(templates[effect]) : matches[0];
  if (matches.length === 0) {
    spirit.effects.push(effect_);
  }

  return effect_;
}

// Return whether or not the given spirit has the given effect.
function hasEffect(spirit, effect) {
  const matches = spirit.effects.filter(e => e.effect === effect);
  return matches.length !== 0;
}

// Removes the given effect from the given spirit.
function deleteEffect(spirit, effect) {
  const matches = spirit.effects.filter(e => e.effect === effect);
  remove(spirit.effects, matches[0]);
}
/* MISCELLANEOUS HELPERS */



/* ACTION FUNCTIONS */
// Moves a spirit from the given tile to the destination tile, provided that the destination
// is within range and there is a valid path. For portals, also checks that the other end is unoccupied.
// Returns true or false representing the success of the operation.
function doSpiritMove(game, spirit, destination) {
  const max = getSpiritSpeed(spirit);
  if (tileWithinDistance(spirit.position, destination, max) && hasValidPath(game, spirit.position, destination, spirit.abilities, max)) {
    // We check distance even though hasValidPath will not exceed the distance since tileWithinDistance is
    // a cheaper check and if it returns false we don't need to bother with hasValidPath.
    const type = tileType(game, destination);
    
    let true_dest = destination;
    if (type === 'portal') {
      true_dest = mirrorTile(game.tiles_board, destination);
      if (!tileEmpty(game, true_dest)) {
        return false;
      }
    }

    if (type === 'water' && spirit.abilities.includes("Amphibious")) {
      getEffect(spirit, "Hydrated");
    }
    if (type !== 'water' && hasEffect(spirit, "Hydrated")) {
      deleteEffect(spirit, "Hydrated");
    }
    if (spirit.abilities.includes("Turtle")) {
      const effect = getEffect(spirit, "Turtle")
      effect.unmoved = 0;
      effect.display = false;
    }
    if (type === 'water' && hasEffect(spirit, "Burning")) {
      deleteEffect(spirit, "Burning");
    }

    updateSpiritPosition(game, spirit, true_dest);
    return true;
  } else {
    return false;
  }
}

// Returns true if the given tile is walkable by all spirits, or if the given spirit has the 
// appropriate abilities to walk on that tile if it is a special tile (e.g. "Aquatic" for water tiles).
function canWalkTile(game, tile, abilities) {
  const type = tileType(game, tile);

  if (type === 'none' || type === 'p1-spawn' || type === 'p2-spawn') {
    return true;
  }
  if (type === 'water' && (abilities.includes("Electric") || abilities.includes("Aquatic") || 
    abilities.includes("Amphibious") || abilities.includes("Flying") || abilities.includes("Octopus"))) {
    return true;
  } 
  if (type === 'portal' && (abilities.includes("Psychic") || abilities.includes("Esper") ||
    abilities.includes("Clairvoyant"))) {
    return true;
  }
  return false;
}

// Simulates one turn of a battle. Both player_one_move and player_two_move must not be
// null. Returns a list with two items: the first is whether the first player was hit and
// the second is whether the second player was hit.
function doBattleTurn(game, battle) {
  battle.player_one_prev = battle.player_one_move;
  battle.player_two_prev = battle.player_two_move;

  const starting_hp_1 = battle.player_one_spirit.current_hp;
  const starting_hp_2 = battle.player_two_spirit.current_hp;

  const res_1 = calcModifiersHelper(battle.player_one_spirit, battle.player_two_spirit, 
    battle.player_one_move, battle.initiator === 'player_one');
  const res_2 = calcModifiersHelper(battle.player_two_spirit, battle.player_one_spirit, 
    battle.player_two_move, battle.initiator === 'player_two');
  // res is [damage, incoming, direct]

  // Finally, we do damage calculations and update the HPs.
  const hit_1 = enactHealthChange(battle.player_one_spirit, res_1, res_2);
  const hit_2 = enactHealthChange(battle.player_two_spirit, res_2, res_1);

  handleHitEffects(battle.player_one_spirit, battle.player_two_spirit, hit_2);
  handleHitEffects(battle.player_two_spirit, battle.player_one_spirit, hit_1);

  refreshReference(game, battle.player_one_spirit);
  refreshReference(game, battle.player_two_spirit);
  boardUpdate(game, false);

  if (battle.player_one_spirit.current_hp === 0 || battle.player_two_spirit.current_hp === 0) {
    battle.finished = true;
    addToGraveyard(game, game.battle);
  }

  if ((battle.initiator === 'player_one' && battle.player_one_move === 'flee' && !battle.player_two_spirit.abilities.includes("Demonic")) ||
  (battle.initiator === 'player_two' && battle.player_two_move === 'flee' && !battle.player_one_spirit.abilities.includes("Demonic"))) {
    battle.finished = true;
  }

  // Clear the moves and return the battle events.
  battle.player_one_move = null; battle.player_two_move = null;
  return [
    starting_hp_1 - battle.player_one_spirit.current_hp,
    starting_hp_2 - battle.player_two_spirit.current_hp,
    res_1[1] === 0, // if this is zero, the spirit successuflly dodged 
    res_2[1] === 0, // this is used for animations on the client side
  ];
}

// Helper function for doBattleTurn. Do not call directly!
function calcModifiersHelper(spirit, enemy, curr_move, initiator) {
  // Damage is the amount of damage being outputed. The enemy will take damage*incoming
  // damage, where incoming is some damage resistance less than 1. Damage is positive and subtracted from health.
  let damage = 0;
  let incoming = 1;
  // Unlike damage, direct gets no multiplier but is added straight to health. Essentially it is all 
  // the undodgeable / unmodifiable damage + heals, and it is subtracted from health (positive direct = heals, 
  // negative direct = damage taken).
  let direct = 0;

  if (!initiator && spirit.abilities.includes("Defensive")) {
    incoming *= 0.75;
  }

  if (spirit.abilities.includes("Tank")) {
    incoming *= 0.5;
  }
  
  if (enemy.abilities.includes("Plague")) {
    direct -= spirit.HP * 0.1;
  }

  if (spirit.abilities.includes("Regenerating")) {
    direct += spirit.HP * 0.025;
    // The heal value here is lower than the turn based heal since battles tend
    // to have several turns.
  }

  if (hasEffect(spirit, "Hydrated")) {
    incoming *= 0.75;
  }

  if (spirit.abilities.includes("Turtle") && getEffect(spirit, "Turtle").unmoved > 5) {
    incoming *= 0.5;
  }

  // if (hasEffect(spirit, "Burning")) {
  //   direct -= getEffect(spirit, "Burning").dmg;
  // }

  if (spirit.type === "Marine" && enemy.abilities.includes("Sushi Chef")) {
    incoming *= 1.25;
  }

  if (curr_move === 'attack') { /* -=====- ATTACK -=====- */
    damage = spirit.abilities.includes("Wildcard") ? 
      randInt(spirit.ATK * 0.8, spirit.ATK * 1.75) : randInt(spirit.ATK * 0.8, spirit.ATK * 1.2);

    // If a spirit has damage modifiers, take them into account.
    damage *= spirit.dmg_boost;

    if (hasEffect(spirit, "Charged")) {
      const effect = getEffect(spirit, "Charged");
      effect.used = true;
    }

    if (initiator && spirit.abilities.includes("Aggresive")) {
      damage *= 1.5;
    }

    if (spirit.abilities.includes("Heat Wave") && hasEffect(enemy, "Burning")) {
      damage *= 1.5;
    }

  } else if (curr_move === 'meditate') { /* -=====- MEDITATE -=====- */
    // If a spirit meditates, all incoming damage is reduced...
    incoming *= spirit.abilities.includes("Nuker") ? 0.25 : 0.5;
    // ...and the next attack will do increased damage.

    const effect = getEffect(spirit, "Meditated");
    if (spirit.abilities.includes("Enlightened")) {
      effect.dmg_boost = .75;
    }

    if (spirit.abilities.includes("Divine")) {
      direct += spirit.HP * 0.1;
    }

  } else if (curr_move === 'dodge') { /* -=====- DODGE -=====- */
    // If a spirit attempts to dodge, it has a chance to avoid all damage.
    let chance = 0.5;
    if (spirit.abilities.includes("Evasive")) {
      chance += 0.15;
    }
    if (spirit.abilities.includes("Wraith")) {
      chance += 0.15;
    }
    if (enemy.abilities.includes("Accuracy")) {
      chance -= 0.2;
    }
    if (Math.random() < chance) {
      incoming = 0;

      if (spirit.abilities.includes("Martial Artist")) {
        getEffect(spirit, "Combo");
      }
    }
  } else if (curr_move === 'charge') { /* -=====- CHARGE -=====- */
    // Charging an attack makes you vulnerable to taking more damage...
    incoming *= 1.45;
    // ...however, you gain a large and stackable damage boost.

    const effect = getEffect(spirit, "Charged");
    effect.dmg_boost += spirit.abilities.includes("Nuker") ? 2.25 : 1.5;
  }

  return [damage, incoming, direct];
}

// Helper function for doBattleTurn. Do not call directly!
// Returns true if the spirit took damage (hp_boost damage doesn't count).
function enactHealthChange(spirit, res, enemy_res) {
  let change = res[2] - (enemy_res[0] * res[1]);
  // change = direct change - (enemy damage * incoming perct), 
  // such that a negative change value represents damage and positive is healing

  // if (change < 0) { // only affects hp_boost if it is damage, we don't want to heal the boost
  //   const boost = spirit.hp_boost; // temporary variable
  //   spirit.hp_boost = Math.max(0, Math.floor(spirit.hp_boost + change));
  //   change += boost;
  // }

  spirit.current_hp = boundHealth(spirit, spirit.current_hp + change);
  return (enemy_res[0] * res[1]) > 0;
}

function handleHitEffects(spirit, enemy, enemy_hit) {
  if (enemy_hit) {
    if (spirit.abilities.includes("Flaming") || spirit.abilities.includes("Arsonist")) {
      if (Math.random() < 0.3) {
        const debuff = getEffect(enemy, "Burning");
        debuff.duration = randInt(2, 5);
        debuff.damage = randInt(0.1 * spirit.ATK, 0.2 * spirit.ATK);

        if (spirit.abilities.includes("Arsonist")) {
          const boost = getEffect(spirit, "Arsonist");
          boost.kills++;
          boost.dmg_boost += 0.1;
        }
      }
    }

    if (spirit.abilities.includes("Arctic")) {
      if (Math.random() < 0.25) {
        getEffect(enemy, "Frozen");
      }
    }

    if (spirit.abilities.includes("Heat Wave") && hasEffect(spirit, "Charged") && getEffect(spirit, "Charged").used) {
      const effect = getEffect(enemy, "Burning");
        effect.duration = randInt(3, 5);
        effect.damage = randInt(0.1 * spirit.ATK, 0.25 * spirit.ATK);
    }
  }
}

// Adds the knocked out spirits to the graveyard. Also, if the spirit was  knocked out, 
// updates it's tag on the board is updated to ensure damage persists. Finally, handles
// kill related effects.
function addToGraveyard(game, battle) {
  const died_1 = addToGraveyardHelper(game, battle.player_one_spirit);
  const died_2 = addToGraveyardHelper(game, battle.player_two_spirit);

  if (died_1 && !died_2) {
    handleKillEffects(game, battle.player_two_spirit);
  }
  if (died_2 && !died_1) {
    handleKillEffects(game, battle.player_one_spirit);
  }
}

// Helper function for addToGraveyard. Do not call directly!
// Assumes that the provided spirit KOed the enemy spirit.
function handleKillEffects(game, spirit) {
  if (spirit.abilities.includes("Rampage")) {
    const effect = getEffect(spirit, "Rampage");
    effect.kills++;
    effect.dmg_boost += .5;
  }

  if (spirit.abilities.includes("Vampire")) {
    spirit.current_hp = boundHealth(spirit, spirit.current_hp + spirit.HP * 0.45);
  }

  refreshReference(game, spirit);
}

// Helper function for addToGraveyard. Do not call directly.
// Returns true on spirit death and false otherwise.
function addToGraveyardHelper(game, spirit) {
  if (spirit.current_hp === 0) {
    game.graveyard.push(spirit);
    spirit.cooldown = 25 - spirit.SPD;
    spirit.effects = [];
    
    updateSpiritPosition(game, spirit, null);
    return true;
  } else {
    refreshReference(game, spirit);
    return false;
  }
}

// Updates the cooldown values of each spirit in the graveyard. If their cooldown reaches
// zero, they are added to their owners hand.
function updateGraveyard(game) {
  for (let i = 0; i < game.graveyard.length; i++) {
    const spirit = game.graveyard[i];
    if (spirit.cooldown === 1) {
      remove(game.graveyard, spirit);
      
      if (spirit.owner === game.player_one) {
        game.player_one_hand.push(spirit.seed);
      } else if (spirit.owner === game.player_two) {
        game.player_two_hand.push(spirit.seed);
      }
      
    } else {
      spirit.cooldown -= 1;
    }
  }
}

// Loops over all spirits currently on the board and updates various stats.
// If they have turn based effects, those occur if (turn === true). Other calculations,
// like updating the spirit.dmg_boost, are done regardless.
function boardUpdate(game, turn) {
  for (let y = 0; y < BOARD_HEIGHT; y++) {
    for (let x = 0; x < BOARD_WIDTH; x++) {
      const spirit = game.spirits_board[y][x];
      if (spirit) {

        if (spirit.abilities.includes("Regeneration")) {
          if (spirit.current_hp < spirit.HP) {
            spirit.current_hp = boundHealth(spirit, spirit.current_hp + (spirit.HP * 0.1));
          }
        }

        if (spirit.abilities.includes("Turtle") && turn) {
          const effect = getEffect(spirit, "Turtle");
          if (spirit.current_hp < spirit.HP && effect.unmoved > 5) {
            spirit.current_hp = boundHealth(spirit, spirit.current_hp + (spirit.HP * 0.1));
          }
          effect.display = effect.unmoved > 5;
          effect.unmoved++;
        }

        if (spirit.abilities.includes("Rage")) {
          const multiplier = (spirit.HP / spirit.current_hp) - 1;
          getEffect(spirit, "Rage").dmg_boost = Math.min(multiplier, 8);
        }
        
        spirit.dmg_boost = 1; 
        const to_delete = [];
        for (let i = 0; i < spirit.effects.length; i++) {
          const effect = spirit.effects[i];
          if (effect.dmg_boost) {
            spirit.dmg_boost += effect.dmg_boost;
          }
          if ((effect.one_time) || (effect.used)) {
            to_delete.push(effect.effect);
          }
          if (typeof effect.duration === "number") {
            if (effect.duration === 0) {
              to_delete.push(effect.effect);
            } else {
              effect.duration--;
              if (effect.dmg) {
                spirit.current_hp = boundHealth(spirit, spirit.current_hp - effect.dmg);
              }
            }
          }
        }
        spirit.dmg_boost = Math.round(spirit.dmg_boost * 100) / 100; // Rounds to 2 decimal

        // We have to delete seperately because we can't modify the array while iterating over it.
        for (let i = 0; i < to_delete.length; i++) {
          deleteEffect(spirit, to_delete[i]);
        }

        refreshReference(game, spirit);
      }
    }
  }
}

// Refresh object, otherwise weird things happen?
function refreshReference(game, spirit) {
  game.spirits_board[spirit.position[0]][spirit.position[1]] = spirit;
}

// Checks the board to see if either player has both of their spawn tiles
// blocked, in which case they have lost. Then returns a boolean representing the result,
// which is also updated in the game object.
function checkWinConditions(game) {
  let p1_controlled = 0; let p2_controlled = 0;
  for (let y = 0; y < BOARD_HEIGHT; y++) {
    for (let x = 0; x < BOARD_WIDTH; x++) {
      // We are looking only at the spawn in tiles. If both are occupied,
      // that player has lost as they cannot spawn in new spirits.
      const occupant = game.spirits_board[y][x];
      if (game.tiles_board[y][x] === 'p1-spawn' && occupant && occupant.owner === game.player_two) {
        p2_controlled++;
      }
      if (game.tiles_board[y][x] === 'p2-spawn' && occupant && occupant.owner === game.player_one) {
        p1_controlled++;
      }
    }
  }

  if (p1_controlled === 2) {
    game.winner = game.player_one;
    return true;
  }
  if (p2_controlled === 2) {
    game.winner = game.player_two;
    return true;
  }

  return false;
}

// Changes the turn of the game to the player whose turn it is currently not.
// Calls the board update handler to do turn based updates on values and effects.
function turnChange(game) {
  updateGraveyard(game);
  boardUpdate(game, true);

  game.turn = (game.turn === game.player_one) ? game.player_two : game.player_one;
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
    /*DEBUG*/ console.log(socket.id + " > Providing deck for game init");

    const lobby = lobbies[lobby_id];
    if (!validLobby(lobby)) {
      return; // TODO: handle error better
    }

    const game = lobby.game;
    if (game.player_one === socket.id) {
      game.player_one_deck = fakeDeepCopy(deck);
      game.player_one_hand = fakeDeepCopy(deck);
    } else if (game.player_two === socket.id) {
      game.player_two_deck = fakeDeepCopy(deck);
      game.player_two_hand = fakeDeepCopy(deck);
    }

    // Once we have both player's decks, we can reply with the initial game state.
    if (game.player_one_deck && game.player_two_deck) {
      io.in(lobby_id).emit('init-game-state', game);
      /*DEBUG*/ console.log(game.player_one_hand);
      /*DEBUG*/ console.log(game.player_two_hand);
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
    // or simply moving on the board. Tiles in the players hand have a position of null.

    if (spirit.position && !hasEffect(spirit, "Frozen")) {
      // This means the spirit is on the board. The next step is therefore
      // to check if the move is valid, e.g. within range & to a walkable tile.

      if (doSpiritMove(game, spirit, tile)) {
        if (!(tileType(game, tile) === 'portal' && spirit.abilities.includes("Clairvoyant"))) {
          turnChange(game);
        }
        
        if (checkWinConditions(game)) {
          delete lobbies[lobby_id];
        }

        io.in(lobby_id).emit('state-update', game);
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
      const seed = spirit.seed;
      if (hand.includes(seed)) {
        remove(hand, seed);

        const tile_type = tileType(game, tile);
        const required = (game.turn === game.player_one) ? 'p1-spawn' : 'p2-spawn';

        // Spirits can only be played to the spawn tiles and those tiles must be empty.
        if (tile_type === required && tileEmpty(game, tile)) {
          const pos = tilePosition(tile);

          game.spirits_board[pos[0]][pos[1]] = spirit;
          spirit.position = pos;

          if (!spirit.abilities.includes("Momentum")) {
            turnChange(game);
          }

          io.in(lobby_id).emit('state-update', game);
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
    // this would be an invalid battle. Secondly we need to ensure the player 
    // isn't trying to battle their own spirit on accident.

    if (spirit.position === null || enemy.position === null || enemy.owner === socket.id) {
      return;
    }

    if (!game.battle || game.battle.finished)  {
      let update_type = 'state-update';

      outerloop:
      if (!tileWithinDistance(spirit.position, enemy.position, 1, true)) {
        const max = getSpiritSpeed(spirit);
        for (let x = -1; x <= 1; x++) {
          for (let y = -1; y <= 1; y++) {
            const tile_dest = `board-tile<${enemy.position[0] + x},${enemy.position[1] + y}>`;
            if (doSpiritMove(game, spirit, tile_dest)) {
              update_type = 'state-update:battle+move';
              break outerloop;
            }
          }
        }
      }

      if (tileWithinDistance(spirit.position, enemy.position, 1, true)) {
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

      function turnReady() {
        return game.battle.player_one_move && game.battle.player_two_move ||
          game.battle.player_one_move && hasEffect(game.battle.player_two_spirit, "Frozen") ||
          game.battle.player_two_move && hasEffect(game.battle.player_one_spirit, "Frozen");
      }
      if (hasEffect(game.battle.player_one_spirit, "Frozen")) {
        game.battle.player_one_move = "frozen";
      }
      if (hasEffect(game.battle.player_two_spirit, "Frozen")) {
        game.battle.player_two_move = "frozen";
      }

      // If both players have made their moves, we can start do the turn logic.
      if (turnReady()) {
        const events = doBattleTurn(game, game.battle);
        io.in(lobby_id).emit('battle-update', game, events);
      }
    }
  });
});

httpServer.listen(8080, '0.0.0.0');