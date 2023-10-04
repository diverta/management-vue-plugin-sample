export default {
    namespaced: true,

    state: {
        lang: null,
    },

    mutations: {
        setLang(state, lang) {
            state.lang = lang;
        },
    },

    actions: {},
};
