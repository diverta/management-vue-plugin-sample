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
/**
 * README:
 *      Please change ckfinder_path domain to your own Kuroco admin domain.
 */
export default {
    props: {
        isLoaded: { type: Boolean, required: true },
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
                    this.$options.components.ExtFileManager = window['common/components/extensions/ExtFileManager'];
                    this.flagToLoadOnce = true;
                }
            },
        },
    },
};
</script>
