<template>
    <div>
        <dt>{{ $attrs.ext_title }}</dt>
        <dd
            class="multi_dd"
            :class="`ext_item_${$attrs.ext_index - 1}`"
            :data-ext_type="$attrs.ext_type"
            :data-default_value="$attrs.default_value"
        >
            <select :name="$attrs.name" @change="handleOnChange" ref="select" v-model="selected">
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

        <slot />
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
    methods: {
        handleOnChange(e) {
            const value = e.target.value.replace(/-\d+/gi, '');
            this.$emit('change', value);
        },
    },
    mounted() {
        this.selected = this.$attrs.default_value || this.$attrs.value || '';
        this.$nextTick(() => {
            if (this.$refs.select.value !== '') {
                this.$emit('change', this.$refs.select.value);
            }
        });
    },
};
</script>
