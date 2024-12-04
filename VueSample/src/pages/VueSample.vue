<template>
    <div>
        <h1>Vue Sample</h1>
        <ul>
            <li v-for="item in items" :key="item.topics_id">
                {{ item.subject }}
            </li>
        </ul>
    </div>
</template>
<script>
import Vue from 'vue';
window.rcmsJS.vue.registerVM(Vue, rcms_js_config.publicPath); // eslint-disable-line
const axios = require('axios').default;

export default {
    components: {},
    props: {
        root_api_url: {
            type: String,
            default: '',
        },
        endpoint: {
            type: String,
            default: '',
        },
    },
    created: function() {},
    mounted: async function() {
        const resp = await axios.get(this.root_api_url + this.endpoint);
        this.items = resp.data.list ? resp.data.list : [];
    },
    data() {
        return {
            items: [],
        };
    },

    computed: {},
};
</script>
