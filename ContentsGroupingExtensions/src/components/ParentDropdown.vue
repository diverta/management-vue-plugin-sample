<template>
    <div>
        <dt>{{ $attrs.ext_title }}</dt>
        <dd
            class="multi_dd"
            :class="`ext_item_${$attrs.ext_index - 1}`"
            :data-ext_type="$attrs.ext_type"
            :data-default_value="$attrs.default_value"
        >
            <select :name="$attrs.name" @change="handleOnChange">
                <option value="" selected>選択なし</option>
                <option
                    v-for="[value, key] in Object.entries($attrs.options)"
                    :key="key"
                    :label="key"
                    :data-key="key"
                    :value="value"
                >
                    {{ key }}
                </option>
            </select>
        </dd>
    </div>
</template>

<script>
// TODO 必須だったら"選択なし"を削除
// TODO "デフォルト"があれば適用
export default {
    methods: {
        handleOnChange(e) {
            const payload = {
                key: e.target.options[e.target.options.selectedIndex].dataset.key,
                value: e.target.value,
            };
            this.$emit('change', payload);
        },
    },
};
</script>
