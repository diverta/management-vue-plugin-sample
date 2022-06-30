<template>
    <div>
        <dt class="after_second">{{ $attrs.ext_title }}</dt>
        <dd
            class="multi_dd"
            :class="`ext_item_${$attrs.ext_index - 1}`"
            :data-ext_type="$attrs.ext_type"
            :data-default_value="$attrs.default_value"
        >
            <p></p>
            <div v-show="!removes">
                <div :id="`filesUploaded_preview${$attrs.ext_col_nm}-0`"></div>
                <br />
                <div :id="`fileQueue${$attrs.ext_col_nm}-0`"></div>
                <input type="file" name="Filedata" id="uploadify${$attrs.ext_col_nm}-0" v-show="false" />
                <div
                    :id="`uploadifive-uploadifive${$attrs.ext_col_nm}-0`"
                    class="uploadifive-button"
                    style="height: 30px; line-height: 30px; overflow: hidden; position: relative; text-align: center; width: auto;"
                >
                    <i class="fa fa-plus"></i>
                    画像を選択する
                    <input type="file" name="Filedata" :id="`uploadifive${$attrs.ext_col_nm}-0`" v-show="false" />
                    <input
                        type="file"
                        style="font-size: 30px; opacity: 0; position: absolute; right: -3px; top: -3px; z-index: 999;"
                        accept="image/jpeg,image/gif,image/png,image/svg+xml"
                    />
                </div>
                <div :id="`filesUploaded_msg${$attrs.ext_col_nm}-0`" />
            </div>
            <div>
                <input :name="`del_file_${$attrs.ext_col_nm}-0`" type="checkbox" value="1" @change="onChange" />
                削除する
            </div>
            <p></p>
            <div v-show="!removes">
                画像の説明:
                <textarea :name="$attrs.name" rows="2" cols="60" />
            </div>
        </dd>
    </div>
</template>

<script>
// TODO apply dynamic attrs
// TODO file ext apply
// TODO check & improve S3 ajax
export default {
    data() {
        return {
            removes: false,
        };
    },
    methods: {
        onChange() {
            this.removes = !this.removes;
        },
    },
};
</script>
