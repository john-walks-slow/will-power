const NeDB = require('nedb');
let path = require('path');
let fs = require('fs');
let fse = require('fs-extra');
function uppercaseFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
function removeMisc(string) {
  return string
    .substring()
    .replace(/^\w*-\w*-/, '')
    .replace('Animated', '');
}
function generateTypeId(string) {
  return string.substring().replace(/-/g, '');
}
function generateName(string) {
  return string.substring().replace(/[a-z][A-Z]/g, p => p[0] + ' ' + p[1]);
}
let monsterModel = new NeDB({
  filename: path.join('../data', 'monster-types.db'),
  autoload: true
});
let docsWeapon = [];
const OUTPUT_PATH = './assets_output/monster/';
let dirs = fs.readdirSync(OUTPUT_PATH);
for (let dir of dirs) {
  let name = generateName(dir);
  let typeId = generateTypeId(dir);
  docsWeapon.push({
    name,
    _id: typeId,
    damage: Math.round(20 + Math.random() * 20),
    maxHp: Math.round(20 + Math.random() * 20)
  });
}
monsterModel.insert(docsWeapon, (e, n) => {
  console.log(n);
});
