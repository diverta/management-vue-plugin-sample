<template>
    <div>
        <div v-if="messages && messages.length > 0">
            <div class="container-fluid">
                <div class="alert c-alert--success" role="alert">
                    <div class="text-center">
                        <ul>
                            <li v-for="(msg, msg_idx) in messages" :key="msg_idx">
                                <p class="alert-heading mb-0 h3 lh-base">
                                    <i class="fe fe-check-circle me-1"></i>{{ msg }}
                                </p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="errors && errors.length > 0">
            <div class="alert c-alert--danger" role="alert">
                <div class="mx-auto">
                    <p class="alert-heading h3">
                        <i class="fe fe-alert-triangle me-1"></i> {{ translate('/label/error_occurred') }}
                    </p>
                    <ul class="text-body ps-0 mb-0">
                        <li v-for="(err, err_idx) in errors" :key="err_idx">{{ err }}</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'rcms-msg-box',
    props: {
        messages: {
            type: Array,
            default: () => [],
        },
        errors: {
            type: [Array, String],
            default: () => [],
        },
    },
    computed: {
        errors_arr() {
            return Array.isArray(this.errors) ? this.errors : [this.errors];
        },
    },
    data() {
        return {};
    },
};
</script>

<style scoped></style>
