<template>
    <div>
        <form>
            <div class="row mb-3">
                <div class="col">
                    <div
                        v-if="messages.length !== 0"
                        class="alert alert-success d-flex flex-column align-items-center"
                        role="alert"
                    >
                        <span v-for="(msg, index) in messages" :key="'msg_' + index">
                            {{ msg }}
                        </span>
                    </div>
                </div>
            </div>
            <div class="row mb-3">
                <div class="col">
                    <div
                        v-if="errors.length !== 0"
                        class="alert alert-danger d-flex flex-column align-items-center"
                        role="alert"
                    >
                        <span v-for="(err, index) in errors" :key="'err_' + index">
                            {{ err }}
                        </span>
                    </div>
                </div>
            </div>
            <div class="row mb-3">
                <label for="slug" class="col-md-2 d-flex justify-content-end">Title </label>
                <div class="col-md-10">
                    <input type="text" class="form-control" id="slug" v-model="topics.subject" />
                </div>
            </div>
            <div class="row mb-3">
                <label for="slug" class="col-md-2 d-flex justify-content-end">Slug </label>
                <div class="col-md-10">
                    <input type="text" class="form-control" id="slug" v-model="topics.slug" />
                </div>
            </div>
            <div class="row mb-3">
                <label for="slug" class="col-md-2 d-flex justify-content-end">Content </label>
                <div class="col-md-10">
                    <textarea class="form-control" id="slug" v-model="topics.contents"></textarea>
                </div>
            </div>
            <div class="row mb-3">
                <label for="category" class="col-md-2 d-flex justify-content-end">Category </label>
                <div class="col-md-10">
                    <select class="form-control" id="category" v-model="topics.contents_type">
                        <option v-for="category in categoryOptions" :value="category.key" :key="category.key">
                            {{ category.value.category_nm }}
                        </option>
                    </select>
                </div>
            </div>
            <div v-if="categoryCount > 1">
                <div class="row mb-3">
                    <label for="category" class="col-md-2 d-flex justify-content-end">Second category </label>
                    <div class="col-md-10">
                        <select class="form-control" id="category" v-model="topics.contents_type_2">
                            <option v-for="category in categoryOptions" :value="category.key" :key="category.key">
                                {{ category.value.category_nm }}
                            </option>
                        </select>
                    </div>
                </div>
            </div>
            <div v-if="categoryCount > 2">
                <div class="row mb-3">
                    <label for="category" class="col-md-2 d-flex justify-content-end">Third category </label>
                    <div class="col-md-10">
                        <select class="form-control" id="category" v-model="topics.contents_type_3">
                            <option v-for="category in categoryOptions" :value="category.key" :key="category.key">
                                {{ category.value.category_nm }}
                            </option>
                        </select>
                    </div>
                </div>
            </div>
            <hr />
            <div v-for="(group, indexGroup) in ext_items" :key="'group_' + indexGroup" class="row mb-3">
                <div v-for="(row, indexRow) in group.items" :key="'group_row' + indexRow">
                    <div v-if="row.length > 1" class="row">
                        <div class="col-md-2"></div>
                        <div class="col-md-10 card bg-light">
                            <div class="card-body">
                                <span class="text-success">&nbsp;{{ indexRow + 1 }}/{{ group.items.length }}</span>
                                <div v-for="(item, indexItem) in row" :key="'item_' + indexItem" class="mb-2">
                                    <div class="row mb-1">
                                        <label :for="item.ext_col_nm + '_' + indexItem" class="col">{{
                                            item.ext_title
                                        }}</label>
                                    </div>
                                    <div class="row">
                                        <div class="col">
                                            <div v-if="item.ext_type == '0'">
                                                <input
                                                    type="text"
                                                    class="form-control"
                                                    :id="item.ext_col_nm + '_' + indexItem"
                                                    v-model="topics.ext[item.ext_index + '_' + indexRow]"
                                                />
                                            </div>
                                            <div v-if="item.ext_type == '1'">
                                                <textarea
                                                    class="form-control"
                                                    :id="item.ext_col_nm + '_' + indexItem"
                                                    v-model="topics.ext[item.ext_index + '_' + indexRow]"
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else>
                        <div v-for="(item, indexItem) in row" :key="'item_' + indexItem" class="row mb-3">
                            <label :for="item.ext_col_nm + '_' + indexItem" class="col-md-2 d-flex justify-content-end"
                                >{{ item.ext_title
                                }}<span class="text-success">&nbsp;{{ indexRow + 1 }}/{{ group.items.length }}</span>
                            </label>
                            <div class="col-md-10">
                                <input
                                    type="text"
                                    class="form-control"
                                    :id="item.ext_col_nm + '_' + indexItem"
                                    v-model="topics.ext[item.ext_index + '_' + indexRow]"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <hr />
            <h3>Other settings</h3>
            <div class="row mb-3">
                <label for="topics_flg" class="col-md-2 d-flex justify-content-end">Display in the list </label>
                <div class="col-md-10">
                    <select class="form-control" id="topics_flg" v-model="topics.topics_flg">
                        <option v-for="flag in topicsFlagOptions" :value="flag.key" :key="flag.key">
                            {{ flag.value }}
                        </option>
                    </select>
                </div>
            </div>
            <div class="row mb-3">
                <label for="regular_flg" class="col-md-2 d-flex justify-content-end">Higher-ranked display </label>
                <div class="col-md-10">
                    <select class="form-control" id="regular_flg" v-model="topics.regular_flg">
                        <option v-for="flag in regularFlagOptions" :value="flag.key" :key="flag.key">
                            {{ flag.value }}
                        </option>
                    </select>
                </div>
            </div>
            <div class="row mb-3">
                <label for="restriction" class="col-md-2 d-flex justify-content-end">Access restriction </label>
                <div class="col-md-10">
                    <select multiple="true" class="form-control" id="restriction" v-model="topics.secure_level">
                        <option v-for="group in memberGroupOptions" :value="group.key" :key="group.key">
                            {{ group.value }}
                        </option>
                    </select>
                </div>
            </div>
            <hr />
            <div class="row mb-3">
                <label for="restriction" class="col-md-2 d-flex justify-content-end">Related tags </label>
                <div class="col-md-10">
                    <div class="row mb-3">
                        <div class="col">
                            <multiselect
                                placeholder="Search and add a tag"
                                label="tag_nm"
                                track-by="tag_id"
                                :options="tagOptions"
                                :multiple="true"
                                :group-select="true"
                                v-model="selectedTags"
                                group-values="tags"
                                group-label="category"
                            ></multiselect>
                        </div>
                    </div>
                </div>
            </div>
            <hr />
            <div class="row mb-3">
                <label for="category" class="col-md-2 d-flex justify-content-end">Publish settings </label>
                <div class="col-md-10">
                    <input
                        type="radio"
                        id="open_type_open"
                        value="open"
                        v-model="topics.open_type"
                        class="form-check-input"
                    />
                    <label for="open_type_open" class="form-check-label">Published</label>
                    <input
                        type="radio"
                        id="open_type_close"
                        value="close"
                        v-model="topics.open_type"
                        class="form-control-input"
                    />
                    <label for="open_type_close" class="form-check-label">Unpublished</label>
                </div>
            </div>
            <hr />
            <div class="row mb-3">
                <label for="restriction" class="col-md-2 d-flex justify-content-end">Workflow </label>
                <div class="col-md-10">
                    <select
                        class="form-control"
                        id="dispatch_github_workflow"
                        v-model="topics.dispatch_github_workflow"
                    >
                        <option v-for="option in githubWorkflowOptions" :value="option.key" :key="option.key">
                            {{ option.value }}
                        </option>
                    </select>
                </div>
            </div>
            <hr />
            <div class="row mb-3">
                <div class="col d-flex justify-content-end">
                    <button
                        type="submit"
                        class="btn btn-primary btn-default-width"
                        :disabled="isLoading"
                        @click.prevent="save()"
                    >
                        Save
                    </button>
                </div>
            </div>
        </form>
    </div>
</template>
<script>
import Vue from 'vue';
window.rcmsJS.vue.registerVM(Vue, rcms_js_config.publicPath); // eslint-disable-line

import axios from 'axios';
import config from '@/common/config';
import Multiselect from 'vue-multiselect';
export default {
    components: {
        Multiselect,
    },
    props: {
        topics_id: { type: Number, default: 0 },
        topics_group_id: { type: Number, default: 0 },
        DG_CODE: { type: String, default: '' }, // This is only needed for traditional form submission
        formData: { type: Object, default: () => {} },
        ext_items: { type: Array, default: () => [] },
        categoryCount: { type: Number, default: 0 },
        categoryOptions: { type: Array },
        topicsFlagOptions: { type: Array },
        regularFlagOptions: { type: Array, default: () => [] },
        memberGroupOptions: { type: Array },
        notifOptions: { type: Array, default: () => [] },
        githubWorkflowOptions: { type: Array, default: () => [] },
        relatedTags: { type: Array, default: () => [] },
        // errors: { type: Array, default: () => [] },
        // messages: { type: Array, default: () => [] },
        infos: { type: Array, default: () => [] },
    },
    data() {
        return {
            topics: {
                secure_level: [],
                ext: {},
            },
            tagOptions: [],
            selectedTags: [],
            isLoading: false,
            errors: [],
            messages: [],
        };
    },
    created() {
        for (const indexGroup in Object.entries(this.ext_items)) {
            for (const indexRow in Object.entries(this.ext_items[indexGroup].items)) {
                for (const indexItem in Object.entries(this.ext_items[indexGroup].items[indexRow])) {
                    const item = this.ext_items[indexGroup].items[indexRow][indexItem];
                    this.topics.ext[item.ext_index + '_' + indexRow] = '';
                }
            }
        }
    },
    async mounted() {
        if (this.formData.ext === null || this.formData.ext === undefined) {
            this.formData.ext = this.topics.ext;
        }
        this.topics = { ...this.topics, ...this.formData };
        this.initExt();
        this.topics.topics_group_id = this.topics_group_id;
        if (typeof this.topics.secure_level === 'string') {
            this.topics.secure_level = JSON.parse(this.topics.secure_level);
        }
        this.tagOptions = await this.getTags();
        this.initRelatedTags();
    },
    methods: {
        async getTags() {
            try {
                const response = await axios.get('/direct/tag/tag_category_info/');
                return this.preprocessTagOptions(response.data);
            } catch (error) {
                // eslint-disable-next-line no-console
                console.log(error);
                return [];
            }
        },
        initRelatedTags() {
            for (const tag of this.relatedTags) {
                this.selectedTags.push(this.sanitizeTag(tag));
            }
        },
        preprocessTagOptions(data) {
            const processedData = [];
            for (const category of data) {
                const arrTags = Object.values(category.tags);
                const newObj = {
                    category: category.tag_category_nm,
                    tags: [],
                };
                for (let i = 0; i < arrTags.length; i++) {
                    newObj.tags.push(this.sanitizeTag(arrTags[i]));
                }

                processedData.push(newObj);
            }
            return processedData;
        },
        sanitizeTag(tag) {
            return {
                tag_id: tag.tag_id,
                tag_nm: tag.tag_nm,
            };
        },
        initExt() {
            for (const group of this.ext_items) {
                const group_loop = group.parent_item.ext_group_loop;
                for (const group_row of group.items) {
                    for (const item of group_row) {
                        const ext_no = item.ext_index;
                        if (this.topics.ext[ext_no]) {
                            if (group_loop > 1) {
                                for (let i = 0; i < group_loop; i++) {
                                    this.topics.ext[ext_no + '_' + i] = this.topics.ext[ext_no][i];
                                }
                            } else {
                                this.topics.ext[ext_no + '_0'] = this.topics.ext[ext_no];
                            }
                            delete this.topics.ext[ext_no];
                        }
                    }
                }
            }
        },
        async save() {
            this.isLoading = true;
            this.errors = [];
            this.messages = [];
            try {
                const formData = this.bind(this.topics);
                // Use '/management/topics/topics_edit/' for traditional form submission (NOT asynchronous)
                const resp = await axios.post(config.API_URL + '/management/topics/topics_edit_api/', formData, {
                    headers: { 'content-type': 'multipart/form-data' },
                });
                if (resp.data.messages) {
                    this.messages = resp.data.messages;
                }
            } catch (error) {
                if (error.response && error.response.data && Array.isArray(error.response.data.errors)) {
                    this.errors = error.response.data.errors;
                } else {
                    this.errors.push('Server error.');
                    // eslint-disable-next-line no-console
                    console.log(error);
                }
            } finally {
                this.isLoading = false;
                window.scrollTo(0, 0);
            }
        },
        bind(topics) {
            const formData = new FormData();
            formData.append('MODE', this.topics_id ? 'UPDATE' : 'INSERT');
            formData.append('topics_group_id', this.topics_group_id);
            if (this.topics_id) {
                formData.append('topics_id', this.topics_id);
            }
            if (topics.contents_type) {
                formData.append('contents_type', topics.contents_type);
            }
            if (this.categoryCount > 1) {
                formData.append('contents_type_2', topics.contents_type_2);
            }
            if (this.categoryCount > 2) {
                formData.append('contents_type_3', topics.contents_type_3);
            }
            formData.append('subject', topics.subject);
            if (topics.slug) {
                formData.append('slug', topics.slug);
            }
            if (topics.topics_flg) {
                formData.append('topics_flg', topics.topics_flg);
            }
            if (topics.regular_flg) {
                formData.append('regular_flg', topics.regular_flg);
            }
            if (topics.open_type) {
                formData.append('open_type', topics.open_type);
            }
            const groups = topics.secure_level;
            for (let i = 0; i < groups.length; i++) {
                formData.append('secure_level[' + i + ']', groups[i]);
            }
            let cntTag = 0;
            for (let i = 0; i < this.selectedTags.length; i++) {
                formData.append(
                    'tag_relation[' + cntTag + ']',
                    'tag:' + this.selectedTags[i].tag_id + ':' + this.selectedTags[i].tag_nm
                );
                cntTag++;
            }
            if (topics.dispatch_github_workflow) {
                formData.append('dispatch_github_workflow', topics.dispatch_github_workflow);
            }
            if (topics.contents) {
                formData.append('contents', topics.contents);
            }

            // This is statically processed to simplify things
            // If you want it to be dynamic based on content-structure setting,
            // please use the setting information from ext_items props
            // formData.append('ext_1[0]', topics.ext['1_0']);
            // formData.append('ext_1[1]', topics.ext['1_1']);
            // formData.append('ext_1[2]', topics.ext['1_2']);
            // formData.append('ext_2[0]', topics.ext['2_0']);
            // formData.append('ext_2[1]', topics.ext['2_1']);
            // formData.append('ext_2[2]', topics.ext['2_2']);

            for (const group of this.ext_items) {
                const group_loop = group.parent_item.ext_group_loop;
                for (const group_row of group.items) {
                    for (const item of group_row) {
                        const ext_no = item.ext_index;
                        if (group_loop > 1) {
                            for (let i = 0; i < group_loop; i++) {
                                if (topics.ext[ext_no + '_' + i] && !formData.has('ext_' + ext_no + '[' + i + ']')) {
                                    formData.append('ext_' + ext_no + '[' + i + ']', topics.ext[ext_no + '_' + i]);
                                }
                            }
                        } else {
                            if (topics.ext[ext_no + '_0'] && !formData.has('ext_' + ext_no)) {
                                formData.append('ext_' + ext_no, topics.ext[ext_no + '_0']);
                            }
                        }
                    }
                }
            }

            return formData;
        },
    },
};
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style scoped>
.btn-default-width {
    width: 120px;
}
</style>
