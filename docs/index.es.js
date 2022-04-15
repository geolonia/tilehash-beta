const ZFXY_1M_ZOOM_BASE = 25;
function getParent$1(tile) {
    const [f, x, y, z] = tile;
    return [f >> 1, x >> 1, y >> 1, z - 1];
}
function getChildren$1(tile) {
    const [f, x, y, z] = tile;
    return [
        [f * 2, x * 2, y * 2, z + 1],
        [f * 2, x * 2, y * 2 + 1, z + 1],
        [f * 2, x * 2 + 1, y * 2, z + 1],
        [f * 2, x * 2 + 1, y * 2 + 1, z + 1],
        [f * 2 + 1, x * 2, y * 2, z + 1],
        [f * 2 + 1, x * 2, y * 2 + 1, z + 1],
        [f * 2 + 1, x * 2 + 1, y * 2, z + 1],
        [f * 2 + 1, x * 2 + 1, y * 2 + 1, z + 1], // +1, +1, +1
    ];
}
function generate$1(tile) {
    let [f, x, y, z] = tile;
    const originalF = f;
    let out = '';
    while (z > 0) {
        const thisTile = [Math.abs(f), x, y, z];
        const parent = getParent$1(thisTile);
        const childrenOfParent = getChildren$1(parent);
        const positionInParent = childrenOfParent.findIndex(([xf, xx, xy, xz]) => xf === Math.abs(f) && xx === x && xy === y && xz === z);
        out = (positionInParent + 1).toString() + out;
        f = parent[0];
        x = parent[1];
        y = parent[2];
        z = parent[3];
    }
    return (originalF < 0 ? '-' : '') + out;
}
function parse$1(th) {
    let negativeF = false;
    if (th[0] === '-') {
        negativeF = true;
        th = th.substring(1);
    }
    let children = getChildren$1([0, 0, 0, 0]);
    let lastChild;
    for (const c of th) {
        lastChild = children[parseInt(c, 10) - 1];
        children = getChildren$1(lastChild);
    }
    if (negativeF) {
        lastChild[0] = -lastChild[0];
    }
    return lastChild;
}
function toURL$1(input) {
    let tile;
    if (typeof input === 'string') {
        tile = parse$1(input);
    }
    else {
        tile = input;
    }
    const [f, x, y, z] = tile;
    return `${z}/${f}/${x}/${y}`;
}
function calculateZFXY(input) {
    const meters = typeof input.elevation !== 'undefined' ? input.elevation : 0;
    if (meters <= -(2 ** ZFXY_1M_ZOOM_BASE) || meters >= (2 ** ZFXY_1M_ZOOM_BASE)) {
        throw new Error(`ZFXY only supports elevation between -2^${ZFXY_1M_ZOOM_BASE} and +2^${ZFXY_1M_ZOOM_BASE}.`);
    }
    const f = Math.floor(((2 ** input.zoom) * meters) / (2 ** ZFXY_1M_ZOOM_BASE));
    // Algorithm adapted from tilebelt.js
    const d2r = Math.PI / 180;
    const sin = Math.sin(input.lat * d2r);
    const z2 = 2 ** input.zoom;
    let x = z2 * (input.lng / 360 + 0.5);
    const y = z2 * (0.5 - 0.25 * Math.log((1 + sin) / (1 - sin)) / Math.PI);
    // Wrap Tile X
    x = x % z2;
    if (x < 0)
        x = x + z2;
    return [
        f,
        Math.floor(x),
        Math.floor(y),
        input.zoom,
    ];
}

var zfxyFuncs = /*#__PURE__*/Object.freeze({
  __proto__: null,
  ZFXY_1M_ZOOM_BASE: ZFXY_1M_ZOOM_BASE,
  getParent: getParent$1,
  getChildren: getChildren$1,
  generate: generate$1,
  parse: parse$1,
  toURL: toURL$1,
  calculateZFXY: calculateZFXY
});

function getParent(tile) {
    const [x, y, z] = tile;
    return [x >> 1, y >> 1, z - 1];
}
function getChildren(tile) {
    const [x, y, z] = tile;
    return [
        [x * 2, y * 2, z + 1],
        [x * 2, y * 2 + 1, z + 1],
        [x * 2 + 1, y * 2, z + 1],
        [x * 2 + 1, y * 2 + 1, z + 1], // +1, +1
    ];
}
function generate(tile) {
    let [x, y, z] = tile;
    if (z % 2 !== 0) {
        throw new Error('z must be divisible by 2');
    }
    let out = BigInt(0);
    const maxZ = z;
    while (z > 0) {
        const thisTile = [x, y, z];
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
function parse(th) {
    const int = BigInt(`0o` + th);
    let bitLen = BigInt(th.length * 4);
    let scratchInt = int;
    let children = getChildren([0, 0, 0]);
    let lastChild;
    for (let i = bitLen - BigInt(2); i >= BigInt(0); i -= BigInt(2)) {
        const posInChildren = scratchInt >> i;
        lastChild = children[Number(posInChildren)];
        children = getChildren(lastChild);
        scratchInt = scratchInt & ((BigInt(2) ** i) - BigInt(1));
    }
    return lastChild;
}
function toURL(input) {
    let tile;
    if (typeof input === 'string') {
        tile = parse(input);
    }
    else {
        tile = input;
    }
    const [x, y, z] = tile;
    return `${z}/${x}/${y}`;
}

var xyzFuncs = /*#__PURE__*/Object.freeze({
  __proto__: null,
  getParent: getParent,
  getChildren: getChildren,
  generate: generate,
  parse: parse,
  toURL: toURL
});

const zfxy = zfxyFuncs;
const xyz = xyzFuncs;

export { xyz, zfxy };
//# sourceMappingURL=index.es.js.map
