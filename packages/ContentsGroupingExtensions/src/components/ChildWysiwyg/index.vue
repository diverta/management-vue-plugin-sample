<template>
    <div v-if="!ck_error" ref="editor-wrap" :style="cssProps">
        <div ref="editor" v-html="editorValue"></div>
        <textarea :name="$attrs.name" v-model="editorValue" style="display: none"></textarea>
        <link v-if="customCss" rel="stylesheet" :href="customCss" type="text/css" />
    </div>
    <div v-else>
        <textarea
            :name="$attrs.name"
            v-html="editorValue"
            :style="{ width: `${wysiwygWidth}px`, height: `${wysiwygHeight + 42}px` }"
        ></textarea>
        <div class="hint">{{ ck_error }}</div>
    </div>
</template>

<script>
import buildConfig from './buildConfig';
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';

import 'vue-select/dist/vue-select.css';

export default {
    computed: {
        cssProps() {
            return {
                width: this.wysiwygWidth + 'px',
                '--ckui-height': this.wysiwygHeight + 'px',
            };
        },
    },

    data() {
        return {
            loaded: false,
            fullscreen: false,
            // customPluginList: [],
            editor: null,
            editorValue: this.$attrs.value || '',
            customCss: this.$attrs.custom_css || '',
            wysiwygWidth: this.$attrs.width || 800,
            wysiwygHeight: this.$attrs.width || 200,
            resourcePath: this.$attrs.resource || '',
            selection: null,
            range: null,
            flask: null,
            ck_error: null,
        };
    },

    methods: {
        async createEditor() {
            const config = buildConfig({ ...this.$attrs, ...(this.$attrs.options || {}) });
            try {
                this.editor = await ClassicEditor.create(this.$refs['editor'], config);
                this.editor.on('fullscreenMode', this.fullscreenMode);
                this.editor.model.document.on('change', this.handleOnChange);
            } catch (error) {
                this.ck_error = error.message;
            }
        },

        fullscreenMode() {
            this.fullscreen = !this.fullscreen;
        },
        handleOnChange() {
            this.editorValue = this.editor.getData();
        },
    },

    watch: {
        '$attrs.activated': {
            immediate: true,
            deep: true,
            handler(activated) {
                if (activated && !this.editor) {
                    this.$nextTick(() => this.createEditor());
                }
            },
        },
    },
};
</script>

<style>
.ck-editor__editable_inline {
    min-height: var(--ckui-height);
}
.ck.ck-dropdown.ck-heading-dropdown .ck-dropdown__button .ck-button__label {
    width: 2em !important;
}
.ck-content .table table td,
.ck-content .table table th {
    background: none;
    width: auto;
}
.ck-content .table table {
    margin-bottom: 0;
}
.ck-content ol {
    list-style-type: decimal;
}
.ck-content ul {
    list-style-type: disc;
}
.ck-content u {
    text-decoration: underline;
}
.ck-content strong {
    font-weight: bold;
}
.ck-content i {
    font-style: italic;
}
</style>
