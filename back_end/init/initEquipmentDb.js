const NeDB = require('nedb');
let path = require('path');

let weaponModel = new NeDB({
  filename: path.join('../data', 'weapon-types.db'),
  autoload: true
});
let offHandModel = new NeDB({
  filename: path.join('../data', 'off-hand-types.db'),
  autoload: true
});

let names = [
  'sword',
  'axe',
  'hammer',
  'dagger',
  'bow',
  'staff',
  'hook',
  'wand',
  'glove',
  'shield'
];
let decoraters = ['kindom', 'crystal', 'elf', 'dungeon', 'devil'];
let attributes = [
  [25, 25],
  [40, 35],
  [75, 60],
  [9, 10],
  [20, 20],
  [120, 80],
  [14, 15],
  [30, 120],
  [80, 70],
  [100, 50]
];
let docsWeapon = [];
let docsOffHand = [];
// 50 30 10 7 3
let rarities = [2, 5, 1, 4, 3];
function uppercaseFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
for (let i = 0; i <= 4; i++) {
  let decorater = decoraters[i];
  for (let i2 = 0; i2 <= 6; i2++) {
    let name = names[i2];
    let typeId = uppercaseFirst(decorater) + uppercaseFirst(name);
    let equipmentName = uppercaseFirst(decorater) + ' ' + uppercaseFirst(name);

    docsWeapon.push({
      _id: typeId,
      name: equipmentName,
      damage: Math.round(attributes[i2][0] * Math.pow(1.5, rarities[i] - 1)),
      wpConsumption: Math.round(
        attributes[i2][1] * (1 + 0.1 * (rarities[i] - 1))
      ),
      rarity: rarities[i],
      cat: 'weapon'
    });
  }
}
for (let i = 0; i <= 4; i++) {
  let decorater = decoraters[i];
  for (let i2 = 7; i2 <= 9; i2++) {
    let name = names[i2];
    let typeId = uppercaseFirst(decorater) + uppercaseFirst(name);
    let equipmentName = uppercaseFirst(decorater) + ' ' + uppercaseFirst(name);

    docsOffHand.push({
      _id: typeId,
      name: equipmentName,
      maxHp: Math.round(attributes[i2][0] * Math.pow(1.2, rarities[i] - 1)),
      maxWp: Math.round(attributes[i2][1] * Math.pow(1.2, rarities[i] - 1)),
      rarity: rarities[i],
      cat: 'offHand'
    });
  }
}

weaponModel.insert(docsWeapon, (e, n) => {
  console.log(n);
});
offHandModel.insert(docsOffHand, (e, n) => {
  console.log(n);
});
