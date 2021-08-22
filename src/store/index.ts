import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import base from './modules/base'
import clock from './modules/clock'

const store = new Vuex.Store({
  ...base,
  modules: {
    clock
  }
});

export default store
