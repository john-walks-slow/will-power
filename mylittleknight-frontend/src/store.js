import Vue from 'vue';
import Vuex from 'vuex';
import feathersVuex from 'feathers-vuex';
import feathersClient from './feathers-client';
import createPersistedState from 'vuex-persistedstate';

const { service, auth, FeathersVuex } = feathersVuex(feathersClient, {
  idField: '_id'
});

Vue.use(Vuex);
Vue.use(FeathersVuex);

export default new Vuex.Store({
  // state: {
  //   user:{},
  //   equipment:{},
  //   material:{},
  //   will,
  // },
  state: {
    // user: {
    //   username: 'John',
    //   // key: '',
    //   avatar: 'user'
    // },
    monster: {
      id: '',
      hp: 490,
      maxHp: 500,
      damage: 200
    },
    gameProgress: {
      level: 3,
      levelProgress: 10,
      willGem: 2
    },
    equipments: [
      {
        id: 'adasfcxvxc',
        name: 'The best sword',
        equipped: 'true',
        equipmentType: 'weapon',
        type: 'Sword',
        animationCat: 'MeleeHeavy',
        damage: 100,
        wpConsumption: 20,
        rarity: 1,
        acquiredTimestamp: 2
      },
      {
        id: 'adasfcxvxc',
        name: 'The best sword',
        equipped: false,
        equipmentType: 'weapon',
        type: 'Sword',
        animationCat: 'MeleeHeavy',
        damage: 100,
        wpConsumption: 20,
        rarity: 2,
        acquiredTimestamp: 1
      },
      {
        id: 'adasfcxvxc',
        name: 'The best sword',
        equipped: false,
        equipmentType: 'weapon',
        type: 'Sword',
        animationCat: 'MeleeHeavy',
        damage: 100,
        wpConsumption: 20,
        rarity: 1,
        acquiredTimestamp: 13
      },
      {
        id: 'adasfcxvxc',
        name: 'The best shield',
        equipped: 'true',
        equipmentType: 'offHand',
        type: 'Shield',
        maxHp: 20,
        maxWp: 22,
        rarity: 3,
        acquiredTimestamp: 12
      }
    ],
    wills: {
      commitments: [
        {
          id: 'adasdsgagvcxv',
          name: 'Study',
          lastCommitmentStartDatetime: '2019-05-16 11:23:00',
          progress: 20,
          target: 10,
          cycle: 1,
          active: true,
          type: 'commitment',
          records: [
            {
              progress: 1,
              recordDate: '2019-05-15'
            },
            {
              progress: 2000,
              recordDate: '2019-05-14'
            },
            {
              progress: 2000,
              recordDate: '2019-05-12'
            }
          ],
          achievements: [
            {
              id: 'asdassffcv',
              type: 'increaseDamage',
              percentage: 150
            }
          ]
        },

        {
          id: 'adasdsaags23vcxv',
          name: 'Reading',
          progress: 20,
          target: 30,
          cycle: 1,
          active: true
        },
        {
          id: 'adasdsa1h2gvcxv',
          name: 'Coding',
          progress: 0,
          target: 60,
          cycle: 1,
          active: true
        }
      ],
      restraints: [
        {
          id: 'adasdsa1hs2gvcxv',
          name: 'Drink Coke',
          progress: 0,
          target: 3,
          cycle: 1,
          active: true,
          records: [{ recordDatetime: '2019-05-15 11:23:00' }]
        },
        {
          id: 'adasdsa12ghavcxv',
          name: 'Eat Candy',
          progress: 5,
          target: 1,
          cycle: 1,
          active: true
        }
      ],
      perseverances: [
        {
          id: 'adasdsa1sd2gvcxv',
          name: 'Keep a diary',
          progress: 0,
          target: 1,
          cycle: 1,
          active: true
        }
      ],
      combat: {
        level: 20,
        monster: {
          id: '12313',
          name: 'MONSTER',
          hp: 50,
          maxHp: 100,
          attack: 200,
          defense: 200
        },
        background: ''
      }
    }
  },

  getters: {
    activeCommitments: state => {
      return state.wills.commitments.filter(item => item.active === true);
    },
    activePerseverances: state => {
      return state.wills.perseverances.filter(item => item.active === true);
    },
    activeRestraints: state => {
      return state.wills.restraints.filter(item => item.active === true);
    }
  },
  plugins: [
    service('users'),
    service('monster'),
    service('knights'),
    service('equipments'),
    service('game-progress'),
    auth({ userService: 'users' }),
    createPersistedState({ storage: window.sessionStorage })
  ]
});
