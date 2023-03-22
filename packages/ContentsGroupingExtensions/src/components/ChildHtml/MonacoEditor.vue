<template>
    <div class="no_ext_fld" :class="{ fullscreen: this.isFullscreen }">
        <div class="monaco-editor-settings">
            <div class="monaco-editor-settings--block">
                <label
                    >テーマ:
                    <select v-model="theme" v-on:change="changeEditorTheme">
                        <option value="rcms-vs">Visual Studio</option>
                        <option value="rcms-vs-dark">Visual Studio Dark</option>
                        <option value="rcms-hc-black">High Contrast Dark</option>
                    </select>
                </label>
            </div>
            <div class="monaco-editor-settings--block">
                <label
                    >フォントサイズ:
                    <select v-model="fontSize" v-on:change="changeFontSize">
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                        <option value="13">13</option>
                        <option value="14">14</option>
                        <option value="15">15</option>
                        <option value="16">16</option>
                    </select>
                </label>
            </div>
            <div class="monaco-editor-settings--block">
                <button
                    type="button"
                    class="rcms_btn success large"
                    v-on:click="toggleFullscreen"
                    v-show="!this.isFullscreen"
                >
                    <i class="fa fa-expand"></i>全画面表示
                </button>
                <button
                    type="button"
                    class="rcms_btn success large"
                    v-on:click="toggleFullscreen"
                    v-show="this.isFullscreen"
                >
                    <i class="fa fa-compress"></i>全画面を終了
                </button>
            </div>
        </div>
        <div class="monaco-editor-wrap" :style="wrapStyle">
            <div class="editor" :ref="id" />
        </div>
    </div>
</template>

<script>
import setupCustomTheme from './setupCustomTheme';
import loader from '@monaco-editor/loader';
import $ from 'jquery';

export default {
    props: {
        code: {
            default() {
                return '';
            },
        },
        opt: {
            default() {
                return () => ({});
            },
        },
    },

    data() {
        return {
            monaco: null, // monaco-editor instance (since theme change requires this whole instance).
            editor: null,

            id: `monaco_${Date.now()}`,

            editorLanguage: 'html',
            isFullscreen: window.monacoFullscreen,
            theme: 'rcms-vs',
            fontSize: 14,
            options: {
                selectOnLineNumbers: false,
                scrollbar: {
                    alwaysConsumeMouseWheel: false,
                },
            },
            wrapStyle: {
                display: 'block',
                clear: 'both',
                width: this.opt?.width ? `${this.opt?.width}px` : undefined,
                height: this.opt?.height ? `${this.opt?.height}px` : '550px',
            },
        };
    },

    mounted() {
        this.$nextTick(async () => {
            const monaco = await loader.init();
            setupCustomTheme(monaco, this.fontSize);
            this.customizeColors();

            const editor = monaco.editor.create(this.$refs[this.id], {
                value: this.code,
                language: this.editorLanguage,
                ...this.options,
            });

            editor.onDidChangeModelContent(() => {
                this.$emit('input', editor.getValue());
            });

            this.monaco = monaco;
            this.editor = editor;

            window.addEventListener('resize', this.layout);
            window.addEventListener('buildeditor', this.layout);
            window.addEventListener('add_repeat_field', this.layout);
        });
    },

    beforeDestroy() {
        this.editor?.dispose();
        window.removeEventListener('resize', this.layout);
        window.removeEventListener('buildeditor', this.layout);
        window.removeEventListener('add_repeat_field', this.layout);
    },

    methods: {
        layout() {
            this.editor?.layout();
        },
        async waitUntil(target, ms = 100) {
            return new Promise(resolve => {
                const interval = setInterval(() => {
                    if (target) {
                        clearInterval(interval);
                        resolve();
                    }
                }, ms);
            });
        },
        async changeEditorTheme() {
            await this.waitUntil(this.editor);
            this.monaco.editor.setTheme(this.theme);
            this.customizeColors();
        },
        async changeFontSize() {
            await this.waitUntil(this.editor);
            this.editor.updateOptions({
                fontSize: this.fontSize,
            });
        },
        async toggleFullscreen() {
            this.isFullscreen = !this.isFullscreen;
            await this.waitUntil(this.editor);
            this.editor.layout();
        },

        customizeColors() {
            $('.monaco-editor-wrap')
                .find('style')
                .remove();
            if (this.theme === 'rcms-vs') {
                $(
                    '<style>.suggest-widget { color: #fff !important; } .suggest-widget.visible { color: #000 !important; }</style>'
                ).appendTo('.monaco-editor-wrap');
            } else {
                $(
                    '<style>.suggest-widget { color: #000 !important; } .suggest-widget.visible { color: #fff !important; }</style>'
                ).appendTo('.monaco-editor-wrap');
            }
        },
    },
};
</script>

<style scoped>
@font-face {
    font-family: 'codicon';
    src: url('~monaco-editor/esm/vs/base/browser/ui/codicons/codicon/codicon.ttf') format('truetype');
}
.fullscreen {
    position: fixed;
    top: 0;
    left: 260px;
    width: calc(100vw - 300px);
    height: calc(100vh - 45px);
    background: #fff;
    margin: 0;
    padding: 0;
    z-index: 1000;
}
.fullscreen .monaco-editor-wrap {
    height: calc(100vh - 35px) !important;
    width: 100% !important;
    border: 1px solid #333 !important;
}
.monaco-editor-settings {
    margin: 5px 0 3px 0;
    padding: 5px 0 5px 10px;
    z-index: 9999;
}
.monaco-editor-settings--block {
    display: inline-block;
}
.monaco-editor-settings--form-btns {
    display: inline-block;
    float: right;
}
.monaco-editor-settings .rcms_btn {
    height: 30px;
    min-width: 100px;
    padding: 0 12px 2px 12px;
    margin: -4px 0 0 15px;
}
.editor {
    width: 100%;
    height: calc(100% - 25px);
}
.editor--simplified {
    border: 1px solid #000 !important;
}
.ext_fld .monaco-editor-settings {
    padding: 5px 0 65px 0;
}
.no_ext_fld {
    border: 1px solid #999 !important;
}
</style>
