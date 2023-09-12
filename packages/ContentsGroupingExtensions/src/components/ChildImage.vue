<template>
    <div>
        <dt>{{ $attrs.ext_title }}</dt>
        <dd
            class="multi_dd"
            :class="`ext_item_${$attrs.ext_index - 1}`"
            :data-ext_type="$attrs.ext_type"
            :data-default_value="$attrs.default_value"
        >
            <ExtImage
                v-if="flagToLoadOnce"
                :name="$attrs.name"
                :lang="docmeta.lang"
                :is_primary="docmeta.is_primary"
                :value="$attrs.value"
                :file_url="
                    '/direct/topics/file_upload/width=' +
                    $attrs.options.width +
                    '%26height=' +
                    $attrs.options.height +
                    '%26topics_group_id=' +
                    topics_group_id +
                    '%26ext_no=' +
                    $attrs.no
                "
                :file_type="$attrs.options.extensions ? $attrs.options.extensions : 'jpg'"
                :max_file_size="$attrs.options.max_file_size ? $attrs.options.max_file_size : '1024'"
                :ext_help_msg="$attrs.ext_help_msg"
                :default_url="$attrs.file_url ? $attrs.file_url : ''"
                :default_url_l="$attrs.file_url_L ? $attrs.file_url_L : ''"
                :is_delete="$attrs.is_delete ? $attrs.is_delete : false"
                :opts="opts"
                :script_data="{}"
                primary_value=""
            />
        </dd>
    </div>
</template>

<script>
/**
 * @todo: Check that script_data props
 */
export default {
    props: {
        isLoaded: { type: Boolean, required: true },
        docmeta: { type: Object, required: true },
        topics_group_id: { type: Number, required: true },
    },
    data() {
        return {
            flagToLoadOnce: false,
        };
    },
    computed: {
        opts() {
            if (Array.isArray(this.$attrs.options) || !this.$attrs.options) {
                return {};
            }
            return this.$attrs.options;
        },
    },
    watch: {
        isLoaded: {
            immediate: true,
            handler(newVal) {
                if (newVal && !this.flagToLoadOnce) {
                    this.$options.components.ExtImage = window['common/components/extensions/ExtImage'];
                    this.flagToLoadOnce = true;
                }
            },
        },
    },
};
</script>
