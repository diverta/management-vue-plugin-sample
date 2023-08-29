import { globalState } from '@/common/global-state';

export default {
    install: function (Vue) {
        Vue.mixin({
            computed: {
                siteLang: {
                    get() {
                        return globalState.siteLang;
                    },
                    set(value) {
                        globalState.siteLang = value;
                    },
                },
            },
            methods: {
                translate(label, params = [], lang = null) {
                    if (lang === null) {
                        lang = this.siteLang || 'ja';
                    }
                    if (!this.$options.__translations[label]) return label;
                    if (!this.$options.__translations[label][lang]) {
                        if (lang == 'ja') {
                            return label;
                        } else {
                            return this.translate(label, params, 'ja');
                        }
                    }
                    return this.$options.__translations[label][lang].replace(/{[0-9]+}/gi, (i) => {
                        return params[parseInt(i.substring(1, i.length - 1))];
                    });
                },
                getSiteLang() {
                    return this.siteLang || 'ja';
                },
            },
        });
    },
};
