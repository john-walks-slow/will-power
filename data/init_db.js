
//init monsterType db
var monsterTypes_db = require('nedb'), db = new monsterTypes_db({ filename: './monster-types.db' });

var mon1 = { monsterType: 'ArcaneGolem', maxHp: 80, damage: 6};
var mon2 = { monsterType: 'Boss1', maxHp: 40, damage: 15};
var mon3 = { monsterType: 'Boss2', maxHp: 50, damage: 11};
var mon4 = { monsterType: 'Boss3', maxHp: 30, damage: 25};

db.insert([doc1,doc2,doc3,doc4], function (err, newDoc) {   // Callback is optional
  // newDoc is the newly inserted document, including its _id
  // newDoc has no key called notToBeSaved since its value was undefined
});

db.loadDatabase(function (err) {    // Callback is optional
  // Now commands will be executed
});


//iniit equipment type db
var equipmentTypes_db = require('nedb'), db = new equipmentTypes_db({filename: './equipment-types.db'});

var equip1 = { equipmentType: 'tile000', name: 'ordinary sword',position: '', rarity: 1,animationCat: 'MeleeLight',damage: 15,wpConsumption: 5, maxHp: 0,maxWp: 0}

var equip2 = { equipmentType: 'tile001', name: 'advanced axe',position: 'weapon', rarity: 2,animationCat: 'MeleeHeavy',damage: 25,wpConsumption: 10, maxHp: 0,maxWp: 0}

var equip3 = { equipmentType: 'tile002', name: 'golden hammer',position: 'weapon', rarity: 3,animationCat: '',damage: 52,wpConsumption: 20, maxHp: 0,maxWp: }

var equip4 = { equipmentType: 'tile004', name: 'golden bow',position: 'weapon', rarity: 3,animationCat: 'Ranged',damage: 40,wpConsumption: 12, maxHp: 0,maxWp: 0}

var equip5 = { equipmentType: 'tile005', name: 'red scepter',position: 'offHand', rarity: 3,animationCat: 'Ranged',damage: 0,wpConsumption: 0, maxHp: 20,maxWp: 30}
