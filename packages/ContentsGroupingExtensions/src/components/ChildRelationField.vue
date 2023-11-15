<template>
    <div>
        <dt class="after_second">{{ $attrs.ext_title }}</dt>
        <dd
            class="multi_dd"
            :class="`ext_item_${$attrs.ext_index - 1}`"
            :data-ext_type="$attrs.ext_type"
            :data-default_value="$attrs.default_value"
        >
            <dl>
                <ExtRelationFld
                    v-bind="{
                        call_from_module: 'topics',
                        setting_id: $attrs.topics_group_id,
                        ext_no: $attrs.name.replace(/\[(\d+)\]/i, ''),
                        selected_item: $attrs.value,
                        table_id: $attrs.options.module,
                        allowed_id: $attrs.options.group_id,
                        limit: $attrs.options.limit,
                        name: $attrs.name,
                        disp_group_no: $attrs.disp_group_no,
                        ext_options: $attrs.options,
                        ext_help_msg: $attrs.ext_help_msg,
                    }"
                    v-if="flagToLoadOnce"
                />
            </dl>
        </dd>
    </div>
</template>

<script>
import BaseMixin from './baseMixin.js';
export default {
    mixins: [BaseMixin],
    data() {
        return {
            extComponentName: 'ExtRelationFld',
        };
    },
};
</script>
