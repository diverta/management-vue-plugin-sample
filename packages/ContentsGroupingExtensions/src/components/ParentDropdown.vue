<template>
    <div>
        <dt>{{ $attrs.ext_title }}</dt>
        <dd
            class="multi_dd"
            :class="`ext_item_${$attrs.ext_index - 1}`"
            :data-ext_type="$attrs.ext_type"
            :data-default_value="$attrs.default_value"
        >
            <select :name="$attrs.name" @change="handleOnChange" ref="select">
                <option v-if="!required" value="" selected>選択なし</option>
                <option
                    v-for="[value, key] in Object.entries($attrs.options)"
                    :key="key"
                    :label="key"
                    :data-key="key"
                    :value="value"
                    :selected="getIsDefault(value)"
                >
                    {{ key }}
                </option>
            </select>
        </dd>

        <slot />
    </div>
</template>

<script>
export default {
    computed: {
        required() {
            return this.$attrs.limits && this.$attrs.limits.required !== undefined;
        },
    },
    methods: {
        getIsDefault(value) {
            return this.$attrs.default_value === value || this.$attrs.value === value;
        },
        handleOnChange(e) {
            this.$emit('change', e.target.value);
        },
    },
    mounted() {
        if (this.$refs.select.value !== '') {
            this.$emit('change', this.$refs.select.value);
        }
    },
};
</script>
