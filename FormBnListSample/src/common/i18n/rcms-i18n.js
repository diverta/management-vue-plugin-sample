import moment from 'moment-timezone';

export default {
    install: function(Vue) {
        Vue.mixin({
            props: {
                smarty_lang: {
                    type: String,
                    default: () => null,
                },
            },
            methods: {
                translate(label, params = [], lang = null) {
                    if (lang === null) {
                        lang =
                            (this.$store ? this.$store.state.i18n.lang : null) ||
                            this.smarty_lang || // In case store not yet init
                            'ja'; // In case no props
                    }
                    if (!this.$options.__translations[label]) return label;
                    if (!this.$options.__translations[label][lang]) {
                        if (lang == 'ja') {
                            return label;
                        } else {
                            return this.translate(label, params, 'ja');
                        }
                    }
                    return this.$options.__translations[label][lang].replace(/{[0-9]+}/gi, i => {
                        return params[parseInt(i.substring(1, i.length - 1))];
                    });
                },
            },
            created() {
                if (this.smarty_lang) {
                    moment.locale(this.smarty_lang);
                }
                if (this.smarty_lang && this.$store && this.$store.state.i18n.lang === null) {
                    this.$store.commit('i18n/setLang', this.smarty_lang);
                }
            },
        });
    },
};
