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
            :style="{ width: `${wysiwygWidth}`, height: `${wysiwygHeight + 42}` }"
        ></textarea>
        <div class="hint">{{ ck_error }}</div>
    </div>
</template>

<script>
import axios from 'axios';
import buildConfig from './buildConfig';
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';

import 'vue-select/dist/vue-select.css';

export default {
    computed: {
        cssProps() {
            return {
                width: this.wysiwygWidth,
                '--ckui-height': this.wysiwygHeight,
            };
        },
        customCss() {
            return /custom_css::(\S+.css)/g.exec(this.$attrs?.ext_option || '')?.[1];
        },
    },

    data() {
        return {
            creationStarted: false,
            loaded: false,
            fullscreen: false,
            // customPluginList: [],
            editor: null,
            editorValue: this.$attrs.value || '',
            wysiwygWidth: this.$attrs.options?.height || this.$attrs.wysiwygHeight || '800px',
            wysiwygHeight: this.$attrs.options?.width || this.$attrs.wysiwygWidth || '200px',
            resourcePath: this.$attrs.options?.resource || this.$attrs.resourcePath || '',
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
                if (this.editor) {
                    this.editor.destroy();
                }

                config.templatesConfig = {
                    templates: {},
                    labels: {
                        select_template: 'テンプレート一覧',
                        replace_content: 'コンテンツをすべて置き換える',
                        templates_list: 'テンプレート',
                    },
                };
                const templates = await this.loadTemplates();
                if (templates) {
                    templates.forEach((template) => {
                        config.templatesConfig.templates[template.wysiwyg_template_id] = {
                            name: template.wysiwyg_template_nm,
                            template: template.body,
                        };
                    });
                }

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
        async loadTemplates() {
            const templatesUrl = `/management/site/site_wysiwygtemplate_list/?pageID=1&per_page=1000`;

            const resp = await axios(templatesUrl, {
                method: 'GET',
                headers: { Accept: 'application/json' },
                withCredentials: true,
            });
            return resp?.data?.template_list.filter((item) => item.open_flg === 1);
        },
    },

    watch: {
        '$attrs.activated': {
            immediate: true,
            deep: true,
            handler(activated) {
                if (activated && !this.creationStarted && !this.editor) {
                    this.creationStarted = true;
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
