<template>
    <div>
        <dt>{{ $attrs.ext_title }}</dt>
        <dd
            class="multi_dd"
            :class="`ext_item_${$attrs.ext_index - 1}`"
            :data-ext_type="$attrs.ext_type"
            :data-default_value="$attrs.default_value"
        >
            <ExtLocation v-if="flagToLoadOnce" :item="$attrs" />
        </dd>
    </div>
</template>

<script>
/**
 * README:
 *      Please change ckfinder_path domain to your own Kuroco admin domain.
 */
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
                    this.$options.components.ExtLocation = window['common/components/extensions/ExtLocation'];
                    this.flagToLoadOnce = true;
                }
            },
        },
    },
};
</script>
