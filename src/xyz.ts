export type XYZTile = [number, number, number];

export function getParent(tile: XYZTile): XYZTile {
  const [x,y,z] = tile;
  return [x>>1,y>>1,z-1];
}
export function getChildren(tile: XYZTile): XYZTile[] {
  const [x,y,z] = tile;
  return [
    [x * 2,     y * 2,     z+1], // +0, +0
    [x * 2,     y * 2 + 1, z+1], // +0, +1
    [x * 2 + 1, y * 2,     z+1], // +1, +0
    [x * 2 + 1, y * 2 + 1, z+1], // +1, +1
  ];
}

export function generate(tile: XYZTile): string {
  let [x,y,z] = tile;
  if (z % 2 !== 0) {
    throw new Error('z must be divisible by 2')
  }
  let out = BigInt(0);
  const maxZ = z;
  while (z>0) {
    const thisTile: XYZTile = [x,y,z];
    const parent = getParent(thisTile);
    const childrenOfParent = getChildren(parent);
    const positionInParent = childrenOfParent.findIndex(([xx, xy, xz]) => xx === x && xy === y && xz === z);
    out += (BigInt(positionInParent) << BigInt(2) * BigInt(maxZ - z));
    x = parent[0];
    y = parent[1];
    z = parent[2];
  }
  return out.toString(16);
}

export function parse(th: string): XYZTile {
  const int = BigInt(`0o` + th);
  let bitLen = BigInt(th.length * 4);
  let scratchInt = int;
  let children = getChildren([0,0,0]);
  let lastChild;
  for (let i = bitLen - BigInt(2); i >= BigInt(0); i -= BigInt(2)) {
    const posInChildren = scratchInt >> i;
    lastChild = children[Number(posInChildren)];
    children = getChildren(lastChild);
    scratchInt = scratchInt & ((BigInt(2)**i)-BigInt(1));
  }
  return lastChild;
}
