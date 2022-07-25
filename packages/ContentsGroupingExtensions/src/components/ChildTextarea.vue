<template>
    <div>
        <dt class="after_second">{{ $attrs.ext_title }}</dt>
        <dd
            class="multi_dd"
            :class="`ext_item_${$attrs.ext_index - 1}`"
            :data-ext_type="$attrs.ext_type"
            :data-default_value="$attrs.default_value"
        >
            <textarea :name="$attrs.name" :value="$attrs.value" rows="4" cols="60" />
        </dd>
    </div>
</template>

<script>
export default {};
</script>
