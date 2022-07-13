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
    "Aquatic", "Amphibious", "Octopus", "Arctic",
  ],
  "Paranormal": [
    "Psychic", "Piggybacker", "Clairvoyant"
  ],
  "Enchanted": [
    "Witchdoctor", "Esper", "Divine", 
  ],
  "Dark": [
    "Revenge", "Plague", "Wildcard", "Demonic"
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
  "Wraith",
  "Sushi Chef",
  "Tank",
  "Hivemind",
  "Enlightened",
  "Farmer"  ,
  "Speedster",
  "Communist",
  "Accuracy",
  "Martial Artist",
  "Arsonist",
  "Demonic",
  "Venom",
  "Piggybacker",
  "Clairvoyant",
  "Nuker",
];

export const mutual_exclusions = [
  ["Electric", "Aquatic", "Amphibious", "Octopus"],
  ["Leaping", "Acrobatic", "Flying", "Wraith"],
  ["Speedster", "Tank"],

  ["Undying", "Regeneration", "Flying", "Turtle"],
  ["Flaming", "Heat Wave", "Aquatic", "Amphibious", "Octopus"],
  ["Psychic", "Esper", "Clairvoyant"],
  ["Defensive", "Aggresive", "Evasive"],
  ["Warding", "Witchdoctor", "Esper"],
];

export const ability_descriptions = {
  "Hivemind"      : "Spirit has unparalleled damage resistance and attack power. However upon death all allied spirits die as well.",
  "Witchdoctor"   : "Spirit can give up its movement phase to curse another spirit for 2 to 3 turns. Cursed spirits cannot move.",
  "Turtle"        : "After 5 or more turns of not moving, spirit gains regeneration & resistance. Boost is lost on movement.",
  "Undying"       : "Upon getting KOed on an empty tile, spirit is stunned rather than being removed from the battlefield.",
  "Rooted"        : "Spirit gets an large stat boost when adjacent to a water tile, at the cost of a lower dodge chance.",
  "Revenge"       : "If ALL allied spirits are KOed and respawning, resistance & damage are massively increased.",
  "Swapper"       : "During the movement phase, spirit can swap places with any surrounding allied spirit.",
  "Farmer"        : "Nature type spirits within 2 tiles regenerate HP every turn and get a damage boost.",
  "Communist"     : "When combat is initiated, communist spirit's HP is set to be equal to enemy HP.",
  "Piggybacker"   : "Spirit can give up its movement phase to swap places with any allied spirit.",
  "Leader"        : "Spirit gives resistanct & damage boost to allies within 1 tile of it.", 
  "Venom"         : "After combat, enemy spirits take damage every turn until they move.",
  "Kamikaze"      : "Upon death, ALL directly adjacent spirits die instantly.",
  "Poisonous"     : "Each turn, enemy spirits within 2 tiles take damage.",
  "Warding"       : "Spirit is immune to curses.",
  "Warm-blooded"  : "Immunity to freeze.",
  
  "Electric"      : "Spirit can walk on water tiles. Every turn, it and all other spirits in connected water tiles will take damage.", // PARTIAL IMPLEMENTATION
  "Esper"         : "Spirit can use portal tiles. Spirit can give up its movement phase to curse another spirit for 1 to 2 turns.", // PARTIAL IMPLEMENTATION
  "Arsonist"      : "Attacks can light enemies ablaze. Gains a damage boost for every succesfully burn.", // PARTIAL IMPLEMENTATION
  "Wraith"        : "Dodge chance is increased. Allied spirits can pass through this spirit.", // PARTIAL IMPLEMENTION
  "Octopus"       : "Spirit can walk on water tiles and has increased attack range.", // PARTIAL IMPLEMENTATION
  "Flying"        : "Flying spirits can fly over other spirits and water tiles.", // PARTIAL IMPLEMENTATION
  
  "Heat Wave"     : "Spirit deals massive damage to burning spirits. Charge attacks set enemy spirits on fire.", // IMPLEMENTED
  "Wildcard"      : "During combat, spirit's random damage variation is increased (and skewed positive).", // IMPLEMENTED
  "Amphibious"    : "Spirit can walk on water tiles and gets resistance & damage boost in water.", // IMPLEMENTED
  "Nuker"         : "Charge attacks do extra damage. Meditation damage resistance reduced.", // IMPLEMENTED
  "Defensive"     : "Spirit has an incoming damage reduction when defending in combat.", // IMPLEMENTED
  "Regeneration"  : "Spirit passively regenerates health each turn and during battle.", // IMPLEMENTED
  "Leaping"       : "Spirit can leap obstacle tiles as well as moving normally.", // IMPLEMENTED
  "Rampage"       : "Spirit gets a damage boost for every KO. Resets on death.", // IMPLEMENTED
  "Arctic"        : "Succesful attacks have a chance to freeze enemy spirits.",  // IMPLEMENTED
  "Rage"          : "Spirit's damage increases as it gets closer to death.", // IMPLEMENTED
  "Flaming"       : "Attacks have a chance to light enemy spirits on fire.", // IMPLEMENTED
  "Tank"          : "Incoming damage is halved. Movement range is reduced.", // IMPLEMENTED
  "Plague"        : "During combat, enemy spirit takes damage each turn.", // IMPLEMENTED
  "Aggresive"     : "Spirit has a damage boost when attacking in combat.", // IMPLEMENTED
  "Sushi Chef"    : "Spirit does massive damage to marine type spirits.", // IMPLEMENTED
  "Clairvoyant"   : "Using portal tiles does not consume a turn.", // IMPLEMENTED
  "Accuracy"      : "Enemy dodge chance reduced during combat.", // IMPLEMENTED
  "Martial Artist": "Successful dodges grant a damage boost.", // IMPLEMENTED
  "Acrobatic"     : "Spirit can leapfrog over other spirits.", // IMPLEMENTED
  "Vampire"       : "Spirit heals upon KOing enemy spirits.", // IMPLEMENTED
  "Demonic"       : "Enemy spirits cannot flee from combat.", // IMPLEMENTED
  "Enlightened"   : "Meditation damage boost is increased.", // IMPLEMENTED
  "Aquatic"       : "Spirit can walk on water tiles.", // IMPLEMENTED
  "Divine"        : "Meditation also heals spirit.", // IMPLEMENTED
  "Speedster"     : "Movement range is increased.", // IMPLEMENTED
  "Psychic"       : "Spirit can use portal tiles.", // IMPLEMENTED
  "Evasive"       : "Dodge chance is increased.", // IMPLEMENTED
}