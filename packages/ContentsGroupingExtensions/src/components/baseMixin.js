export default {
    props: {
        isLoaded: { type: Boolean, required: true },
        activated: { type: Boolean, required: true },
    },
    data() {
        return {
            extComponentName: '',
            flagToLoadOnce: false,
        };
    },
    methods: {
        checkAndLoadDynamicExtComponent() {
            if (this.isLoaded && this.activated && !this.flagToLoadOnce) {
                this.$options.components[this.extComponentName] =
                    window['common/components/extensions/' + this.extComponentName];
                this.flagToLoadOnce = true;
            }
        },
    },
    mounted() {
        this.checkAndLoadDynamicExtComponent();
    },
    watch: {
        isLoaded: {
            immediate: true,
            handler() {
                this.checkAndLoadDynamicExtComponent();
            },
        },
        activated: {
            immediate: true,
            handler() {
                this.checkAndLoadDynamicExtComponent();
            },
        },
    },
};
