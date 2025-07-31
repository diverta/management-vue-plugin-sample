<template>
    <td :class="`${columnKey}_col`">
        <slot :name="columnKey">
            {{ columnContent }}
        </slot>
    </td>
</template>

<script>
export default {
    props: {
        columnKey: {
            type: String,
            default: () => '',
        },
        columnItem: {
            type: Object,
            default: () => ({}),
        },
    },
    data() {
        return {};
    },
    computed: {
        columnContent() {
            const { columnItem, columnKey } = this;
            return Array.isArray(columnItem[columnKey]) ? columnItem[columnKey].join('\n') : columnItem[columnKey];
        },
    },
};
</script>
