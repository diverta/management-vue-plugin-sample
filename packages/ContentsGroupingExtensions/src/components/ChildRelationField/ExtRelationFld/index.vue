<template>
    <div>
        <input type="hidden" :name="name" v-model="selection.value" />

        <SelectedItem
            v-show="!showsItemFinder"
            @edit="() => (showsItemFinder = true)"
            @clear="clearSelection"
            :selection="selection"
        />
        <ItemFinder
            v-show="showsItemFinder"
            @cancel="() => (showsItemFinder = false)"
            v-bind="{ selection, ...$props, ...$attrs }"
            @input="d => (selection = d)"
        />
    </div>
</template>
<script>
import * as api from './api';

export default {
    inheritAttrs: false,
    props: ['name', 'value', 'opts'],

    components: {
        SelectedItem: () => import('./SelectedItem.vue'),
        ItemFinder: () => import('./ItemFinder.vue'),
    },

    data() {
        return {
            showsItemFinder: false,

            selection: {
                item: null,
                value: null,
                label: '選択なし',
                link: null,
                openFlg: null,
            },
        };
    },

    async created() {
        if (!this.value) {
            return;
        }

        const selectedModuleId = this.value?.module_id || this.value;

        const loadLabel = async () => {
            const params = {
                table_id: this.opts.module,
                selected_item: selectedModuleId,
                allowed_id: this.opts.group_id,
            };
            return await api.getRelatedFldLabel(params);
        };

        const data = await loadLabel();

        this.selection = {
            item: null,
            value: data.title ? selectedModuleId : null,
            label: data.title || '選択なし',
            link: data.link || null,
            openFlg: 'open_flg' in data ? parseInt(data.open_flg) : null,
        };
    },

    methods: {
        clearSelection() {
            this.selection = {
                item: null,
                value: null,
                label: '選択なし',
                link: null,
                openFlg: null,
            };
        },
    },
};
</script>
