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
                <dt>url:</dt>
                <dd>
                    <input
                        type="text"
                        :name="`${$attrs.name}[url]`"
                        :value="$attrs.value ? $attrs.value.url : undefined"
                        size="60"
                    />
                </dd>
                <dt>title:</dt>
                <dd>
                    <input
                        type="text"
                        :name="`${$attrs.name}[title]`"
                        :value="$attrs.value ? $attrs.value.title : undefined"
                        size="60"
                    />
                </dd>
            </dl>
        </dd>
    </div>
</template>

<script>
export default {
    methods: {
        getIsChecked(key) {
            return Object.entries(this.$attrs.value).find(([_key]) => `${_key}` === `${key}`);
        },
    },
};
</script>
