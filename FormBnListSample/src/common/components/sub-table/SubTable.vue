<template>
    <div>
        <form :name="tableForm" :ref="tableForm">
            <input
                v-for="(formItem, index) in subForms"
                type="hidden"
                :key="index"
                :name="formItem.key_name"
                :value="formItem.value"
            />
        </form>
        <table v-if="dataList.length > 0" :id="tableForm" width="100%">
            <tr>
                <table-column-header
                    v-for="column in columns"
                    :key="column.key_name"
                    :columnKey="column.key_name"
                    :columnName="column.disp_name"
                >
                </table-column-header>
            </tr>
            <tr v-for="(dataItem, index) in dataList" :key="index" :class="`row${index % 2 === 0 ? 1 : 0}`">
                <table-column-content
                    v-for="column in columns"
                    :key="column.key_name"
                    :columnItem="dataItem"
                    :columnKey="column.key_name"
                >
                    <template v-slot:status>
                        {{ dataItem.status_txt }}
                    </template>
                    <template v-slot:do_datetime>
                        <time-from-now v-if="dataItem.do_datetime" :time="dataItem.do_datetime" />
                    </template>
                    <template v-slot:last_do_ymdhi>
                        <time-from-now v-if="dataItem.last_do_ymdhi" :time="dataItem.last_do_ymdhi" />
                    </template>
                    <template v-slot:result>
                        <div v-if="Array.isArray(dataItem.result)">
                            <a v-for="res in dataItem.result" :href="res.link" :key="res.link">{{ res.title }}</a>
                        </div>
                        <a v-else :href="dataItem.result.link">{{ dataItem.result.title }}</a>
                    </template>
                </table-column-content>
            </tr>
        </table>
    </div>
</template>

<script>
import TableColumnHeader from '@/common/components/base-table/table-column-header/TableColumnHeader.vue';
import TableColumnContent from '@/common/components/base-table/table-column-content/TableColumnContent.vue';
import BaseTablePage from '@/common/components/base-table/BaseTablePage.vue';
import TimeFromNow from '@/common/components/TimeFromNow.vue';
import axios from 'axios';
import { processError } from '@/api/utils';

export default {
    name: 'sub-table',
    extends: BaseTablePage,
    components: { TableColumnHeader, TableColumnContent, TimeFromNow },
    props: {
        listData: {
            type: Array,
            default: () => [],
        },
        columns: {
            type: Array,
            default: () => [],
        },
        mt: {
            type: String,
            default: () => '',
        },
        ct: {
            type: String,
            default: () => '',
        },
        subForms: {
            type: Array,
            default: () => [],
        },
        refs: {
            type: String,
            default: () => '',
        },
        tableForm: {
            type: String,
            default: () => 'sub-table',
        },
    },
    data() {
        return {
            messages: [],
            dataListKey: 'list', // dataList key in the api response
        };
    },
    mounted() {
        this.$nextTick(this.refreshSubTableListData);
    },
    methods: {
        fetchSubListData(queryStr = '', method = 'GET') {
            const query = queryStr.startsWith('?') ? queryStr : `?${queryStr}`;
            const url = `/management/${this.mt}/${this.ct}/${query}`;
            this.fetchTableListData(url, method);
        },
        refreshSubTableListData() {
            const formData = this.$refs[this.tableForm];
            const query = this.convertFormDataToQueryString(formData);
            this.fetchSubListData(query);
        },
        async handleSubTableBtnClick(url, method = 'GET', params = {}) {
            await axios(url, {
                headers: { Accept: 'application/json' },
                withCredentials: true,
                params: params,
                method,
            })
                .then(processError)
                .then(res => {
                    if (res.messages && res.messages.length > 0) {
                        this.messages = res.messages;
                    }
                })
                .then(() => {
                    this.loading = false;
                    this.refreshSubTableListData();
                });
        },
    },
};
</script>
