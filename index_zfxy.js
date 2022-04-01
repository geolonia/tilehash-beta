function getParent(tile) {
  const [f,x,y,z] = tile;
  return [f>>1,x>>1,y>>1,z-1];
}
function getChildren(tile) {
  const [f,x,y,z] = tile;
  return [
    [f * 2,     x * 2,     y * 2,     z+1], // +0, +0, +0
    [f * 2,     x * 2,     y * 2 + 1, z+1], // +0, +0, +1
    [f * 2,     x * 2 + 1, y * 2,     z+1], // +0, +1, +0
    [f * 2,     x * 2 + 1, y * 2 + 1, z+1], // +0, +1, +1
    [f * 2 + 1, x * 2,     y * 2,     z+1], // +1, +0, +0
    [f * 2 + 1, x * 2,     y * 2 + 1, z+1], // +1, +0, +1
    [f * 2 + 1, x * 2 + 1, y * 2,     z+1], // +1, +1, +0
    [f * 2 + 1, x * 2 + 1, y * 2 + 1, z+1], // +1, +1, +1
  ];
}

function tileToTilehash(tile) {
  let [f,x,y,z] = tile;
  // console.log('starting with ', tile)
  let out = BigInt(0);
  const maxZ = z;
  while (z>0) {
    const thisTile = [f,x,y,z];
    const parent = getParent(thisTile);
    const childrenOfParent = getChildren(parent);
    const positionInParent = childrenOfParent.findIndex(
      ([xf, xx, xy, xz]) => xf === f && xx === x && xy === y && xz === z
    );
    // console.log('parent', parent);
    // console.log('pos in parent', positionInParent);
    out += (BigInt(positionInParent) << 3n * BigInt(maxZ - z));
    f = parent[0];
    x = parent[1];
    y = parent[2];
    z = parent[3];
  }
  return out.toString(8);
}

function tilehashToTile(th) {
  const int = BigInt(`0o` + th);
  let bitLen = BigInt(th.length * 3);
  let scratchInt = int;
  // [f,x,y,z][4]
  let children = getChildren([0,0,0,0]);
  // [ 
  //   [ 0, 0, 1 ], 
  //   [ 0, 1, 1 ], 
  //   [ 1, 0, 1 ], 
  //   [ 1, 1, 1 ] 
  // ];
  let lastChild;
  for (let i = bitLen - 3n; i >= 0n; i -= 3n) {
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
