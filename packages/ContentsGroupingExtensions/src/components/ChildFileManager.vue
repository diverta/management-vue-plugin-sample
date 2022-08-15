<template>
    <div>
        <dt>{{ $attrs.ext_title }}</dt>
        <dd
            class="multi_dd"
            :class="`ext_item_${$attrs.ext_index - 1}`"
            :data-ext_type="$attrs.ext_type"
            :data-default_value="$attrs.default_value"
        ></dd>

        <div class="file_contents_upload">
            <a @click.prevent="openFileManager" class="uploadifive-button open_file_manager-button">
                <i class="fa" :class="[fileUrl ? 'fa-refresh' : 'fa-plus']" />
            </a>
        </div>
        <div class="selected_file_contents" style="padding:10px;">
            <a :href="fileUrl" target="_blank">
                {{ fileUrl || '' }}
            </a>
            <input type="hidden" ref="input" :name="`${$attrs.name}`" v-model="fileUrl" />
            <a v-if="fileUrl" @click.prevent="removeFile" class="uploadifive-button">削除する</a>
        </div>

        <p v-if="$attrs.ext_help_msg">
            <span class="hint">{{ $attrs.ext_help_msg }}</span>
        </p>

        <input type="hidden" ref="dummyInput" :id="`${fileName}`" disabled />
    </div>
</template>

<script>
export default {
    data() {
        return {
            fileUrl: null,
            mutationObserver: null,
        };
    },
    computed: {
        fileName() {
            return this.$attrs.name.replaceAll(']', '').replaceAll('[', '-');
        },
    },
    methods: {
        setupIntegrationHandler() {
            this.$nextTick(() => {
                const target = this.$refs.dummyInput;
                const config = {
                    attributes: true,
                    attributeFilter: ['value'],
                };
                const observer = new MutationObserver(mutations => {
                    mutations.forEach(mutation => {
                        if (mutation.type === 'attributes') {
                            this.fileUrl = mutation.target.value;
                        }
                    });
                });
                // 要素の監視
                observer.observe(target, config);
                this.observer = observer;
            });
        },
        openFileManager() {
            const value = this.$refs.input.value;

            // TODO: translateがあるため実装不可能？ltdは実際使われるケースがあるのか確認する
            // @see https://github.com/diverta/Kuroco-opendev/blob/e7acaa52aacd5ade4d3cf66f0363d6fc629fa990/nfs/templates/topics/admin/extensions/30.html#L16
            // if($tmpf && $tmpf.substr(0,11)=='/files/ltd/'){ldelim}
            //     startupPath = '/files/ltd/({'/label/limited_access_folder'|translate}):'+$tmpf.replace('/files/ltd', '');
            // {rdelim}

            const startupPath = value.includes('/files/user/')
                ? `/files/user/:${value.replace('/files/user', '')}`
                : '';

            const url = new URL(`${window.location.origin}/management/wysiwyg/ckfinder/3.5.1/standalone.php`);
            url.searchParams.append('action', 'js');
            url.searchParams.append('startupPath', startupPath);
            url.searchParams.append('func', 'setFileContentsToExtCol');
            url.searchParams.append('data', this.fileName);
            // if ($item.options.resource) {
            //     url.searchParams.append('resource_path', `{$item.options.resource|escape}`);
            // }

            const windowOption = Object.entries({
                width: `${window.outerWidth - 50 < 1050 ? window.outerWidth - 50 : 1050}px`,
                height: `${window.outerHeight - 120 < 600 ? window.outerHeight - 120 : 600}px`,
                menubar: 'no',
                toolbar: 'no',
                scrollbars: 'yes',
            })
                .map(([k, v]) => `${k}=${v}`)
                .join(', ');

            window.open(url, 'file_manager', windowOption);
        },
        removeFile() {
            this.fileUrl = '';
        },
    },
    mounted() {
        this.fileUrl = this.$attrs.value || '';
        this.setupIntegrationHandler();
    },
    beforeDestroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
    },
};
</script>

<style scoped>
.open_file_manager-button {
    line-height: 25px;
    overflow: hidden;
    position: relative;
    text-align: center;
    width: 140px;
}
</style>
