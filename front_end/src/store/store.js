import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import feathersClient from '../feathers-client';
import feathersVuex from 'feathers-vuex';

const { service, auth, FeathersVuex } = feathersVuex(feathersClient, {
  idField: '_id'
});

Vue.use(Vuex);
Vue.use(FeathersVuex);

export default new Vuex.Store({
  state: {},

  // getters: {
  //   activeCommitments: state => {
  //     return state.wills.commitments.filter(item => item.active === true);
  //   },
  //   activePerseverances: state => {
  //     return state.wills.perseverances.filter(item => item.active === true);
  //   },
  //   activeRestraints: state => {
  //     return state.wills.restraints.filter(item => item.active === true);
  //   }
  // },
  plugins: [
    auth({ userService: 'users' }),
    service('users'),
    service('knights'),
    service('wills'),
    service('wills/commitments'),
    service('wills/restraints'),
    service('wills/perseverances'),
    service('wills/proof-of-wills'),
    service('wills/check-records'),
    service('equipments'),
    service('equipments/weapons'),
    service('battles'),
    service('dialogues'),
    service('messages')
    // createPersistedState({
    //   paths: ['auth.accessToken']
    // })
  ]
});
