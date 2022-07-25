import Vue from 'vue';
import apiFunc from '@/api/modules/rcms_api/func';

export default {
    namespaced: true,

    state: {
        meta: {
            loading: false,
            loaded: false,
        },
        contentsLoading: {},
        function_category: {
            resolve: null,
            reject: null,
            list: null,
        },
        contents_by_category: {},
    },

    mutations: {
        initList(state) {
            if (state.function_category.list == null) {
                state.function_category.list = new Promise((resolve, reject) => {
                    state.function_category.resolve = resolve;
                    state.function_category.reject = reject;
                });
            }
        },
        initContents(state, category_id) {
            if (state.contents_by_category[category_id] == null) {
                Vue.set(state.contents_by_category, category_id, {
                    resolve: null,
                    reject: null,
                    data: null,
                });
                Vue.set(
                    state.contents_by_category[category_id],
                    'data',
                    new Promise((resolve, reject) => {
                        state.contents_by_category[category_id].resolve = resolve;
                        state.contents_by_category[category_id].reject = reject;
                    })
                );

                Vue.set(state.contentsLoading, category_id, false);
            }
        },
        reserveLoad(state) {
            if (state.meta.loading === false) {
                Vue.set(state.meta, 'loading', true);
                return true;
            }
            return false;
        },
        reserveContentsLoad(state, category_id) {
            if (state.contentsLoading[category_id] === false) {
                Vue.set(state.contentsLoading, category_id, true);
                return true;
            }
            return false;
        },
        setContentsLoaded(state, category_id) {
            Vue.set(state.contentsLoading, category_id, false);
        },
        setMeta(state, { loaded, loading }) {
            if (loaded != null) {
                Vue.set(state.meta, 'loaded', loaded);
            }
            if (loading != null) {
                Vue.set(state.meta, 'loading', loading);
            }
        },
        setFunctionCategoryList(state, new_category_list) {
            state.function_category.resolve(new_category_list);
        },
        resolveContents(state, { category_id, data }) {
            state.contents_by_category[category_id].resolve(data);
        },
        resetCacheContents(state) {
            state.contentsLoading = {};
            state.contents_by_category = {};
        },
    },

    actions: {
        loadCategoryList({ state, commit }, unclassified_label) {
            // Pass translation function
            commit('initList');
            if (state.meta.loaded == false && state.meta.loading == false) {
                commit('reserveLoad');
                apiFunc
                    .do_func_category_list()
                    .then(data => {
                        commit('setMeta', {
                            loaded: true,
                        });
                        data.staticcontents_list.unshift({
                            category_id: 0,
                            category_nm: unclassified_label,
                        });
                        commit('setFunctionCategoryList', data.staticcontents_list);
                    })
                    .catch(() => {})
                    .then(() => {
                        commit('setMeta', {
                            loading: false,
                        });
                    });
            }
            return state.function_category.list; // Return a promise which only one instance of this action should resolve
        },
        loadContentList({ state, commit }, category_id) {
            commit('initContents', category_id);
            if (!state.contentsLoading[category_id]) {
                commit('reserveContentsLoad', category_id);
                apiFunc
                    .do_func_list({
                        s_category: category_id,
                    })
                    .then(data => {
                        commit('resolveContents', {
                            category_id,
                            data: data.staticcontents_list,
                        });
                        commit('setContentsLoaded', category_id);
                    });
            }
            return state.contents_by_category[category_id].data; // Promise
        },
        resetCacheContents({ commit }) {
            commit('resetCacheContents');
        },
    },
};
