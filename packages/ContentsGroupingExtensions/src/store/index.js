import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters';
import mutations from './mutations';
import actions from './actions';
import i18nModule from './modules/i18n';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {},
    getters,
    mutations,
    actions,
    modules: {
        i18n: i18nModule,
    },
});

export default store;

if (module.hot) {
    module.hot.accept(['./getters', './mutations', './actions', './modules/i18n'], () => {
        const newGetters = require('./getters').default;
        const newMutations = require('./mutations').default;
        const newActions = require('./actions').default;
        const newI18nModule = require('./modules/i18n').default;

        store.hotUpdate({
            getters: newGetters,
            mutations: newMutations,
            actions: newActions,
            modules: {
                i18n: newI18nModule,
            },
        });
    });
}
