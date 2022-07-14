export const type_ability_names = {
  "Blood": [
    "Regeneration", "Warm-blooded", "Vampire", "Rage", 
  ],
  "Pyromaniac": [
    "Flaming", "Heat Wave", "Arsonist",
  ],
  "Power": [
    "Electric", "Kamikaze", "Nuker",
  ],
  "Nature": [
    "Leaping", "Turtle", "Rooted", "Flying",
  ],
  "Toxic": [
    "Poisonous", "Plague", "Venom",
  ],
  "Marine": [
    "Aquatic", "Amphibious", "Octopus", "Arctic", "Wet",
  ],
  "Paranormal": [
    "Psychic", "Piggybacker", "Clairvoyant"
  ],
  "Enchanted": [
    "Witchdoctor", "Esper", "Divine", 
  ],
  "Dark": [
    "Revenge", "Plague", "Wildcard", "Demonic", "Undying", "Wraith",
  ],
}

export const neutral_ability_names = [
  "Defensive",
  "Aggresive",
  "Evasive",
  "Warding",
  "Acrobatic",
  "Leader",
  "Rampage",
  "Swapper",
  "Sushi Chef",
  "Tank",
  "Hivemind",
  "Enlightened",
  "Farmer"  ,
  "Speedster",
  "Accuracy",
  "Martial Artist",
  "Communist",
  "Glacial Storm",
  // "Undying",
  // "Warm-blooded",
  // "Arctic",
  // "Vampire",
  // "Rage",
  // "Arsonist",
  // "Demonic",
  // "Venom",
  // "Piggybacker",
  // "Clairvoyant",
  // "Nuker",
];

export const mutual_exclusions = [
  ["Electric", "Aquatic", "Amphibious", "Octopus"], // shouldn't have multiple water tile walker abilities
  ["Leaping", "Acrobatic", "Flying", "Wraith"], // shouldn't have multiple mobility abilities
  ["Psychic", "Esper", "Clairvoyant"], // shouldn't have multiple portal user abilities
  ["Speedster", "Tank"], // shouldn't have multiple speed modifiers

  // ["Undying", "Regeneration", "Flying", "Turtle"], 
  // ["Defensive", "Aggresive", "Evasive"], 
  ["Flaming", "Heat Wave", "Aquatic", "Amphibious", "Octopus", "Arctic"], // these just don't make sense together element wise
  ["Warding", "Witchdoctor", "Esper"], // shouldn't have multiple curse related abilities
];

export const ability_descriptions = {
  "Hivemind"      : "Spirit has unparalleled damage resistance and attack power. However upon death all allied spirits die as well.",
  "Witchdoctor"   : "Spirit can give up its movement phase to curse another spirit for 2 to 3 turns. Cursed spirits cannot move.",
  "Rooted"        : "Spirit gets an large stat boost when adjacent to a water tile, at the cost of a lower dodge chance.",
  "Revenge"       : "If ALL allied spirits are KOed and respawning, resistance & damage are massively increased.",
  "Swapper"       : "During the movement phase, spirit can swap places with any surrounding allied spirit.",
  "Farmer"        : "Nature type spirits within 2 tiles regenerate HP every turn and get a damage boost.",
  "Communist"     : "When combat is initiated, communist spirit's HP is set to be equal to enemy HP.",
  "Piggybacker"   : "Spirit can give up its movement phase to swap places with any allied spirit.",
  "Leader"        : "Spirit gives resistance & damage boost to allies within 1 tile of it.", 
  "Venom"         : "After combat, enemy spirits take damage every turn until they move.",
  "Kamikaze"      : "Upon death, all directly adjacent spirits take massive damage.",
  "Glacial Storm" : "On death, all enemy spirits have a chance to be frozen.",
  "Poisonous"     : "Each turn, enemy spirits within 2 tiles take damage.",
  "Wet"           : "Spirit is immune to burning.",
  "Warding"       : "Spirit is immune to curses.",
  
  // PARTIALLY IMPLEMENTED
  "Electric"      : "Spirit can walk on water tiles. Every turn, it and all other spirits in connected water tiles will take damage.",
  "Esper"         : "Spirit can use portal tiles. Spirit can give up its movement phase to curse another spirit for 1 to 2 turns.",
  "Arsonist"      : "Attacks can light enemies ablaze. Gains a damage boost for every succesfully burn.",
  
  // IMPLEMENTED
  "Turtle"        : "After 5 or more turns of not moving, spirit gains regeneration & resistance. Boost is lost on movement.",
  "Undying"       : "Upon getting KOed on an empty tile, spirit is stunned rather than being removed from the battlefield.",
  "Heat Wave"     : "Spirit deals massive damage to burning spirits. Charge attacks set enemy spirits on fire.",
  "Wildcard"      : "During combat, spirit's random damage variation is increased (and skewed positive).",
  "Amphibious"    : "Spirit can walk on water tiles and gets resistance & damage boost in water.",
  "Wraith"        : "Dodge chance is increased. Allied spirits can pass through this spirit.",
  "Nuker"         : "Charge attacks do extra damage. Meditation damage resistance reduced.",
  "Defensive"     : "Spirit has an incoming damage reduction when defending in combat.",
  "Regeneration"  : "Spirit passively regenerates health each turn and during battle.",
  "Octopus"       : "Spirit can walk on water tiles and has increased attack range.",
  "Leaping"       : "Spirit can leap obstacle tiles as well as moving normally.",
  "Flying"        : "Flying spirits can fly over other spirits and water tiles.",
  "Rampage"       : "Spirit gets a damage boost for every KO. Resets on death.",
  "Arctic"        : "Succesful attacks have a chance to freeze enemy spirits.", 
  "Rage"          : "Spirit's damage increases as it gets closer to death.",
  "Flaming"       : "Attacks have a chance to light enemy spirits on fire.",
  "Tank"          : "Incoming damage is halved. Movement range is reduced.",
  "Plague"        : "During combat, enemy spirit takes damage each turn.",
  "Aggresive"     : "Spirit has a damage boost when attacking in combat.",
  "Sushi Chef"    : "Spirit does massive damage to marine type spirits.",
  "Clairvoyant"   : "Using portal tiles does not consume a turn.",
  "Accuracy"      : "Enemy dodge chance reduced during combat.",
  "Martial Artist": "Successful dodges grant a damage boost.",
  "Acrobatic"     : "Spirit can leapfrog over other spirits.",
  "Vampire"       : "Spirit heals upon KOing enemy spirits.",
  "Demonic"       : "Enemy spirits cannot flee from combat.",
  "Enlightened"   : "Meditation damage boost is increased.",
  "Aquatic"       : "Spirit can walk on water tiles.",
  "Divine"        : "Meditation also heals spirit.",
  "Speedster"     : "Movement range is increased.",
  "Psychic"       : "Spirit can use portal tiles.",
  "Evasive"       : "Dodge chance is increased.",
  "Warm-blooded"  : "Immunity to freeze.",
}