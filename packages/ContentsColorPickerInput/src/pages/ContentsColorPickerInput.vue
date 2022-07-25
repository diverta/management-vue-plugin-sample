<template>
    <td>
        <div class="ext_item_0" data-ext_type="0" data-default_value="">
            <input type="text" name="ext_col_01" :value="colorCode" size="60" />
            <chrome-picker :value="colorCode" @input="updateValue"></chrome-picker>
        </div>
    </td>
</template>
<script>
import Vue from 'vue';
window.rcmsJS.vue.registerVM(Vue, rcms_js_config.publicPath); // eslint-disable-line

import { Chrome } from 'vue-color';
export default {
    components: {
        'chrome-picker': Chrome,
    },
    props: ['extConfig', 'test'],
    mounted: function() {
        this.colorCode = this.extConfig[0].value;
    },
    data() {
        return {
            colorCode: '',
        };
    },
    methods: {
        updateValue(value) {
            this.colorCode = value.hex;
        },
    },
};
</script>
