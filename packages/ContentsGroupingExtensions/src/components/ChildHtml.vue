<template>
    <div>
        <dt class="after_second">{{ $attrs.ext_title }}</dt>
        <dd
            class="multi_dd"
            :class="`ext_item_${$attrs.ext_index - 1}`"
            :data-ext_type="$attrs.ext_type"
            :data-default_value="$attrs.default_value"
        >
            <ExtHtml
                v-if="flagToLoadOnce"
                :name="$attrs.name"
                :value="$attrs.value"
                :language="'html'"
                :source_id="`code-source--` + $attrs.name"
                id=""
                :simplified="true"
                :width="$attrs.options.width ? $attrs.options.width : '100%'"
                :height="$attrs.options.height ? $attrs.options.height : '450'"
                :dont_use_editor="!!$attrs.options.dont_use_editor"
                :ext_help_msg="$attrs.ext_help_msg"
            />
        </dd>
    </div>
</template>

<script>
import BaseMixin from './baseMixin.js';
export default {
    mixins: [BaseMixin],
    data() {
        return {
            extComponentName: 'ExtHtml',
        };
    },
};
</script>
