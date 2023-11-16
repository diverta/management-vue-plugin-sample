<template>
    <div>
        <dt>{{ $attrs.ext_title }}</dt>
        <dd
            class="multi_dd"
            :class="`ext_item_${$attrs.ext_index - 1}`"
            :data-ext_type="$attrs.ext_type"
            :data-default_value="$attrs.default_value"
        >
            <ExtFileManager
                v-if="flagToLoadOnce"
                :name="$attrs.name"
                :value="$attrs.value"
                :file_url="$attrs.file_url"
                :opts="opts"
                :ext_help_msg="$attrs.ext_help_msg"
                :ckfinder_path="`http://localhost/management/wysiwyg/ckfinder/3.5.1/standalone.php`"
            />
        </dd>
    </div>
</template>

<script>
import BaseMixin from './baseMixin.js';
export default {
    mixins: [BaseMixin],
    computed: {
        opts() {
            if (Array.isArray(this.$attrs.options) || !this.$attrs.options) {
                return {};
            }
            return this.$attrs.options;
        },
    },
    data() {
        return {
            extComponentName: 'ExtFileManager',
        };
    },
};
</script>
