<script>
import Vue from 'vue';

// config is defined by webpack DefinePlugin
window.rcmsJS.vue.registerVM(Vue, config.publicPath); // eslint-disable-line

import store from '@/store';
import config from '@/common/config';

require('@/common/axios_init'); // Global interceptors, etc

export default {
  store,
  props: {
    config: { type: Object, default: () => ({}) },
    api_key: { type: String, default: '' },
    signature: { type: String, default: '' },
    sid: { type: String, default: '' },
    request: { type: [Array, Object], default: () => ({}) },
  },

  computed: {
    apiLoginCredentials() {
      return {
        api_key: this.api_key,
        signature: this.signature,
        sid: this.sid,
      };
    },
  },

  created() {
    Object.assign(config, this.config);
  },
};
</script>
