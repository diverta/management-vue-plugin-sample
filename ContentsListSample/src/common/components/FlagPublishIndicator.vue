<template>
    <i :class="classes"></i>
</template>

<script>
export default {
    props: {
        flag: {
            type: [String, Number],
            default: () => 0,
        },
    },
    computed: {
        classes() {
            if (['1', 1, 'public', '公開'].includes(this.flag)) {
                return 'fe fe-check-circle text-success h2';
            }
            if (['0', 0, 'private', '非公開'].includes(this.flag)) {
                return 'fe fe-x text-danger h2';
            }
            return 'fe fe-alert-triangle text-warning h2';
        },
    },
};
</script>
