<template>
    <div>
        <dt class="after_second">{{ $attrs.ext_title }}</dt>
        <dd
            class="multi_dd"
            :class="`ext_item_${$attrs.ext_index - 1}`"
            :data-ext_type="$attrs.ext_type"
            :data-default_value="$attrs.default_value"
        >
            <template v-if="$attrs.options.dont_use_editor">
                <textarea :name="$attrs.name" v-bind="plainInputAttrs" v-model="code"></textarea><br />
            </template>
            <template v-else>
                <div v-bind="editorAttrs">
                    <input :name="$attrs.name" :id="`code-source--${$attrs.name}`" type="hidden" v-model="code" />
                    <br />
                    <MonacoEditor
                        v-if="$attrs.activated"
                        v-bind="{ ...$attrs, code, opt: $attrs.options }"
                        @input="(v) => (code = v)"
                    />
                </div>
            </template>
        </dd>
    </div>
</template>

<script>
export default {
    inheritAttrs: false,
    components: {
        MonacoEditor: () => import('./MonacoEditor.vue'),
    },
    data() {
        return {
            code: this.$attrs.value || '',
        };
    },
    computed: {
        plainInputAttrs() {
            const wh = {
                width: this.$attrs?.options?.width ? this.$attrs.options.width + 'px' : '100%',
                height: this.$attrs?.options?.height ? this.$attrs.options.height + 'px' : '100%',
            };
            if (!wh.width && !wh.height) {
                return {
                    rows: 4,
                    cols: 60,
                };
            }
            return { style: wh };
        },
        editorAttrs() {
            const wh = {
                width: this.$attrs?.options?.width ? `${parseInt(this.$attrs.options.width) + 30}px` : '800px',
                'min-height': this.$attrs?.options?.height ? `${parseInt(this.$attrs.options.height) + 90}px` : '530px',
            };
            if (!wh.width && !wh.height) {
                return {
                    rows: 4,
                    cols: 60,
                };
            }
            return wh;
        },
    },
};
</script>
