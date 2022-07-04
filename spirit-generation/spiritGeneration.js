import { GetColorName } from 'hex-color-to-color-name';
import { type_ability_names, neutral_ability_names } from './assets/abilities.js';
import { healthWords, attackWords, lowTierWords, highTierWords } from './assets/words.js';

function sfc32(a, b, c, d) {
  return function() {
    a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0; 
    var t = (a + b) | 0;
    a = b ^ b >>> 9;
    b = c + (c << 3) | 0;
    c = (c << 21 | c >>> 11);
    d = d + 1 | 0;
    t = t + d | 0;
    c = c + t | 0;
    return (t >>> 0) / 4294967296;
  }
}

function flipArray(toFlip) {
  let arr = fakeDeepCopy(toFlip);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = arr[i].reverse();
  }
  return arr;
}

function padArray(arr, amount) {
  for (let i = 0; i < amount; i++) {
    for (let j = 0; j < arr.length; j++) {
      arr[j].unshift(0);
      arr[j].push(0);
    }
  }

  for (let i = 0; i < amount; i++) {
    const zeroRow = [];
    zeroRow.length = arr[0].length;
    zeroRow.fill(0);
    arr.unshift(zeroRow);
    arr.push(fakeDeepCopy(zeroRow));
  }
}

function validQuery(x, y, arr) {
  return (x > 0 && y > 0 && x < arr.length && y < arr[0].length);
}

function isOutline(x, y, arr) {
  if (arr[x][y] !== 0) { return false; }
  for (let dx = -1; dx <= 1; dx++) {
    if (validQuery(x + dx, y, arr) && arr[x + dx][y] == 1) {
      return true;
    }
  }
  for (let dy = -1; dy <= 1; dy++) {
    if (validQuery(x, y + dy, arr) && arr[x][y + dy] == 1) {
      return true;
    }
  }
  return false;
}

// NOT an actual deep copy, but since we just need to use it for objects that contains
// numbers and arrays of numbers, it should be ok. BE WARNED: THIS FUNCTION IS DANGEROUS!
function fakeDeepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function rgbToHsl(red, grn, blu) {
  let r = red / 255;
  let g = grn / 255;
  let b = blu / 255;

  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }

    h /= 6;
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function getHueType(hsl) {
  const HUES_TABLE = [
    {low: 0, high: 15, value: "Blood"},
    {low: 20, high: 35, value: "Pyromaniac"},
    {low: 55, high: 65, value: "Power"},
    {low: 90, high: 135, value: "Nature"},
    {low: 140, high: 155, value: "Toxic"},
    {low: 170, high: 240, value: "Marine"},
    {low: 255, high: 285, value: "Paranormal"},
    {low: 290, high: 330, value: "Enchanted"},
  ];
  
  for (let i = 0; i < HUES_TABLE.length; i++) {
    const range = HUES_TABLE[i];
    if (hsl[0] >= range.low && hsl[0] <= range.high) {
      // This means it is in the proper hue range, but
      // we also need to check that the saturation or
      // lightness aren't too low.
      if (hsl[1] > 40 && hsl[2] > 40) {
        return range.value;
      }
    }
  }
  
  return null;
}

export function createRandomSpirit(seed) {
  /* Let's define some properties of spirits! */

  const TIER_LIST = ["F", "D", "C", "B", "A", "S"]; 
  const MAX_LEVEL = TIER_LIST.length; // 6
  const SPEEDS_LIST = ["Last", "Uber Slow", "Slow", "Normal", "Quick", "Fast", "Uber Fast"];
  const MAX_ABILITIES = [1, 2, 3, 3, 3, 4];
  
  /* [===== ========================== =====] */

  // Seeding the PRNG function:
  const rand = sfc32(seed, seed * seed, seed * 10, seed / 10);
  const random = function(min, max) {
    return Math.max(min, Math.floor(rand() * max));
  };

  // The line below gives us a number in [0, MAX_LEVEL), so we add one to 
  // that to ensure level = MAX_LEVEL be possible, and level = 0 be impossible.
  // We take the cube of rand() (which is in [0, 1]) to reduce the probability of higher levels.
  const level = Math.floor((rand() ** 3) * MAX_LEVEL) + 1;
  const tier = TIER_LIST[level - 1];

  /* [===== =========================== =====] */
  /* Random color and associated type creation */

  // First, we define a function that returns a number between 52 and 256.
  // This is one r, g or b component of a color. Min is 52 arbitrarily, just worked out.
  const comp = function() { return random(52, 256) }
  const darkFactor = random(20, 50); // Arbitrary numbers
  // Second, we define a function that will take some rgb color component and return
  // the same value in hexadecimal, with a guarantee that it has two digits (pads if needed).
  const compToHex = function(comp) {
    const hex = comp.toString(16);
    return (hex.length === 1) ? "0" + hex : hex;
  }
  
  const r = comp(); const b = comp(); const g = comp();
  const dr = r - darkFactor; const dg = g - darkFactor; const db = b - darkFactor;
  // Above line is just a linear darkening. Not pretty, but ok for now.

  const lightColor = "#" + compToHex(r) + compToHex(g) + compToHex(b);
  const darkColor = "#" + compToHex(dr) + compToHex(dg) + compToHex(db);

  const hsl = rgbToHsl(r, g, b);
  let type = getHueType(hsl);
  if (hsl[2] < 30 && !type) {
    type = "Dark";
  }

  console.log(hsl);

  /* [===== ========= =====] */
  /* Spirit stats generation */

  // Multiply by random(x, y) for some variance in points, the numbers are arbitrary.
  let points = random(80, 120) * (level + (MAX_LEVEL / 3));
  let HP = 0; let ATK = 0;
  while (points > 0) {
    const amount = random(1, Math.max(5, Math.floor(points / 3))); // Seems to increase randomness of stat spread...
    if (rand() < 0.6) { // 0.6 is arbitrary, but we want generally want HP >> ATK to avoid one-shotting.
      HP += amount;
    } else {
      ATK += amount;
    }
    points -= amount;
  }

  let speed = 0;
  for (let i = 0; i < level; i++) {
    speed = Math.max(speed, Math.floor((rand() ** 2) * SPEEDS_LIST.length));
  }

  // The chance of getting an ability starts off high and decreases with each ability gained.
  // Each tier or level has a maximum number of abilities. Each level equals a chance to get an ability.
  // Any spirit can get neutral abilities, but typed abilities are exclusive. Typed spirits get a 
  // type-specific ability guaranteed.
  const abilities = [];
  const specific = (type) ? type_ability_names[type] : [];
  if (type) {
    abilities.push(specific[random(0, specific.length)]);
  }
  const pool = neutral_ability_names.concat(specific);
  
  let chance = 0.8;
  for (let i = 0; i < level; i++) {
    if (abilities.length < MAX_ABILITIES[level - 1] && rand() < chance) {
      const new_ability = pool[random(0, pool.length)];
      if (!abilities.includes(new_ability)) {
        abilities.push(new_ability);
        chance *= 0.8;
      } else {
        i--; // If it would be a duplicate, try again.
      }
    }
  }

  /* [===== ============================ =====] */
  /* Sprite array creation process starts here: */
  
  let spriteSize = level * 2 + 4;
  // We start with a square 2d array filled with zeroes, that is half of a 
  // spriteSize x spriteSize square. This way we can copy it for symmetry later.
  const sprite = new Array(spriteSize).fill(0).map(() => new Array(spriteSize / 2).fill(0));
  
  // Next, we initialize each cell randomly to either 0 or 1.
  for (let i = 0; i < spriteSize; i++) {
    for (let j = 0; j < spriteSize / 2; j++) {
      sprite[i][j] = random(0, 2);
    }
  }

  // This is the meat of the sprite creation process. This idea is based on the
  // Game of Life; any live cell with at least 2 live neighbors lives, any dead cell
  // with less than 3 live neighbors comes alive. The numbers 2 and 3 are arbitrary, 
  // I chose them just from fiddling around and keeping what worked best.
  const iterations = random(0, 3);
  for (let itr = 0; itr < iterations; itr++) {
    for (let i = 0; i < spriteSize; i++) {
      for (let j = 0; j < spriteSize / 2; j++) {
        const alive = (sprite[i][j] === 1);
        let liveNeighbors = 0;
  
        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            if (validQuery(i+dx, j+dy, sprite) && !((dx === 0) &&(dy === 0))) {
              liveNeighbors += sprite[i + dx][j + dy];
            }
          }
        }
  
        if ((alive && liveNeighbors > 1 && liveNeighbors < 4) || (!alive && liveNeighbors < 3)) {
          sprite[i][j] = 1;
        } else {
          sprite[i][j] = 0;
        }
      }
    }
  }

  // Now we can copy and flip the array, then combine those two arrays to make
  // our sprite. We also pad the array with zeroes all around in preparation for 
  // the following outlining step. We must pad by at least 1 for outlining to sucseed.
  const flipped = flipArray(sprite);
  for (let i = 0; i < spriteSize; i++) {
    sprite[i] = sprite[i].concat(flipped[i]);
  }
  const diff = 2 + (MAX_LEVEL - level);
  padArray(sprite, diff); spriteSize += diff*2;

  // Finally, we just need to give the sprite an outline. We do this by iterating
  // over the array, and setting the value of any dead cell with an adjacent live
  // cell to 2. We also pad it again after outlining.
  for (let i = 0; i < spriteSize; i++) {
    for (let j = 0; j < spriteSize; j++) {
      if (isOutline(i, j, sprite)) {
        sprite[i][j] = 2;
      }
    }
  }

  /* [===== =================== =====] */
  /* Build name based on stats & color */

  let name_ = "";
  let modifiers = [];
  if (level > 2) {
    if (HP > ATK*4) {
      // If health is unusually high compared to attack, we add a modifier. We don't
      // just use some arbitrary threashold since then S tiers would almost always have one,
      // and B or C would almost never.
      modifiers.push(healthWords[random(0, healthWords.length - 1)]);
    }
    if (ATK*2 > HP) {
      // If attack is unusually high compared to health, we add a modifier for it.
      modifiers.push(attackWords[random(0, attackWords.length - 1)]);
    }
    if ((rand() > 0.5 || modifiers.length === 0) && level === MAX_LEVEL) {
      // If we don't have any modifiers, or just randomly sometimes, we add a generic high tier one.
      modifiers.push(highTierWords[random(0, highTierWords.length - 1)]);
    }
  } else if (level === 1) {
    // F tier spirits get bad modifiers.
    modifiers.push(lowTierWords[random(0, lowTierWords.length - 1)]);
  }
  modifiers.push(GetColorName(lightColor)); // Color comes last
  
  for (let i = 0; i < modifiers.length; i++) { // Add all the modifiers
    name_ += modifiers[i] + " ";
  }
  name_ +=  "Spirit";

  /* [===== =================== =====] */

  const spirit = {
    name: name_,
    level: level,
    tier: tier,
    seed: seed,

    HP: HP,
    ATK: ATK,
    speed: SPEEDS_LIST[speed],
    SPD: speed,
    type: type,
    abilities: abilities,

    sprite: fakeDeepCopy(sprite),
    lightColor: lightColor,
    darkColor: darkColor,
  }
  return spirit;
}