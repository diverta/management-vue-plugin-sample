<template>
    <div>
        <ul v-if="docmeta" class="doc_lang_status_simple doc_lang_status">
            <li v-for="doc in docmeta" :key="doc.lang" :class="getClass(doc)">
                <a :href="urlPrefix + `&amp;_doc_lang=${doc.lang}`">
                    {{ doc.lang }}
                </a>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    props: {
        docmeta: {
            type: Array,
            default: () => [],
        },
        urlPrefix: {
            type: String,
            default: '',
        },
    },
    methods: {
        getClass(doc) {
            if (!doc.status) {
                return 'none';
            }
            if (doc.status === 2) {
                return 'waiting';
            }
            if (doc.is_published === 0) {
                return 'not_published';
            }
            if (doc.latest) {
                return 'latest';
            }
            return 'not_latest';
        },
    },
};
</script>
