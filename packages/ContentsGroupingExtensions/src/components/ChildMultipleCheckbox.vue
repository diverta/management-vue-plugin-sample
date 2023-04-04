<template>
    <div>
        <dt class="after_second">{{ $attrs.ext_title }}</dt>
        <dd
            class="multi_dd"
            :class="`ext_item_${$attrs.ext_index - 1}`"
            :data-ext_type="$attrs.ext_type"
            :data-default_value="$attrs.default_value"
        >
            <label
                v-for="[key, value] in Object.entries($attrs.options || {})"
                style="margin-right: 10px; white-space: nowrap"
                :key="`${$attrs.name}_${key}_${value}`"
            >
                <input type="checkbox" :name="$attrs.name" :value="key" :checked="getIsChecked(key)" />
                {{ value }}
            </label>

            <p v-if="$attrs.ext_help_msg">
                <span class="hint">
                    {{ $attrs.ext_help_msg }}
                </span>
            </p>
        </dd>
    </div>
</template>

<script>
export default {
    methods: {
        getIsChecked(key) {
            return Object.entries(this.$attrs.value || {}).find(([_key]) => `${_key}` === `${key}`);
        },
    },
};
</script>
