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
}

export const num_abilities = Object.keys(ability_names).length;

export const ability_descriptions = {
  0:"Spirit can walk on water tiles. Every turn, it and all other spirits in connected water tiles will take damage.", // potentially scalable
  1:"Upon getting KOed, spirit is stunned rather than being removed from the battlefield.", // ! MAY BE DIFFICULT TO IMPLEMENT
  2:"Spirit passively regenerates health each turn.", // potentially scalable
  3:"Spirit has an incoming damage reduction when defending in combat.", // potentially scalable
  4:"Spirit has a DMG boost when attacking in combat.", // potentially scalable
  5:"Spirit has an increased chance to dodge attacks.", // potentially scalable
  6:"Spirit is immune to curses.",
  7:"Spirit can walk on water tiles.",
  8:"Spirit can walk on water tiles and gets a priority, HP, & DMG boost in water.",  // potentially scalable
  9:"Spirit can use portal tiles.",
  10:"Spirit can leapfrog over enemy spirits.", // ! MAY BE DIFFICULT TO IMPLEMENT
  11:"Immunity to freeze.",
  12:"Spirit gives HP and DMG boost to allies within 1 tile of it.",  // potentially scalable
  13:"Spirit can leap obstacle tiles as well as moving normally.", // ! MAY BE DIFFICULT TO IMPLEMENT
  14:"Upon getting KOed or KOing another spirit, enemy spirits with 2 tiles are frozen.", 
  15:"Flying spirits can only attack, block, and be attacked by other flying spirits. Can also fly over water tiles.",
  16:"Each turn, enemy spirits within 2 tiles take damage.", // potentially scalable
  17:"Spirit gets a DMG boost for every KO. Resets on death.",  // potentially scalable
  18:"If ALL allied spirits are KOed and respawning, HP and DMG are tripled.", // may need fine tuning
  19:"Upon death, ALL directly adjacent spirits die instantly.", // may need fine tuning
  20:"During the movement phase, spirit can swap places with any surrounding allied spirit.",
  21:"Spirit heals upon KOing enemy spirits.", // potentially scalable
  22:"Spirit's damage increases as it gets closer to death.", // potentially scalable
  23:"Entering the battlefield does not consume a turn.",
  24:"During combat, enemy spirit takes damage each turn.", // potentially scalable
  25:"Spirit can attack flying spirits. Flying spirits may still fly over this spirit.",
  26:"Spirit can give up its movement phase to curse another spirit for 2 to 3 turns. Cursed spirits cannot move.",
  27:"After 5 or more turns of not moving, spirit gets an HP boost.", // potentially scalable
  28:"Spirit can use portal tiles. Spirit can give up its movement phase to curse another spirit for 1 to 2 turns.",
  29:"During combat, spirit's random damage variation is increased (and skewed positive).", // potentially scalable
}