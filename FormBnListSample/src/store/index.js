import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters';
import mutations from './mutations';
import actions from './actions';
import i18nModule from './modules/i18n';
import syncModule from './modules/sync';
import rcmsApiFuncModule from './modules/rcms_api/func';

Vue.use(Vuex);

const store = new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',

    state: {},

    getters,
    mutations,
    actions,
    modules: {
        i18n: i18nModule,
        sync: syncModule,
        'rcms_api/func': rcmsApiFuncModule,
    },
});

export default store;

if (module.hot) {
    module.hot.accept(['./getters', './mutations', './actions', './modules/i18n', '/modules/sync'], () => {
        const newGetters = require('./getters').default;
        const newMutations = require('./mutations').default;
        const newActions = require('./actions').default;
        const newI18nModule = require('./modules/i18n').default;
        const newSyncModule = require('./modules/sync').default;
        const newRcmsApiFuncModule = require('./modules/sync').default;

        store.hotUpdate({
            getters: newGetters,
            mutations: newMutations,
            actions: newActions,
            modules: {
                i18n: newI18nModule,
                sync: newSyncModule,
                rcms_api: {
                    func: newRcmsApiFuncModule,
                },
            },
        });
    });
}
