<template>
    <td>
        <div class="ext_item_0" data-ext_type="0" data-default_value="">
            <input
                type="text"
                :name="extConfig[0].ext_col_nm"
                :value="colorCode"
                size="60"
                :style="{ color: colorCode }"
            />
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
    props: {
        topics_group_id: { type: Number },
        extConfig: { type: Array },
        defaultColor: { type: String, default: '' },
    },
    mounted: function() {
        this.colorCode = this.extConfig[0].value || this.defaultColor;
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
