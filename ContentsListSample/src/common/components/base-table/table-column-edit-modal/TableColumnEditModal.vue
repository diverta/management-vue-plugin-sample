<template>
    <modal
        name="table-column-edit-modal"
        :width="500"
        height="auto"
        @before-open="initTempSelectedDisplayColumns"
        @closed="resetTempSelectedDisplayColumns"
    >
        <div class="column-edit-modal">
            <p>{{ labels.customize_table_columns }}</p>
            <draggable tag="ul" :list="tempSelectedDisplayColumns" class="list-group">
                <li
                    class="list-group-item"
                    v-for="(element, idx) in tempSelectedDisplayColumns"
                    :key="element.key_name"
                >
                    <i class="fa fa-align-justify handle"></i>
                    <span class="text">{{ element.disp_name }} </span>
                    <i
                        v-if="!element.undeletable"
                        class="fa fa-times close"
                        @click.prevent="removeDisplayItem(idx)"
                    ></i>
                </li>
            </draggable>
            <select class="display-item-select" @change="handleDisplayColumnSelectChange">
                <option selected>{{ labels.select }}</option>
                <option
                    v-for="option in displayColumnLeftOptions"
                    :key="option.key_name"
                    :value="option.key_name"
                    :selected="false"
                    @click.prevent="addDisplayItem(option)"
                >
                    {{ option.disp_name }}
                </option>
            </select>
            <div class="display-item-buttons">
                <div class="btn" @click.prevent="handleEditCancel">
                    <span>{{ labels.cancel_btn }}</span>
                </div>
                <div class="btn apply" @click.prevent="handleEditConfirm">{{ labels.apply_btn }}</div>
            </div>
        </div>
    </modal>
</template>

<script>
import Vue from 'vue';
import Base from '@/common/Base.vue';
import VModal from 'vue-js-modal';
import Draggable from 'vuedraggable';

Vue.use(VModal);

export default {
    extends: Base,
    name: 'table-column-edit-modal',
    components: { Draggable },
    props: {
        columnOptions: {
            type: Array,
            default: () => [],
        },
        selectedColumns: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            labels: {
                select: this.translate('/label/select_btn'),
                apply_btn: this.translate('/label/apply_btn'),
                cancel_btn: this.translate('/label/cancel_btn'),
                customize_table_columns: this.translate('/label/customize_table_columns'),
            },
            tempSelectedDisplayColumns: [], // user selected display columns in the draggable modal temporary
        };
    },
    computed: {
        displayColumnLeftOptions() {
            const columnOptions = Array.isArray(this.columnOptions) ? this.columnOptions : [];
            return columnOptions.filter(item =>
                this.tempSelectedDisplayColumns.every(elem => elem.key_name !== item.key_name)
            );
        },
    },
    methods: {
        initTempSelectedDisplayColumns() {
            this.tempSelectedDisplayColumns = [...this.selectedColumns];
        },
        resetTempSelectedDisplayColumns() {
            this.tempSelectedDisplayColumns = [];
        },
        handleDisplayColumnSelectChange(event) {
            const keyName = event.target.value;
            const columnOptions = Array.isArray(this.columnOptions) ? this.columnOptions : [];
            const item = columnOptions.find(elem => keyName === elem.key_name);
            if (item) this.tempSelectedDisplayColumns.push(item);
            this.$nextTick(() => (event.target.selectedIndex = 0));
        },
        addDisplayItem(item) {
            this.tempSelectedDisplayColumns.push(item);
        },
        removeDisplayItem(idx) {
            this.tempSelectedDisplayColumns.splice(idx, 1);
        },
        handleEditCancel() {
            this.$emit('cancel');
        },
        handleEditConfirm() {
            this.$emit('confirm', [...this.tempSelectedDisplayColumns]);
        },
    },
};
</script>

<style lang="scss" scoped>
.column-edit-modal {
    padding: 16px;

    .list-group {
        height: 240px;
        margin-top: 12px;
        overflow: auto;

        .list-group-item {
            width: 100%;
            height: 36px;
            display: flex;
            align-items: center;
            border-bottom: 1px solid #e5e5e5;

            > i {
                margin-top: 2px !important;
                margin-right: 12px;
            }

            .text {
                flex: 1;
                cursor: default;
            }
        }
    }

    .display-item-select {
        display: block;
        width: 100%;
        height: 36px;
        margin: 24px 0;
        outline: none;

        &:focus {
            outline: none;
        }
    }

    .display-item-buttons {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .btn {
            width: 120px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid #555;
            border-radius: 4px;
        }

        .apply {
            color: #2d6bb3;
            border: 1px solid #2d6bb3;
        }
    }
}
</style>
