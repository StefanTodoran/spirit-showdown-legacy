# Dictionary of ID -> name
names = {
0:"Ghost",
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
24:"Plague"
}

# How many abilities exist
count = len(names)

# Dictionary of ID -> description
descriptions = {
0:"Spirit can occupy the same tile as another.",
1:"Upon getting KOed, spirit is stunned rather than being removed from the battlefield.",
2:"Spirit passively regenerates health each turn.", # potentially scalable
3:"Spirit has an HP boost when defending in combat.", # potentially scalable
4:"Spirit has a DMG boost when attacking in combat.", # potentially scalable
5:"Spirit can flee from combat.",
6:"Spirit is immune to curses.",
7:"Spirit can walk on water tiles.",
8:"Spirit gets a priority, HP, & DMG boost in water.",  # potentially scalable
9:"Spirit can use portal tiles.",
10:"Spirit can leap over water tiles.",
11:"Immunity to freeze.",
12:"Spirit gives HP and DMG boost to allies within 1 tile of it.",  # potentially scalable
13:"Spirit can leap over tiles as well as moving normally.",
14:"Upon getting KOed or KOing another spirit, enemy spirits with 2 tiles are frozen.", 
15:"Flying spirits can only attack, block, and or attacked by other flying spirits.",
16:"Each turn, enemy spirits within 2 tiles take damage.", # potentially scalable
17:"Spirit gets a DMG boost for every KO. Resets on death.",  # potentially scalable
18:"If all allied spirits are KOed and respawning, HP and DMG are tripled.", # may need fine tuning
19:"Upon death, ALL directly adjacent spirits die instantly.", # may need fine tuning
20:"During the movement phase, spirit can swap places with any surrounding allied spirit.",
21:"Spirit heals upon KOing enemy spirits.", # potentially scalable
22:"Spirit's damage increases as it gets closer to death.", # potentially scalable
23:"Spirit can move on the same turn it enters the battlefield.",
24:"Spirit's attacks instantly KO enemy spirits, but it also instantly dies to enemy spirit attacks." # may need fine tuning
}