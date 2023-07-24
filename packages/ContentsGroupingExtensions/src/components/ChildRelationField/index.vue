<template>
    <div>
        <div v-if="flagToLoadOnce">
            <ExtRelationFld
                v-bind="{
                    call_from_module: 'topics',
                    setting_id: $attrs.topics_group_id,
                    ext_no: $attrs.name,
                    selected_item: $attrs.value,
                    table_id: $attrs.options.module,
                    allowed_id: $attrs.options.group_id,
                    limit: $attrs.options.limit,
                    input_name: $attrs.name,
                    disp_group_no: $attrs.options.disp_group_no,
                    ext_options: $attrs.options,
                }"
            />
        </div>
    </div>
</template>

<script>
export default {
    inheritAttrs: false,
    data() {
        return {
            flagToLoadOnce: false,
        };
    },
    computed: {
        isLoaded() {
            // isLoaded in ContentsGroupingExtension
            return this.$parent.$parent.isLoaded;
        },
    },
    watch: {
        isLoaded: {
            immediate: true,
            handler(newVal) {
                if (newVal && !this.flagToLoadOnce) {
                    console.log(window['common/components/extensions/ExtRelationFld']);
                    this.$options.components.ExtRelationFld = window['common/components/extensions/ExtRelationFld'];
                    this.flagToLoadOnce = true;
                }
            },
        },
    },
};
</script>
