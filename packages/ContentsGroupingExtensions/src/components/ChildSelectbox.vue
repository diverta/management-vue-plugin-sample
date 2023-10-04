<template>
    <div>
        <dt>{{ $attrs.ext_title }}</dt>
        <dd
            class="multi_dd"
            :class="`ext_item_${$attrs.ext_index - 1}`"
            :data-ext_type="$attrs.ext_type"
            :data-default_value="$attrs.default_value"
        >
            <ExtSelectbox v-if="flagToLoadOnce" :name="$attrs.name" :value="$attrs.value" :item="$attrs" />
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
    watch: {
        isLoaded: {
            immediate: true,
            handler(newVal) {
                if (newVal && !this.flagToLoadOnce) {
                    this.$options.components.ExtSelectbox = window['common/components/extensions/ExtSelectbox'];
                    this.flagToLoadOnce = true;
                }
            },
        },
    },
};
</script>
