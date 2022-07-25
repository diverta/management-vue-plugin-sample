<template>
    <table :id="tableId" width="100%">
        <tr>
            <th v-if="auth.update || auth.delete">
                <input type="checkbox" :checked="isAllChecked" @change="handleAllCheckedChange" />
            </th>
            <slot name="header">
                <!-- eslint-disable vue/no-use-v-if-with-v-for -->
                <table-column-header
                    v-for="column in columns"
                    :key="column.key_name"
                    v-if="!excludeKeys.includes(column.key_name)"
                    :columnKey="column.key_name"
                    :columnName="column.disp_name"
                    :sortable="column.sortable"
                    :currSortKey="sortKey"
                    :isDescSorting="isDesc"
                    @columnSortStateChange="handleSortStateChange"
                />
            </slot>
        </tr>
        <tr
            v-for="(dataItem, index) in listData"
            :key="dataItem[rowCheckedKey]"
            :class="`row${index % 2 === 0 ? 1 : 0}`"
        >
            <td v-if="auth.update || auth.delete">
                <input
                    type="checkbox"
                    :name="`${rowCheckedKey}[]`"
                    :value="dataItem[rowCheckedKey]"
                    :checked="checkedRowsMap[dataItem[rowCheckedKey]]"
                    @change="handleRowChecked($event, dataItem)"
                />
            </td>
            <slot name="body" :dataItem="dataItem">
                <table-column-content
                    v-for="column in columns"
                    :key="column.key_name"
                    v-if="!excludeKeys.includes(column.key_name)"
                    :columnItem="dataItem"
                    :columnKey="column.key_name"
                >
                </table-column-content>
            </slot>
        </tr>
    </table>
</template>

<script>
import TableColumnHeader from '@/common/components/base-table/table-column-header/TableColumnHeader.vue';
import TableColumnContent from '@/common/components/base-table/table-column-content/TableColumnContent.vue';

export default {
    name: 'base-table',
    components: { TableColumnHeader, TableColumnContent },
    props: {
        listData: {
            type: Array,
            default: () => [],
        },
        columns: {
            type: Array,
            default: () => [],
        },
        excludeKeys: {
            type: Array,
            default: () => [],
        },
        tableId: {
            type: String,
            default: () => 'base-table',
        },
        auth: {
            type: Object, // like { update: true, delete: true }
            default: () => ({}),
        },
        /**
         * This key is for checkedRowsMap
         */
        rowCheckedKey: {
            type: String,
            default: () => 'id',
        },
        sortKey: {
            type: String,
            default: 'none',
        },
        isDesc: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            /**
             * checked rows which looks like { [rowCheckedKey]: [rowCheckedKey] }
             */
            checkedRowsMap: {},
            isAllChecked: false,
        };
    },
    watch: {
        listData: function() {
            this.isAllChecked = false;
            this.checkedRowsMap = {};
        },
    },
    methods: {
        handleSortStateChange(payload) {
            this.$emit('columnSortStateChange', payload);
        },
        handleAllCheckedChange(e) {
            const checked = e.target.checked;
            const { rowCheckedKey } = this;
            if (checked) {
                const checkedRowsMap = {};
                this.listData.forEach(item => (checkedRowsMap[item[rowCheckedKey]] = true));
                this.checkedRowsMap = checkedRowsMap;
                this.isAllChecked = true;
            } else {
                this.checkedRowsMap = {};
                this.isAllChecked = false;
            }
            this.$emit('checkedRowsChange', { ...this.checkedRowsMap });
            this.$nextTick(() => this.$forceUpdate());
        },
        handleRowChecked(e, listItem) {
            const checked = e.target.checked;
            const { rowCheckedKey } = this;
            if (checked) {
                const checkedRowsMap = { ...this.checkedRowsMap };
                checkedRowsMap[listItem[rowCheckedKey]] = true;
                this.checkedRowsMap = checkedRowsMap;
            } else {
                delete this.checkedRowsMap[listItem[rowCheckedKey]];
                this.checkedRowsMap = { ...this.checkedRowsMap };
            }
            const selectedCount = Object.keys(this.checkedRowsMap).length;
            this.isAllChecked = selectedCount > 0 && selectedCount === this.listData.length;
            this.$emit('checkedRowsChange', { ...this.checkedRowsMap });
        },
    },
};
</script>
