<template>
    <th :class="[thClass || `${columnKey}_col`]">
        <slot>
            <template v-if="sortable">
                <template v-if="currSortKey === (sortKey || columnKey)">
                    <img v-if="isDescSorting" src="/management/images/management/icon_down.gif" />
                    <img v-else src="/management/images/management/icon_up.gif" />
                </template>
                <a href="" :data-key="sortKey || columnKey" @click="handleSortableHeaderClick">{{ columnName }}</a>
            </template>
            <template v-else>{{ columnName }}</template>
        </slot>
    </th>
</template>

<script>
import Base from '@/common/Base.vue';

export default {
    extends: Base,
    name: 'table-column-header',
    props: {
        thClass: {
            type: String,
            default: () => '',
        },
        sortable: {
            type: Boolean,
            default: () => false,
        },
        sortKey: {
            type: String,
            default: () => '',
        },
        columnKey: {
            type: String,
            default: () => '',
        },
        columnName: {
            type: String,
            default: () => '',
        },
        currSortKey: {
            type: String,
            default: () => '',
        },
        isDescSorting: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {};
    },
    methods: {
        handleSortableHeaderClick(e) {
            e.preventDefault();
            if (!this.sortable) return;
            const columnKey = e.target.dataset.key;
            const { currSortKey, isDescSorting } = this;
            const isDesc = currSortKey === columnKey ? !isDescSorting : false;
            this.$emit('columnSortStateChange', { columnKey, isDesc });
        },
    },
};
</script>

<style lang="scss" scoped></style>
