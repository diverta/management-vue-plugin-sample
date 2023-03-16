<template>
    <td v-if="extConfig" :class="distinguishClassName">
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
                        v-show="getIsActivated(childConfig)"
                        v-bind="{
                            ...getChildComponentProps(childConfig),
                            activated: getIsActivated(childConfig),
                            topics_group_id,
                        }"
                    />
                </div>
            </ParentDropdown>
        </dl>
    </td>
</template>

<script>
/* eslint-disable vue/no-unused-components */

import ParentDropdown from '@/components/ParentDropdown.vue';

import Vue from 'vue';
window.rcmsJS.vue.registerVM(Vue, rcms_js_config.publicPath); // eslint-disable-line

import { EXT_TYPE, getExtTypeByValue } from '@/common/const.js';

export default {
    name: 'ContentsGroupingExtension',
    props: {
        request: { type: Object, required: false },
        extConfig: { type: Array, required: true },
        topics_group_id: { type: Number, required: true },
    },
    components: {
        ParentDropdown,
        ChildImage: () => import(/* webpackChunkName: "ChildImage" */ '@/components/ChildImage.vue'),
        ChildFileManager: () => import(/* webpackChunkName: "ChildFileManager" */ '@/components/ChildFileManager.vue'),
        ChildText: () => import(/* webpackChunkName: "ChildText" */ '@/components/ChildText.vue'),
        ChildTextarea: () => import(/* webpackChunkName: "ChildTextarea" */ '@/components/ChildTextarea.vue'),
        ChildWysiwyg: () => import(/* webpackChunkName: "ChildWysiwyg" */ '@/components/ChildWysiwyg/index.vue'),
        ChildMultipleCheckbox: () =>
            import(/* webpackChunkName: "ChildMultipleCheckbox" */ '@/components/ChildMultipleCheckbox.vue'),
        ChildLink: () => import(/* webpackChunkName: "ChildLink" */ '@/components/ChildLink.vue'),
        ChildSelectbox: () => import(/* webpackChunkName: "ChildSelectbox" */ '@/components/ChildSelectbox.vue'),
        ChildMap: () => import(/* webpackChunkName: "ChildMap" */ '@/components/ChildMap.vue'),
        ChildRelationField: () =>
            import(/* webpackChunkName: "ChildRelationField" */ '@/components/ChildRelationField/index.vue'),
    },
    data() {
        return {
            EXT_TYPE,
            selectedIDs: [],
            // in order to determine what the index number the current component is (within iteratable extension), see `mounted()`.
            distinguishClassName: 'js__contents-grouping-extension',
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
        getIsActivated() {
            return childConfig => this.selectedIDs.map(no => `${no}`.padStart(2, '0')).includes(childConfig.no);
        },
        getChildComponentProps() {
            return childConfig => {
                const extType = getExtTypeByValue(`${childConfig.ext_type}`);
                if (extType === undefined) {
                    // eslint-disable-next-line no-console
                    console.warn(`could not resolve specified extension type: ${childConfig.ext_type}`);
                    return {
                        is: 'template', // just for go through component rendering error without `is` prop.
                    };
                }
                return {
                    is: `Child${extType}`,
                    ...childConfig,
                };
            };
        },
    },
    methods: {
        /**
         * returns extConfig with merging its value as original value and stored value.
         * stored value would have been generated when POST the form then failed, it consists of submitted form values.
         * to restore and render that stored value in refreshed form, applies it as the default value.
         * @param {*} extConfig single extConfig
         */
        getExtConfigWithStoredValue(extConfig, iteratableSelfComponentIndex) {
            const name = extConfig.ext_col_nm;
            const value = extConfig.value;
            const restoredValue =
                this.request && this.request[name] ? this.request[name][iteratableSelfComponentIndex] : undefined;
            return {
                ...extConfig,
                value: restoredValue || value,
            };
        },
        getConfigsBy(extType) {
            return this.extConfig.filter(({ ext_type }) => `${ext_type}` === `${extType}`);
        },
        handleOnChangeParentDropdown(value) {
            this.selectedIDs = value.split(',').map(id => id.replace(/-\d+/, ''));
        },
        sortByExtOrderNumber(extA, extB) {
            return extB.ext_order_no - extA.ext_order_no;
        },
    },
    created() {
        this.extConfig.sort(this.sortByExtOrderNumber);
    },
    mounted() {
        // since multiple custom components do not have its index number, gets it from CSS picking.
        const iteratableSelfComponentIndex =
            window.document.querySelectorAll(`.${this.distinguishClassName}`).length - 1;
        this.extConfig = this.extConfig.map(extConfig =>
            this.getExtConfigWithStoredValue(extConfig, iteratableSelfComponentIndex)
        );
    },
};
</script>
