<template>
    <td v-if="extConfig">
        <dl>
            <ParentDropdown
                v-bind="{
                    ...config.parent,
                }"
                @change="handleOnChangeParentDropdown"
            >
                <div v-for="childConfig in config.children" :key="childConfig.no">
                    <!-- eslint-disable-next-line vue/require-component-is -->
                    <component
                        v-show="selectedIDs.includes(childConfig.no)"
                        v-bind="{ ...getChildComponentProps(childConfig) }"
                    />
                </div>
            </ParentDropdown>
        </dl>
    </td>
</template>

<script>
/* eslint-disable vue/no-unused-components */

import Vue from 'vue';
window.rcmsJS.vue.registerVM(Vue, rcms_js_config.publicPath); // eslint-disable-line

import { EXT_TYPE, getExtTypeByValue } from '@/common/const.js';

import ParentDropdown from '@/components/ParentDropdown.vue';

import ChildImage from '@/components/ChildImage.vue';
import ChildText from '@/components/ChildText.vue';
import ChildTextarea from '@/components/ChildTextarea.vue';

// TODO needs to remove value in unselected child?

export default {
    props: {
        extConfig: { type: Array, required: true },
    },
    components: {
        ParentDropdown,
        ChildImage,
        ChildText,
        ChildTextarea,
    },
    data() {
        return {
            EXT_TYPE,
            selectedIDs: [],
        };
    },
    computed: {
        config() {
            const parent = this.extConfig.find(d => d.ext_group_parent_ext_col === '');
            const children = this.extConfig.filter(d => d.ext_group_parent_ext_col !== '');
            return {
                parent,
                children,
            };
        },
        getChildComponentProps() {
            return childConfig => {
                const extType = getExtTypeByValue(`${childConfig.ext_type}`);
                return {
                    is: `Child${extType}`, // TODO create other child components other than text,textarea,file.
                    ...childConfig,
                };
            };
        },
    },
    methods: {
        getConfigsBy(extType) {
            return this.extConfig.filter(({ ext_type }) => `${ext_type}` === `${extType}`);
        },
        handleOnChangeParentDropdown(value) {
            this.selectedIDs = value.split(',');
        },
        sortByExtOrderNumber(extA, extB) {
            return extB.ext_order_no - extA.ext_order_no;
        },
    },
    created() {
        this.extConfig.sort(this.sortByExtOrderNumber);
    },
};
</script>
