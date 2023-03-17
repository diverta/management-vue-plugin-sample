<template>
    <div>
        <template v-for="(filter, index) in searchFilters">
            <v-select
                v-if="
                    filter.options.length > 1 &&
                        ['search1', 'search2', 'search_topics_group'].every(t => filter.name !== t)
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
                v-if="filter.options.length > 2 && filter.name == 'search2' && opts.module == 'topics'"
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
        <v-select
            v-model="selection.item"
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
                <template v-if="option.openFlg === 0 || option.openFlg === 1">
                    <span v-if="option.openFlg === 1"><i class="fe fe-check-circle text-success"></i></span>
                    <span v-else-if="option.openFlg === 0"><i class="fe fe-x text-danger"></i></span>
                </template>

                <span v-if="option.value !== ''">{{ option.value }} :</span>
                <span v-else>ID :</span>{{ option.label }}
            </template>
        </v-select>
        <p>
            <a href="" @click.self.prevent="cancel">キャンセル</a>
        </p>
    </div>
</template>

<script>
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';

import debounce from 'lodash.debounce';
import * as api from './api';

export default {
    props: ['selection', 'topics_group_id', 'value', 'name', 'opts', 'disp_group_no'],
    components: {
        'v-select': vSelect,
    },
    data() {
        return {
            options: [],

            searchFilters: [],
            searchFiltersValues: {},
        };
    },
    computed: {
        contentsTypeList() {
            return this.opts?.contents_type?.split(',')?.map(c => parseInt(c)) || [];
        },
    },
    methods: {
        onSearch(keyword, loading) {
            loading(true);
            this.searchDebounced({ loading, keyword });
        },
        searchDebounced: debounce(function(arg) {
            this.search(arg);
        }, 350),

        onSearchFocus() {
            this.search();
        },

        onChange(selected) {
            if (selected?.value) {
                const selection = {
                    item: null,
                    value: selected.value,
                    label: selected.label,
                    link: null,
                    openFlg: selected.open_flg,
                };
                this.$emit('input', selection);
                this.$emit('cancel');
            }
        },

        onChangeFilter(selected) {
            this.searchFiltersValues['search_topics_group'] = selected;
            this.search();
        },

        cancel() {
            this.search();
            this.$emit('cancel');
        },

        async search({ loading, keyword } = { keyword: '' }) {
            const params = {
                table_id: this.opts.module,
                allowed_id: this.searchFiltersValues?.search_topics_group?.value || this.opts.group_id,
                keyword,
                setting_id: this.topics_group_id,
                ext_no: this.name.replace(/\[(\d+)\]/, ''),
                filters: this.searchFiltersValues,
            };

            const data = await api.getRelatedFldList(params).catch(({ errors }) => {
                loading?.(false);
                throw new Error(errors);
            });

            this.options = data.items.map(item => ({
                label: item.title,
                value: item.key,
                openFlg: item.open_flg,
            }));
            this.options.unshift({ label: 'タイトル', value: 'ID', disabled: true });

            loading?.(false);

            // apply category filter (if it exists)
            const { searchFilters, searchFiltersValues } = this.getFilterData(data);
            this.searchFilters = searchFilters;
            this.searchFiltersValues = searchFiltersValues;
        },

        getFilterData(data) {
            const searchFilters = [];
            const searchFiltersValues = {};

            // add particuler category filter in head, only if Topics or Member module.
            if (this.opts.module === 'topics' || this.opts.module === 'member') {
                if (this.searchFilters?.[0]) {
                    searchFilters.push(this.searchFilters[0]);
                    searchFiltersValues.search_topics_group = this.searchFiltersValues.search_topics_group;
                } else if (Object.keys(data.topicsGroupList || {}).length > 0) {
                    const d = {
                        name: 'search_topics_group',
                        options: Object.keys(data.topicsGroupList)
                            .sort()
                            .map(item => ({ label: data.topicsGroupList[item], value: item })),
                    };
                    searchFilters.push(d);
                    searchFiltersValues.search_topics_group = d.options[0];
                }
            }

            data.searchList
                .filter(d => d.length > 0)
                .forEach((d, idx) => {
                    const filterName = `search${parseInt(idx) + 1}`;
                    const searchOptions =
                        filterName === this.contentsTypeList.length > 0
                            ? d.filter(item => this.contentsTypeList.includes(item.value))
                            : d;
                    if (this.searchFilters?.[0]?.name !== filterName) {
                        searchFilters.push({
                            name: filterName,
                            options: searchOptions || [],
                        });
                    }

                    searchFiltersValues[filterName] =
                        this.searchFiltersValues[filterName] &&
                        searchOptions.some(item => this.searchFiltersValues[filterName].value === item.value)
                            ? this.searchFiltersValues[filterName]
                            : searchOptions[0];
                });

            return {
                searchFilters,
                searchFiltersValues,
            };
        },
    },
};
</script>
