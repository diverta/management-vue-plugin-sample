<template>
    <div>
        <dt class="after_second">{{ $attrs.ext_title }}</dt>
        <dd
            class="multi_dd"
            :class="`ext_item_${$attrs.ext_index - 1}`"
            :data-ext_type="$attrs.ext_type"
            :data-default_value="$attrs.default_value"
        >
            <dl>
                <ExtRelationFld
                    v-bind="{
                        ...$attrs,
                        opts: $attrs.options,
                    }"
                />
                <p v-if="$attrs.ext_help_msg">
                    <span class="hint">{{ $attrs.ext_help_msg }}</span>
                </p>
            </dl>
        </dd>
    </div>
</template>

<script>
export default {
    inheritAttrs: false,
    components: {
        ExtRelationFld: () => import('./ExtRelationFld/index.vue'),
    },
};
</script>
