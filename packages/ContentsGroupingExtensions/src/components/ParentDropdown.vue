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
                    v-for="({ keyDef, label }, idx) in sortedOptions"
                    :key="`${keyDef}_${idx}`"
                    :label="label"
                    :data-key="`${keyDef}_${idx}`"
                    :value="keyDef"
                >
                    {{ label }}
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
    },
    data() {
        return {
            selected: '',
        };
    },
    computed: {
        sortedOptions() {
            return this.ext_option
                .split('\n')
                .filter((v) => v)
                .map((opt) => opt.split('::'))
                .filter(([keyDef, label]) => keyDef && label)
                .map(([keyDef, label]) => ({ keyDef, label }));
        },
        required() {
            return this.$attrs.limits && this.$attrs.limits.required !== undefined;
        },
    },
    methods: {
        handleOnChange(e) {
            this.$emit('change', this.toArrayIDs(e.target.value));
        },
        toArrayIDs(idsStr) {
            return idsStr.replace(/^\d+-/gi, '').split(',');
        },
    },
    mounted() {
        this.selected = this.$attrs.default_value || this.$attrs.value || '';
        this.$nextTick(() => {
            if (this.$refs.select.value !== '') {
                this.$emit('change', this.toArrayIDs(this.$refs.select.value));
            }
        });
    },
};
</script>
