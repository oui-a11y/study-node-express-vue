import * as types from './mutation-types';

const mutations = {
  [types.SHOW_LOADING](state) {
    state.loadingState = true;
  },
  [types.HIDE_LOADING](state) {
    state.loadingState = false;
  }
};

export  default mutations;
