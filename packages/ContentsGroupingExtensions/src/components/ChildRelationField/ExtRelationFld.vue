<template>
    <div>
        <input type="hidden" :name="input_name" v-model="selectedValue" />

        <!-- already selected -->
        <div v-show="selectedLabel && !showSelectbox">
            <template v-if="selectedOpenFlg === 0 || selectedOpenFlg === 1">
                <span v-if="selectedOpenFlg === 1"><i class="fe fe-check-circle text-success"></i></span>
                <span v-else-if="selectedOpenFlg === 0"><i class="fe fe-x text-danger"></i></span>
            </template>

            <a href="#" @click.self.prevent="changeView(true)">{{ selectedLabel }}</a>
            <a
                v-if="selectedLink && selectedValue"
                :href="selectedLink"
                class="rcms_btn"
                style="padding:0 4px; margin:0 4px 0 8px;"
                >編集</a
            >
            <a
                v-if="selectedValue"
                href=""
                @click.self.prevent="clearSelection"
                class="rcms_btn"
                style="padding:0 4px; margin:0 4px;"
                >クリア</a
            >
        </div>

        <!-- none selected -->
        <div v-show="showSelectbox">
            <div v-if="searchFilters.length > 0">
                <template v-for="(filter, index) in searchFilters">
                    <template v-if="filter.options && filter.options.length > 1">
                        <v-select
                            v-if="
                                filter.name !== 'search1' &&
                                    filter.name !== 'search2' &&
                                    filter.name !== 'search_topics_group'
                            "
                            :key="index"
                            v-model="searchFiltersValues[filter.name]"
                            :options="filter.options"
                            :filterable="false"
                            :searchable="false"
                            :selectable="option => (option.disabled ? false : true)"
                        >
                            <template slot="option" slot-scope="option">
                                <span v-if="option.value != ''">{{ option.value }} :</span>
                                <span v-else>ID :</span>
                                {{ option.label }}
                            </template>
                        </v-select>
                        <v-select
                            v-if="filter.name == 'search2' && table_id == 'topics' && !isSearchFilterHidden(filter)"
                            :key="index"
                            v-model="searchFiltersValues[filter.name]"
                            :options="filter.options"
                            :filterable="false"
                            :searchable="false"
                            :selectable="option => (option.disabled ? false : true)"
                        >
                            <template slot="option" slot-scope="option">
                                <span v-if="option.value != ''">{{ option.value }} :</span>
                                <span v-else>ID :</span>
                                {{ option.label }}
                            </template>
                        </v-select>
                    </template>
                    <v-select
                        v-if="filter.name === 'search_topics_group'"
                        :key="index"
                        v-model="searchFiltersValues[filter.name]"
                        :options="filter.options"
                        :filterable="false"
                        :searchable="false"
                        :selectable="option => (option.disabled ? false : true)"
                        @input="onChangeFilter"
                    >
                        <template slot="option" slot-scope="option">
                            <span v-if="option.value != ''">{{ option.value }} :</span>
                            <span v-else>ID :</span>
                            {{ option.label }}
                        </template>
                    </v-select>
                </template>
            </div>
            <v-select
                ref="vselect"
                v-model="selectedItem"
                :options="options"
                @search="onSearch"
                v-on:search:focus="onSearchFocus"
                @input="onChange"
                :resetOnOptionsChange="true"
                :selectable="option => !option.disabled"
            >
                <template slot="no-options">
                    <div @mousedown.stop="">対象レコードが存在しません。</div>
                </template>
                <template slot="option" slot-scope="option">
                    <template v-if="opt.open_flg === 0 || opt.open_flg === 1">
                        <span v-if="opt.open_flg === 1"><i class="fe fe-check-circle text-success"></i></span>
                        <span v-else-if="opt.open_flg === 0"><i class="fe fe-x text-danger"></i></span>
                    </template>

                    <span v-if="option.value != ''">{{ option.value }} :</span>
                    <span v-else>ID :</span>
                    {{ option.label }}
                </template>
            </v-select>
            <p>
                <a href="" @click.self.prevent="changeView(false)">キャンセル</a>
            </p>
        </div>
    </div>
</template>
<script>
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';

import debounce from 'lodash.debounce';
import * as api from './api';

export default {
    props: ['topics_group_id', 'value', 'name', 'opts', 'disp_group_no'],

    components: {
        'v-select': vSelect,
    },

    data() {
        return {
            ext_no: this.name.replace(/\[(\d+)\]/, ''),
            table_id: this.opts.module,
            allowed_id: this.opts.group_id,
            limit: this.opts.limit,
            input_name: this.name,

            options: [],
            selectedLabel: '',
            selectedLink: '',
            selectedOpenFlg: null,
            showSelectbox: false,
            selectedItem: null,
            selectedValue: null,

            selection: {
                item: null,
                value: null,
                label: '',
                link: '',
                openFlg: null,
            },

            searchFilters: [],
            searchFiltersValues: {},
            searchFiltersLoaded: false,
        };
    },

    async mounted() {
        if (!this.value) {
            this.selectedLabel = '選択なし';
            return;
        }

        const selectedModuleId = this.value?.module_id || this.value;

        const loadLabel = async () => {
            const params = {
                table_id: this.table_id,
                selected_item: selectedModuleId,
                allowed_id: this.allowed_id,
            };
            return await api.getRelatedFldLabel(params);
        };

        const data = await loadLabel();
        // this.selectedValue = data.title ? selectedModuleId : null;
        // this.selectedLabel = data.title || '選択なし';
        // this.selectedLink = data.link || null;
        // this.selectedOpenFlg = 'open_flg' in data ? parseInt(data.open_flg) : null;

        this.selection = {
            item: null,
            value: data.title ? selectedModuleId : null,
            label: data.title || '選択なし',
            link: data.link || null,
            openFlg: 'open_flg' in data ? parseInt(data.open_flg) : null,
        };
    },

    computed: {
        contentsTypeList() {
            return this.opt.contents_type?.split(',')?.map(c => parseInt(c)) || [];
        },
    },

    methods: {
        changeView(status) {
            this.showSelectbox = status;
            this.search('');
        },

        onSearch(keyword, loading) {
            loading(true);
            this.searchDebounced(loading, keyword);
        },
        searchDebounced: debounce(function(loading, keyword) {
            this.search(loading, keyword);
        }, 350),

        onSearchFocus() {
            this.search('');
        },

        async search(loading, keyword) {
            const allowedId = this.searchFiltersValues?.search_topics_group?.value || this.allowed_id;

            const params = {
                table_id: this.table_id,
                allowed_id: allowedId,
                keyword,
                setting_id: this.topics_group_id,
                ext_no: this.ext_no,
                filters: this.searchFiltersValues,
            };

            const data = await api.getRelatedFldList(params).catch(({ errors }) => {
                loading?.(false);
                throw new Error(errors);
            });

            this.options = data.items.map(item => ({
                label: item.title,
                value: item.key,
                open_flg: item.open_flg,
            }));

            loading?.(false);

            const searchFilters = [];
            const searchFiltersValues = {};

            if (this.table_id === 'topics' || this.table_id === 'member') {
                if (!this.searchFiltersLoaded) {
                    this.searchFiltersLoaded = true;

                    if (typeof data.topicsGroupList && Object.keys(data.topicsGroupList).length > 0) {
                        searchFilters.push({
                            name: 'search_topics_group',
                            options: Object.keys(data.topicsGroupList)
                                .sort()
                                .map(item => {
                                    return { label: data.topicsGroupList[item], value: item };
                                }),
                        });
                        searchFiltersValues.search_topics_group = searchFilters[0].options[0];
                    }
                } else {
                    if (this.searchFilters?.[0]) {
                        searchFilters.push(this.searchFilters[0]);
                        searchFiltersValues.search_topics_group = this.searchFiltersValues.search_topics_group;
                    }
                }
            }

            for (const filter in data.searchList) {
                const filterName = 'search' + (Number(filter) + 1);
                if (data.searchList[filter].length > 0) {
                    let searchContentsTypeIndex = 'search3';
                    if (this.table_id === 'topics') {
                        searchContentsTypeIndex = 'search2';
                    }
                    const searchOptions =
                        filterName === searchContentsTypeIndex && this.contentsTypeList.length > 0
                            ? data.searchList[filter].filter(item => this.contentsTypeList.includes(item.value))
                            : data.searchList[filter];
                    if (this.searchFilters?.[0]?.name !== filterName) {
                        searchFilters.push({
                            name: filterName,
                            options: searchOptions,
                        });
                    }

                    searchFiltersValues[filterName] =
                        typeof this.searchFiltersValues[filterName] === 'undefined' ||
                        !searchOptions.some(item => {
                            return this.searchFiltersValues[filterName].value === item.value;
                        })
                            ? searchOptions[0]
                            : this.searchFiltersValues[filterName];
                }
            }

            this.searchFilters = searchFilters;
            this.searchFiltersValues = searchFiltersValues;
            this.options.unshift({ label: 'タイトル', value: 'ID', disabled: true });
        },

        onChange(selected) {
            if (selected?.value) {
                this.selection = {
                    item: null,
                    value: selected.value,
                    label: selected.label,
                    link: null,
                    openFlg: selected.open_flg,
                };
                // this.selectedLabel = selected.label;
                // this.selectedValue = selected.value;
                // this.selectedOpenFlg = selected.open_flg;

                this.changeView(false);
            }
        },

        onChangeFilter(selected) {
            this.searchFiltersValues['search_topics_group'] = selected;
            this.search('');
        },

        clearSelection() {
            // this.selectedLabel = '選択なし';
            // this.selectedValue = null;
            // this.selectedItem = null;
            // this.selectedOpenFlg = null;

            this.selection = {
                item: null,
                value: null,
                label: '選択なし',
                link: null,
                openFlg: null,
            };
        },

        isSearchFilterHidden(filter) {
            if (!filter.options) {
                return true;
            }

            // Hide search filter if it only contains 2 options or less:
            // a placeholder (e.g. `--Type--`) and a single option (single topics category)
            if (filter.options.length < 3) {
                return true;
            }
            return false;
        },
    },
};
</script>
<style scoped></style>
