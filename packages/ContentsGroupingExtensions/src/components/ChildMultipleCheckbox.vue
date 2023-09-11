<template>
    <div>
        <dt class="after_second">{{ $attrs.ext_title }}</dt>
        <dd
            class="multi_dd"
            :class="`ext_item_${$attrs.ext_index - 1}`"
            :data-ext_type="$attrs.ext_type"
            :data-default_value="$attrs.default_value"
        >
            <ExtCheckbox
                v-if="flagToLoadOnce"
                :name="$attrs.name"
                :value="values"
                :item="$attrs"
                :TOPICS_MULTISELECT_BORDER_CHECKBOX="50"
            />
        </dd>
    </div>
</template>

<script>
export default {
    props: {
        isLoaded: { type: Boolean, required: true },
    },
    data() {
        return {
            flagToLoadOnce: false,
        };
    },
    computed: {
        values() {
            return this.$attrs.value.map((item) => item.key);
        },
    },
    watch: {
        isLoaded: {
            immediate: true,
            handler(newVal) {
                if (newVal && !this.flagToLoadOnce) {
                    this.$options.components.ExtCheckbox = window['common/components/extensions/ExtCheckbox'];
                    this.flagToLoadOnce = true;
                }
            },
        },
    },
};
</script>
