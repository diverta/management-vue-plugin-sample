<script>
import Vue from 'vue';
window.rcmsJS.vue.registerVM(Vue, rcms_js_config.publicPath); // eslint-disable-line

import store from '@/store';
import config from '@/common/config';
import moment from 'moment-timezone';
import RcmsI18n from '@/common/i18n/rcms-i18n';
import { firestorePlugin } from 'vuefire';
require('@/common/axios_init'); // Global interceptors, etc
import 'vue-select/dist/vue-select.css';

Vue.use(RcmsI18n);
Vue.use(firestorePlugin);
moment.tz.setDefault('Asia/Tokyo');

export default {
    store,

    props: {
        config: { type: Object },
    },

    created() {
        Object.assign(config, this.config);
    },
};
</script>
