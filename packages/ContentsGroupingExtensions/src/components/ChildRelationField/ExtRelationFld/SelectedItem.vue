<template>
    <div>
        <template v-if="selection.openFlg === 0 || selection.openFlg === 1">
            <span v-if="selection.openFlg === 1"><i class="fe fe-check-circle text-success"></i></span>
            <span v-else-if="selection.openFlg === 0"><i class="fe fe-x text-danger"></i></span>
        </template>

        <a href="#" @click.self.prevent="() => $emit('edit')">{{ selection.label }}</a>
        <a
            v-if="selection.link && selection.value"
            :href="selection.link"
            class="rcms_btn"
            style="padding:0 4px; margin:0 4px 0 8px;"
            >編集</a
        >
        <a
            v-if="selection.value"
            href=""
            @click.self.prevent="() => $emit('clear')"
            class="rcms_btn"
            style="padding:0 4px; margin:0 4px;"
            >クリア</a
        >
    </div>
</template>

<script>
export default {
    props: {
        selection: { type: Object, required: true },
    },
};
</script>
