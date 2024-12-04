<template>
    <button :class="`rcms_btn ${className}`" :data-mode="actionMode" @click="handleClick">
        <slot>
            <i :class="leftIconClass"></i>
            {{ text }}
        </slot>
    </button>
</template>

<script>
export default {
    name: 'form-action-button',
    props: {
        className: {
            type: String,
            default: '',
        },
        actionMode: {
            type: String,
            default: '',
        },
        leftIconClass: {
            type: String,
            default: '',
        },
        text: {
            type: String,
            default: 'OK',
        },
    },
    data() {
        return {};
    },
    methods: {
        handleClick(e) {
            e.preventDefault();
            this.$emit('click', this.actionMode);
        },
    },
};
</script>
