let fs = require('fs');
let fse = require('fs-extra');

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
// let attributes = [
//   [25, 25],
//   [40, 35],
//   [75, 60],
//   [9, 10],
//   [20, 20],
//   [100, 80],
//   [14, 15],
//   [30, 120],
//   [80, 70],
//   [100, 50]
// ];
// // 50 30 10 7 3
// let rarities = [2, 5, 1, 4, 3];
function uppercaseFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
const PATH = './assets/equipment/';
const OUTPUT_PATH = './assets_output/equipment/';
fse.emptyDirSync(OUTPUT_PATH);
fse.copySync(PATH, OUTPUT_PATH);
for (let i = 0; i <= 4; i++) {
  let decorater = decoraters[i];
  for (let i2 = 0; i2 <= 6; i2++) {
    let name = names[i2];
    let id = i * 10 + i2;
    let filename = `tile${id <= 9 ? '00' : '0'}${id}.png`;
    let typeId = uppercaseFirst(decorater) + uppercaseFirst(name);
    fse.moveSync(
      OUTPUT_PATH + filename,
      OUTPUT_PATH + 'weapon/' + typeId + '.png'
    );
  }
}
for (let i = 0; i <= 4; i++) {
  let decorater = decoraters[i];
  for (let i2 = 7; i2 <= 9; i2++) {
    let name = names[i2];

    let id = i * 10 + i2;
    let filename = `tile${id <= 9 ? '00' : '0'}${id}.png`;
    let typeId = uppercaseFirst(decorater) + uppercaseFirst(name);
    fse.moveSync(
      OUTPUT_PATH + filename,
      OUTPUT_PATH + 'offHand/' + typeId + '.png'
    );
  }
}
