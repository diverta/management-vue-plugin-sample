<template>
    <div>
        <dt class="after_second">{{ $attrs.ext_title }}</dt>
        <dd
            class="multi_dd"
            :class="`ext_item_${$attrs.ext_index - 1}`"
            :data-ext_type="$attrs.ext_type"
            :data-default_value="$attrs.default_value"
        >
            <div v-show="!removes">
                <div v-if="fileURL">
                    <a :href="fileURL" target="_blank">
                        <img :src="fileURL" style="max-width: 200px" alt="" />
                    </a>
                    <input v-if="$attrs.activated" type="hidden" :name="`tmpfile_${$attrs.name}`" :value="fileURL" />
                </div>
                <br />

                <!-- <div :id="`fileQueue${$attrs.ext_col_nm}-0`"></div> -->

                <div
                    class="uploadifive-button"
                    style="
                        height: 30px;
                        line-height: 30px;
                        overflow: hidden;
                        position: relative;
                        text-align: center;
                        width: auto;
                    "
                >
                    <i :class="['fa', fileURL ? 'fa-refresh' : 'fa-plus']"></i>
                    {{ fileURL ? '画像を差し替える' : '画像を選択する' }}

                    <input
                        v-if="$attrs.activated"
                        type="file"
                        name="Filedata"
                        style="font-size: 30px; opacity: 0; position: absolute; right: -3px; top: -3px; z-index: 999"
                        :accept="accepts.join(',')"
                        @input="upload"
                    />
                </div>
                <div v-if="msg">
                    <span style="color: red">{{ msg }}</span>
                </div>
            </div>
            <div>
                <input :name="`del_file_${$attrs.ext_col_nm}-0`" type="checkbox" value="1" @change="onApplyRemoves" />
                削除する
            </div>
            <p></p>
            <div>
                画像の説明:
                <textarea :name="$attrs.name" rows="2" cols="60" v-model="description" />
            </div>
        </dd>
    </div>
</template>

<script>
export default {
    data() {
        return {
            removes: false,
            fileURL: null,
            msg: null,
            accepts: ['image/jpeg', 'image/gif', 'image/png', 'image/svg+xml'],
            description: '',
        };
    },
    methods: {
        onApplyRemoves() {
            this.removes = !this.removes;
        },
        async requestUploadFile(file) {
            // TODO topics_group_idを取得できない
            // TODO new URLParams
            const topicsGroupID = new URL(window.location.href).searchParams.get('topics_id');
            const url = `/direct/topics/file_upload/?type=file%26width=%26height=%26topics_group_id=${topicsGroupID}%26ext_no=${this.$attrs.no}`;

            const data = new FormData();
            data.append('fileext', file.name.split('.').pop());
            data.append('key', file.name);
            data.append('Filedata', file);

            const res = await fetch(url, {
                method: 'POST',
                body: data,
                mode: 'cors',
                credentials: 'include',
            });
            return res.text();
        },
        async upload($e) {
            this.msg = null;

            const file = $e.target.files[0];
            const fileMB = file.size / 1024 / 1024;
            if (fileMB > 10) {
                this.msg = 'ファイルサイズが大きすぎます。';
                return;
            }

            try {
                const domStr = await this.requestUploadFile(file);
                const template = document.createElement('template');
                template.innerHTML = domStr;
                this.fileURL = template.content.firstChild.getAttribute('href');
                this.msg = '更新する準備ができました。';
            } catch (e) {
                // eslint-disable-next-line no-console
                console.error(e);
                this.msg = e;
            }
        },
    },
    created() {
        if (this.$attrs.file_url) {
            this.fileURL = this.$attrs.file_url;
        }
        this.description = this.$attrs.value;
    },
};
</script>
