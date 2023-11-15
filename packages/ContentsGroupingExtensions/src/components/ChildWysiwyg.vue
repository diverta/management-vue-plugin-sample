<template>
    <div>
        <dt class="after_second">{{ $attrs.ext_title }}</dt>
        <dd
            class="multi_dd"
            :class="`ext_item_${$attrs.ext_index - 1}`"
            :data-ext_type="$attrs.ext_type"
            :data-default_value="$attrs.default_value"
        >
            <ExtWysiwyg
                v-if="flagToLoadOnce"
                :name="$attrs.name"
                :value="$attrs.value"
                :opts="$attrs.options"
                :upload_dir="$attrs.upload_dir"
                :placeholders="$attrs.options.placeholders"
                :use_font_size_px="$attrs.options.use_font_size_px ? $attrs.options.use_font_size_px : 0"
                :resource_path="$attrs.options.resource"
                :ext_help_msg="$attrs.ext_help_msg"
                :delay="0"
                :lang="siteLang"
                ckfinder="/management/wysiwyg"
                script_path="/management/wysiwyg/ckfinder/3.5.1/ckfinder.js"
            />
        </dd>
    </div>
</template>

<script>
import { globalState } from '@/common/global-state';
import BaseMixin from './baseMixin.js';
export default {
    mixins: [BaseMixin],
    computed: {
        siteLang() {
            return globalState.siteLang;
        },
    },
    data() {
        return {
            extComponentName: 'ExtWysiwyg',
        };
    },
};
</script>
