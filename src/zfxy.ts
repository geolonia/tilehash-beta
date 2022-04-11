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
  let out = '';
  while (z>0) {
    const thisTile: ZFXYTile = [f,x,y,z];
    const parent = getParent(thisTile);
    const childrenOfParent = getChildren(parent);
    const positionInParent = childrenOfParent.findIndex(
      ([xf, xx, xy, xz]) => xf === f && xx === x && xy === y && xz === z
    );
    out = positionInParent.toString(8) + out;
    f = parent[0];
    x = parent[1];
    y = parent[2];
    z = parent[3];
  }
  return out;
}

export function parse(th: string): ZFXYTile {
  let children = getChildren([0,0,0,0]);
  let lastChild: ZFXYTile;
  for (const c of th) {
    lastChild = children[parseInt(c, 8)];
    children = getChildren(lastChild);
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

export interface CalculateZFXYInput {
  lat: number
  lng: number
  elevation?: number
  zoom: number
}

export function calculateZFXY(input: CalculateZFXYInput): ZFXYTile {
  const meters = typeof input.elevation !== 'undefined' ? input.elevation : 0;
  if (meters <= -(2**24) || meters >= (2**24)) {
    throw new Error(`ZFXY only supports elevation between -2^24 and +2^24.`);
  }
  const f = Math.floor(((2 ** input.zoom) * meters) / (2 ** 25)) + (2 ** (input.zoom - 1));

  // Algorithm adapted from tilebelt.js
  const d2r = Math.PI / 180;
  const sin = Math.sin(input.lat * d2r);
  const z2 = 2 ** input.zoom;
  let x = z2 * (input.lng / 360 + 0.5);
  const y = z2 * (0.5 - 0.25 * Math.log((1 + sin) / (1 - sin)) / Math.PI);

  // Wrap Tile X
  x = x % z2;
  if (x < 0) x = x + z2;

  return [
    f,
    Math.floor(x),
    Math.floor(y),
    input.zoom,
  ];
}
