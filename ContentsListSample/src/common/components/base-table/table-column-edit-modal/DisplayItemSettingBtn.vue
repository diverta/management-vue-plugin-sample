<template>
    <div class="display-item-setting-btn" @click.prevent="clickHandler"></div>
</template>

<script>
export default {
    name: 'display-item-setting-btn',
    methods: {
        clickHandler() {
            this.$emit('click-handler');
        },
    },
};
</script>

<style lang="scss" scoped>
.display-item-setting-btn {
    width: 35px;
    height: 35px;
    cursor: pointer;
    background-color: #808080 !important;
    background: url('/management/images/management/setting_icon.png') no-repeat left top;

    &:hover {
        background: url('/management/images/management/setting_icon_hover.png') no-repeat left top;
    }
}
</style>
