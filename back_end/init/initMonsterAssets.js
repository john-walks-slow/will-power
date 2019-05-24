let fs = require('fs');
let fse = require('fs-extra');

let ncp = require('ncp');
function uppercaseFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
function removeMisc(string) {
  return string.replace(/^\w*-\w*-/, '').replace('Animated', '');
}
function generateTypeId(string) {
  return string.replace(/-/g, '');
}
function generateName(string) {
  return string.replace(/-/g, ' ');
}
const PATH = './assets/monster/';
const OUTPUT_PATH = './assets_output/monster/';
fse.emptyDirSync(OUTPUT_PATH);
fse.copySync(PATH, OUTPUT_PATH);
let dirs = fs.readdirSync(OUTPUT_PATH);
for (let dir of dirs) {
  let content = fs.readdirSync(OUTPUT_PATH + dir);
  let typeId = generateTypeId(removeMisc(dir));
  let img = content.find(f => f.includes('.png'));
  try {
    fs.unlinkSync(OUTPUT_PATH + dir + '/How to use.txt');
    fs.unlinkSync(OUTPUT_PATH + dir + '/Terms of use.txt');
    fs.unlinkSync(OUTPUT_PATH + dir + '/' + img);
  } catch (e) {}
  try {
    let static = fs.readdirSync(OUTPUT_PATH + dir + '/Static/Front/');
    fs.copyFileSync(
      OUTPUT_PATH + dir + '/Static/Front/' + static[0],
      OUTPUT_PATH + dir + '/' + typeId + '.png'
    );
    fse.removeSync(OUTPUT_PATH + dir + '/Static');
  } catch (e) {
    fse.removeSync(OUTPUT_PATH + dir);
    console.log(typeId + 'no static');
    continue;
  }
  let dbAssets = fs.readdirSync(OUTPUT_PATH + dir + '/dragonbones_assets/');
  if (dbAssets.length !== 4) {
    console.log(typeId + 'too many assets');
    continue;
  }
  dbAssets.forEach(asset => {
    let name = asset.replace(/.*_/, typeId + '_');
    fs.copyFileSync(
      OUTPUT_PATH + dir + '/dragonbones_assets/' + asset,
      OUTPUT_PATH + dir + '/' + name
    );
  });
  fse.removeSync(OUTPUT_PATH + dir + '/dragonbones_assets');
  fse.removeSync(OUTPUT_PATH + dir + '/' + typeId + '_settings.txt');
  fse.renameSync(OUTPUT_PATH + dir, OUTPUT_PATH + typeId);
}
// for (let i = 0; i <= 4; i++) {
//   for (let i2 = 0; i2 <= 6; i2++) {
//     let name = '';
//     let id = i * 10 + i2;
//     let filename = `tile${id <= 9 ? '00' : '0'}${id}.png`;
//     let typeId = uppercaseFirst() + uppercaseFirst(name);
//     fs.renameSync(PATH + filename, OUTPUT_PATH + 'weapon/' + typeId + '.png');
//   }
// }
// for (let i = 0; i <= 4; i++) {
//   for (let i2 = 7; i2 <= 9; i2++) {
//     let name = '';

//     let id = i * 10 + i2;
//     let filename = `tile${id <= 9 ? '00' : '0'}${id}.png`;
//     let typeId = uppercaseFirst() + uppercaseFirst(name);
//     fs.renameSync(PATH + filename, OUTPUT_PATH + 'offHand/' + typeId + '.png');
//   }
// }
