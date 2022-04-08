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
    let out = '';
    while (z > 0) {
        const thisTile = [f, x, y, z];
        const parent = getParent$1(thisTile);
        const childrenOfParent = getChildren$1(parent);
        const positionInParent = childrenOfParent.findIndex(([xf, xx, xy, xz]) => xf === f && xx === x && xy === y && xz === z);
        out = positionInParent.toString(8) + out;
        f = parent[0];
        x = parent[1];
        y = parent[2];
        z = parent[3];
    }
    return out;
}
function parse$1(th) {
    let children = getChildren$1([0, 0, 0, 0]);
    let lastChild;
    for (const c of th) {
        lastChild = children[parseInt(c, 8)];
        children = getChildren$1(lastChild);
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

var zfxyFuncs = /*#__PURE__*/Object.freeze({
  __proto__: null,
  getParent: getParent$1,
  getChildren: getChildren$1,
  generate: generate$1,
  parse: parse$1,
  toURL: toURL$1
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
