function getParent(tile) {
  const [x,y,z] = tile;
  return [x>>1,y>>1,z-1];
}
function getChildren(tile) {
  const [x,y,z] = tile;
  return [
    [x * 2,     y * 2,     z+1], // +0, +0
    [x * 2,     y * 2 + 1, z+1], // +0, +1
    [x * 2 + 1, y * 2,     z+1], // +1, +0
    [x * 2 + 1, y * 2 + 1, z+1], // +1, +1
  ];
}

function tileToTilehash(tile) {
  let [x,y,z] = tile;
  if (z % 2 !== 0) {
    throw new Error('z must be divisible by 2')
  }
  // console.log('starting with ', tile)
  let out = BigInt(0);
  const maxZ = z;
  while (z>0) {
    const thisTile = [x,y,z];
    const parent = getParent(thisTile);
    const childrenOfParent = getChildren(parent);
    const positionInParent = childrenOfParent.findIndex(([xx, xy, xz]) => xx === x && xy === y && xz === z);
    // console.log('parent', parent);
    // console.log('pos in parent', positionInParent);
    out += (BigInt(positionInParent) << 2n * BigInt(maxZ - z));
    x = parent[0];
    y = parent[1];
    z = parent[2];
  }
  return out.toString(16);
}

function tilehashToTile(th) {
  const int = BigInt(`0o` + th);
  let bitLen = BigInt(th.length * 4);
  let scratchInt = int;
  // [x,y,z][4]
  let children = getChildren([0,0,0]);
  let lastChild;
  for (let i = bitLen - 2n; i >= 0n; i -= 2n) {
    const posInChildren = scratchInt >> i;
    // console.log(i, posInChildren);
    lastChild = children[posInChildren];
    children = getChildren(lastChild);
    scratchInt = scratchInt & ((2n**i)-1n);
    // console.log(scratchInt, lastChild);
  }
  return lastChild;
}

module.exports = {
  tileToTilehash,
  tilehashToTile,
}
