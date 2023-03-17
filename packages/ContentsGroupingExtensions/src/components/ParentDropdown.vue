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
                <option v-for="[value, key] in sortedOptions" :key="key" :label="key" :data-key="key" :value="value">
                    {{ key }}
                </option>
            </select>
        </dd>

        <slot />
    </div>
</template>

<script>
export default {
    props: {
        ext_option: { type: String, required: true },
        options: { type: Object, required: true },
    },
    data() {
        return {
            selected: '',
        };
    },
    computed: {
        sortedOptions() {
            const numbers = this.ext_option
                .split('\n')
                .filter(v => v)
                .map(opt => opt.split('::')[0])
                .filter(v => v)
                .map(nmsStr => nmsStr.match(/\d+/g) || [])
                .flat()
                .filter(v => v)
                .map(nmStr => parseInt(nmStr));
            return Object.entries(this.options).sort((a, b) =>
                numbers.indexOf(parseInt(a[0])) > numbers.indexOf(parseInt(b[0])) ? 1 : -1
            );
        },
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
