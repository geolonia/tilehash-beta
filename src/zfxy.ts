export type ZFXYTile = [number, number, number, number];

export function getParent(tile: ZFXYTile): ZFXYTile {
  const [f,x,y,z] = tile;
  return [f>>1,x>>1,y>>1,z-1];
}
export function getChildren(tile: ZFXYTile): ZFXYTile[] {
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

export function generate(tile: ZFXYTile): string {
  let [f,x,y,z] = tile;
  // console.log('starting with ', tile)
  let out = BigInt(0);
  const maxZ = z;
  while (z>0) {
    const thisTile: ZFXYTile = [f,x,y,z];
    const parent = getParent(thisTile);
    const childrenOfParent = getChildren(parent);
    const positionInParent = childrenOfParent.findIndex(
      ([xf, xx, xy, xz]) => xf === f && xx === x && xy === y && xz === z
    );
    // console.log('parent', parent);
    // console.log('pos in parent', positionInParent);
    out += (BigInt(positionInParent) << BigInt(3) * BigInt(maxZ - z));
    f = parent[0];
    x = parent[1];
    y = parent[2];
    z = parent[3];
  }
  return out.toString(8);
}

export function parse(th: string): ZFXYTile {
  const int = BigInt(`0o` + th);
  let bitLen = BigInt(th.length * 3);
  let scratchInt = int;
  let children = getChildren([0,0,0,0]);
  let lastChild;
  for (let i = bitLen - BigInt(3); i >= BigInt(0); i -= BigInt(3)) {
    const posInChildren = scratchInt >> i;
    lastChild = children[Number(posInChildren)];
    children = getChildren(lastChild);
    scratchInt = scratchInt & ((BigInt(2)**i)-BigInt(1));
  }
  return lastChild;
}

export function toURL(input: ZFXYTile | string): string {
  let tile: ZFXYTile;
  if (typeof input === 'string') {
    tile = parse(input);
  } else {
    tile = input;
  }
  const [f,x,y,z] = tile;
  return `${z}/${f}/${x}/${y}`;
}
