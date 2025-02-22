<template>
    <div ref="root">
        <dt>{{ $attrs.ext_title }}</dt>
        <dd
            class="multi_dd"
            :class="`ext_item_0`"
            :data-ext_type="$attrs.ext_type"
            :data-default_value="$attrs.default_value"
        >
            <select
                :name="$attrs.name"
                @change="emitChildrenIDs"
                ref="select"
                v-model="selected"
                class="form-control w-auto"
            >
                <option v-if="!required" value="" selected>選択なし</option>
                <option
                    v-for="({ key, value, label }, idx) in extOptions"
                    :key="`${key}_${idx}`"
                    :label="label"
                    :data-key="`${key}_${idx}`"
                    :value="key"
                    :data-value="value"
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
        extOptions: { type: Array, default: () => [] },
    },
    data() {
        return {
            selected: '',
            observer: null,
        };
    },
    computed: {
        required() {
            return this.$attrs.limits && this.$attrs.limits.required !== undefined;
        },
    },
    methods: {
        emitChildrenIDs() {
            const d = this.$refs?.select?.selectedOptions?.[0]?.dataset?.value?.split(',') || [];
            this.$emit('change', d);
        },
        getSelectedValue() {
            const selected = this.$attrs.default_value || this.$attrs.value || '';
            // 前回未選択である場合はそのまま返す
            if (selected === '') {
                return selected;
            }
            return this.extOptions?.find(({ key }) => key === selected)?.key || '';
        },
    },
    mounted() {
        this.selected = this.getSelectedValue();
        this.$nextTick(() => {
            if (this.selected) {
                this.emitChildrenIDs();
            }
        });

        // In case of add -> delete -> add this repeatable extension,
        // child extensions will be still shown (and retains it's value) despite of parent extension is non-selected.
        // To fix this, observe the parent extension's visibility and reset the value of child extensions.
        this.observer = new ResizeObserver((entries = []) => {
            const invisible = entries.some((entry) => {
                const { height, width } = entry.contentRect;
                return height === 0 && width === 0;
            });
            invisible && this.$emit('change', []); // reset value
        });
        this.observer.observe(this.$refs.root);
    },
    beforeDestroy() {
        this.observer?.disconnect?.();
    },
};
</script>
