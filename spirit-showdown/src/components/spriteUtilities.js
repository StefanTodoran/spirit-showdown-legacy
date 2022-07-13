// Builds up a sprite from the array row by row using the provided tile
// functions. The returned list will be ready to display.
export function buildSprite(spirit, blankTile, fillTile) {
  const sprite = [];

  for (let i = 0; i < spirit.sprite.length; i++) {
    const row = [];
    for (let j = 0; j < spirit.sprite[i].length; j++) {
      const color = (spirit.sprite[i][j] === 1) ? spirit.lightColor : spirit.darkColor;
      const tile = (spirit.sprite[i][j] === 0) ? blankTile(i, j) : fillTile(i, j, color);
      row.push(tile);
    }
    sprite.push(
      <div key={`sprite-row<${i}>`} className='sprite-row' style={{ display: 'flex', flexDirection: 'row', margin: 0 }}>
        {row}
      </div>
    );
  }

  return sprite;
}

// Return whether or not the given spirit has the given effect.
export function hasEffect(spirit, effect) {
  const matches = spirit.effects.filter(e => e.effect === effect);
  return matches.length !== 0;
}

// Return whether or not the given spirit has the given effect and it is active.
export function activeEffect(spirit, effect) {
  const matches = spirit.effects.filter(e => e.effect === effect);
  if (matches.length !== 0) {
    return matches[0].display;
  }
  return false;
}

export function createFire(spirit, amount, spread, size = 5) {
  const fire = [];

  if (hasEffect(spirit, "Burning")) {
    for (let i = 0; i < amount; i++) {
      fire.push(
        <div key={`fire-particle<${i}>`} className={'fire-particle'} 
          style={{
            "--distance": Math.random() * spread, "--delay": `${Math.random() - 0.5}s`, "--size": `${size}px`,
            "--offset-x": `${Math.random() * spread - (spread/2)}px`, "--offset-y": `${Math.random() * spread - (spread/2)}px`,
          }}
        />
      );
    }
  }

  return fire;
}