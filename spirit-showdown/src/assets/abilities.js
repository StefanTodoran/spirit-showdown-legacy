export const ability_names = {
  0:"Electric",
  1:"Undying",
  2:"Regenerating",
  3:"Defensive",
  4:"Aggresive",
  5:"Evasive",
  6:"Warding",
  7:"Aquatic",
  8:"Amphibious",
  9:"Psychic",
  10:"Acrobatic",
  11:"Warm-blooded",
  12:"Leader",
  13:"Leaping",
  14:"Arctic",
  15:"Flying",
  16:"Poisonous",
  17:"Rampage",
  18:"Revenge",
  19:"Kamikaze",
  20:"Swapper",
  21:"Vampire",
  22:"Rage",
  23:"Momentum",
  24:"Plague",
  25:"Ranged",
  26:"Witchdoctor",
  27:"Turtle",
  28:"Esper",
  29:"Wildcard",
  30:"Flaming",
  31:"Lava Monster",
  32:"Rooted",
  33:"Divine",
  34:"Wraith",
  35:"Sushi Chef",
  36:"Octopus",
  37:"Police Officer", // may not fit game vibe
  38:"Romanian", // may not fit game vibe
  39:"Tank",
  40:"President",
  41:"Enlightened",
  42:"Princess",
  43:"Speedster",
  44:"Communist",
  45:"Accuracy",
  46:"Martial Artist",
  47:"Arsonist",
}

export const num_abilities = Object.keys(ability_names).length;

export const type_ability_names = {
  "Blood": [
    "Regenerating", "Warm-blooded", "Vampire", "Rage", 
  ],
  "Pyromaniac": [
    "Flaming", "Lava Monster", "Arsonist",
  ],
  "Power": [
    "Electric", "Kamikaze", 
  ],
  "Nature": [
    "Leaping", "Turtle", "Rooted", "Flying", "Octopus",
  ],
  "Toxic": [
    "Poisonous", "Plague", 
  ],
  "Marine": [
    "Aquatic", "Amphibious", "Octopus",
  ],
  "Paranormal": [
    "Psychic", "Divine", 
  ],
  "Enchanted": [
    "Witchdoctor", "Esper", 
  ],
  // "Dark": [
  //   "Revenge", "Plague", "Wildcard", 
  // ],
  "Dark": [
    "Acrobatic", "Leaping",
  ],
}

export const neutral_ability_names = [
  "Undying",
  "Defensive",
  "Aggresive",
  "Evasive",
  "Warding",
  "Acrobatic",
  "Warm-blooded",
  "Leader",
  "Arctic",
  "Rampage",
  "Swapper",
  "Vampire",
  "Rage",
  "Momentum",
  "Ranged",
  "Wraith",
  "Sushi Chef",
  "Tank",
  "President",
  "Enlightened",
  "Princess",
  "Speedster",
  "Communist",
  "Accuracy",
  "Martial Artist",
  "Arsonist",
];

export const mutual_exclusions = [
  ["Electric", "Aquatic", "Amphibious", "Octopus"],
  ["Leaping", "Acrobatic", "Flying", "Wraith"],
  ["Speedster", "Tank"],

  ["Undying", "Regenerating", "Flying", "Turtle", "Ranged"],
  ["Flaming", "Lava Monster", "Aquatic", "Amphibious", "Octopus"],
  ["Defensive", "Aggresive", "Evasive"],
  ["Warding", "Witchdoctor", "Esper"],
];

export const ability_descriptions = {
  "Electric"      : "Spirit can walk on water tiles. Every turn, it and all other spirits in connected water tiles will take damage.",
  "Undying"       : "Upon getting KOed, spirit is stunned rather than being removed from the battlefield.",
  "Regenerating"  : "Spirit passively regenerates health each turn and during battle.", // IMPLEMENTED
  "Defensive"     : "Spirit has an incoming damage reduction when defending in combat.", // IMPLEMENTED
  "Aggresive"     : "Spirit has a damage boost when attacking in combat.", // IMPLEMENTED
  "Evasive"       : "Dodge chance is increased.", // IMPLEMENTED
  "Warding"       : "Spirit is immune to curses.",
  "Aquatic"       : "Spirit can walk on water tiles.", // IMPLEMENTED
  "Amphibious"    : "Spirit can walk on water tiles and gets an HP, & DMG boost in water.", // IMPLEMENTED
  "Psychic"       : "Spirit can use portal tiles.", // IMPLEMENTED
  "Acrobatic"     : "Spirit can leapfrog over other spirits.",
  "Warm-blooded"  : "Immunity to freeze.",
  "Leader"        : "Spirit gives HP and DMG boost to allies within 1 tile of it.", 
  "Leaping"       : "Spirit can leap obstacle tiles as well as moving normally.",
  "Arctic"        : "Upon getting KOed or KOing another spirit, enemy spirits with 2 tiles are frozen.", 
  "Flying"        : "Flying spirits can only attack, block, and be attacked by other flying spirits. Can also fly over water tiles.", // PARTIAL IMPLEMENTATION
  "Poisonous"     : "Each turn, enemy spirits within 2 tiles take damage.",
  "Rampage"       : "Spirit gets a damage boost for every KO. Resets on death.",
  "Revenge"       : "If ALL allied spirits are KOed and respawning, HP and DMG are massively increased.",
  "Kamikaze"      : "Upon death, ALL directly adjacent spirits die instantly.",
  "Swapper"       : "During the movement phase, spirit can swap places with any surrounding allied spirit.",
  "Vampire"       : "Spirit heals upon KOing enemy spirits.",
  "Rage"          : "Spirit's damage increases as it gets closer to death.",
  "Momentum"      : "Entering the battlefield does not consume a turn.", // IMPLEMENTED
  "Plague"        : "During combat, enemy spirit takes damage each turn.", // IMPLEMENTED
  "Ranged"        : "Spirit can attack flying spirits. Flying spirits may still fly over this spirit.",
  "Witchdoctor"   : "Spirit can give up its movement phase to curse another spirit for 2 to 3 turns. Cursed spirits cannot move.",
  "Turtle"        : "After 5 or more turns of not moving, spirit gets an HP boost. Boost is lost on movement.",
  "Esper"         : "Spirit can use portal tiles. Spirit can give up its movement phase to curse another spirit for 1 to 2 turns.", // PARTIAL IMPLEMENTATION
  "Wildcard"      : "During combat, spirit's random damage variation is increased (and skewed positive).", // IMPLEMENTED
  "Flaming"       : "After combat with a flaming spirit, enemy spirits are lit on fire.",
  "Lava Monster"  : "Lava Monster spirits deal massive damage to burning spirits. After combat, enemy spirits are set on fire.",
  "Rooted"        : "Spirit gets an enourmous stat boost when adjacent to a water tile, at the cost of a lower dodge chance.",
  "Divine"        : "Meditation also heals spirit.", // IMPLEMENTED
  "Wraith"        : "Dodge chance is increased. Can move through walls.", // IMPLEMENTED
  "Sushi Chef"    : "Spirit does massive damage to marine type spirits.",
  "Octopus"       : "Spirit can walk on water tiles and has increased attack range.", // PARTIAL IMPLEMENTATION
  // "Police Officer": "Does massive damage to dark type spirits.",
  // "Romanian"      : "Spirit has a chance to steal enemy abilities upon KOing them.",
  "Tank"          : "Incoming damage is halved. Movement range is reduced.",
  "President"     : "Spirit has unparalleled damage resistance and attack power. However upon death all allied spirits die as well.",
  "Enlightened"   : "Meditation damage boost is increased.", // IMPLEMENTED
  "Princess"      : "Nearby nature type spirits regenerate HP every turn and get a damage boost.",
  "Speedster"     : "Movement range is increased.",
  "Communist"     : "When combat is initiated, communist spirit's HP is set to be equal to enemy HP.",
  "Accuracy"      : "Enemy dodge chance reduced during combat.", // IMPLEMENTED
  "Martial Artist": "Successful dodges grant a damage boost.", // IMPLEMENTED
  "Arsonist"      : "Gains a damage boost for every enemy succesfully burned.", // IMPLEMENTED
}