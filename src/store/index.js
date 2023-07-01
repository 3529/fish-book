import Vue from 'vue';
import Vuex from 'vuex';
import sys from './modules/sys';
Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        sys,
    },
});
