const i = require('./index_zfxy');

const out = [];
const input = process.argv[2];
for (let next = input; next.length > 0; next = next.slice(0, -1)) {
  const tile = i.tilehashToTile(next);
  out.push([
    next,
    ...tile,
  ]);
}

out.reverse();
console.log('"tilehash","f","x","y","z"');
out.forEach((row) => {
  console.log(row.map((v) => `"${v}"`).join(','));
});
