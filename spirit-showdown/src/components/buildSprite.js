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