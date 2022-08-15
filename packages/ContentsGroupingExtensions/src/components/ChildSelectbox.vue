<template>
    <div>
        <dt>{{ $attrs.ext_title }}</dt>
        <dd
            class="multi_dd"
            :class="`ext_item_${$attrs.ext_index - 1}`"
            :data-ext_type="$attrs.ext_type"
            :data-default_value="$attrs.default_value"
        >
            <select :name="$attrs.name" v-model="selected">
                <option v-if="!required" value="" selected>選択なし</option>
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
export default {
    data() {
        return {
            selected: '',
        };
    },
    computed: {
        required() {
            return this.$attrs.limits && this.$attrs.limits.required !== undefined;
        },
    },
    mounted() {
        this.selected = this.$attrs.default_value || this.$attrs.value || '';
    },
};
</script>
