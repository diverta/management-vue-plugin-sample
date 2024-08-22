<template>
    <div>
        <dt>{{ $attrs.ext_title }}</dt>
        <dd
            class="multi_dd"
            :class="`ext_item_${$attrs.ext_index - 1}`"
            :data-ext_type="$attrs.ext_type"
            :data-default_value="$attrs.default_value"
        >
            <ExtSelectbox v-if="flagToLoadOnce" :name="$attrs.name" :value="values" :item="item" />
        </dd>
    </div>
</template>

<script>
import BaseMixin from './baseMixin.js';
export default {
    mixins: [BaseMixin],
    data() {
        return {
            extComponentName: 'ExtSelectbox',
        };
    },
    computed: {
        values() {
            return Object.entries(this.$attrs.value).map(([key]) => key);
        },
        item() {
            return {
                ...this.$attrs,
                options: Object.entries(this.$attrs.options).map(([key, value]) => ({ key, value })),
            };
        },
    },
};
</script>
