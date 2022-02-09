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
                        <option v-for="(category, key) in categoryOptions" :value="key" :key="key">
                            {{ category.category_nm }}
                        </option>
                    </select>
                </div>
            </div>
            <div v-if="categoryCount > 1">
                <div class="row mb-3">
                    <label for="category" class="col-md-2 d-flex justify-content-end">Second category </label>
                    <div class="col-md-10">
                        <select class="form-control" id="category" v-model="topics.contents_type_2">
                            <option v-for="(category, key) in categoryOptions" :value="key" :key="key">
                                {{ category.category_nm }}
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
                            <option v-for="(category, key) in categoryOptions" :value="key" :key="key">
                                {{ category.category_nm }}
                            </option>
                        </select>
                    </div>
                </div>
            </div>
            <hr />
            <div v-for="(group, indexGroup) in ext_items" :key="'group_' + indexGroup" class="row mb-3">
                <div v-for="(row, indexRow) in group" :key="'group_row' + indexRow">
                    <div v-if="row.items.length > 1" class="row">
                        <div class="col-md-2"></div>
                        <div class="col-md-10 card bg-light">
                            <div class="card-body">
                                <span class="text-success">&nbsp;{{ indexRow + 1 }}/{{ group.length }}</span>
                                <div v-for="(item, indexItem) in row.items" :key="'item_' + indexItem" class="mb-2">
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
                                                    v-model="topics.ext[item.ext_index][indexRow]"
                                                />
                                            </div>
                                            <div v-if="item.ext_type == '1'">
                                                <textarea
                                                    class="form-control"
                                                    :id="item.ext_col_nm + '_' + indexItem"
                                                    v-model="topics.ext[item.ext_index][indexRow]"
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else>
                        <div v-for="(item, indexItem) in row.items" :key="'item_' + indexItem" class="row mb-3">
                            <label :for="item.ext_col_nm + '_' + indexItem" class="col-md-2 d-flex justify-content-end"
                                >{{ item.ext_title
                                }}<span class="text-success">&nbsp;{{ indexRow + 1 }}/{{ group.length }}</span>
                            </label>
                            <div class="col-md-10">
                                <input
                                    type="text"
                                    class="form-control"
                                    :id="item.ext_col_nm + '_' + indexItem"
                                    v-model="topics.ext[item.ext_index][indexRow]"
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
                        <option v-for="(flag, key) in topicsFlagOptions" :value="key" :key="key">
                            {{ flag }}
                        </option>
                    </select>
                </div>
            </div>
            <div class="row mb-3">
                <label for="regular_flg" class="col-md-2 d-flex justify-content-end">Higher-ranked display </label>
                <div class="col-md-10">
                    <select class="form-control" id="regular_flg" v-model="topics.regular_flg">
                        <option v-for="(flag, key) in regularFlagOptions" :value="key" :key="key">
                            {{ flag }}
                        </option>
                    </select>
                </div>
            </div>
            <div class="row mb-3">
                <label for="restriction" class="col-md-2 d-flex justify-content-end">Access restriction </label>
                <div class="col-md-10">
                    <select multiple="true" class="form-control" id="restriction" v-model="topics.secure_level">
                        <option v-for="(group, key) in memberGroupOptions" :value="key" :key="key">
                            {{ group }}
                        </option>
                    </select>
                </div>
            </div>
            <hr />
            <div class="row mb-3">
                <label for="restriction" class="col-md-2 d-flex justify-content-end">Related tags </label>
                <div class="col-md-10">
                    <div v-for="category in tagOptions" :key="category.tag_category_id">
                        <div class="row mb-1">
                            <label class="col">{{ category.tag_category_nm }}</label>
                        </div>
                        <div class="row mb-3">
                            <div class="col">
                                <multiselect
                                    placeholder="Search and add a tag"
                                    label="tag_nm"
                                    track-by="tag_id"
                                    :options="category.tags"
                                    :multiple="true"
                                    :taggable="true"
                                    v-model="selectedTags[category.tag_category_id]"
                                ></multiselect>
                            </div>
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
        categoryOptions: { type: Object },
        topicsFlagOptions: { type: Object },
        regularFlagOptions: { type: Array, default: () => [] },
        memberGroupOptions: { type: Object },
        notifOptions: { type: Object, default: () => {} },
        githubWorkflowOptions: { type: Object, default: () => {} },
        relatedTags: { type: Array, default: () => [] },
    },
    data() {
        return {
            topics: {},
            tagOptions: [],
            selectedTags: {},
            isLoading: false,
            errors: [],
            messages: [],
        };
    },
    async mounted() {
        this.topics = this.formData;
        this.topics.topics_group_id = this.topics_group_id;
        this.topics.secure_level = JSON.parse(this.topics.secure_level);
        this.tagOptions = await this.getTags();
        console.log(this.tagOptions);
        this.initRelatedTags();
        console.log(this.selectedTags);
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
                if (!this.selectedTags.hasOwnProperty(tag.tag_category_id)) {
                    this.selectedTags[tag.tag_category_id] = [];
                }
                this.selectedTags[tag.tag_category_id].push(this.sanitizeTag(tag));
            }
        },
        preprocessTagOptions(data) {
            const processedData = [];
            for (const category of data) {
                const arrTags = Object.values(category.tags);
                category.tags = [];
                for (let i = 0; i < arrTags.length; i++) {
                    category.tags.push(this.sanitizeTag(arrTags[i]));
                }

                processedData.push(category);
            }
            return processedData;
        },
        sanitizeTag(tag) {
            return {
                tag_id: tag.tag_id,
                tag_nm: tag.tag_nm,
            };
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
                this.messages = resp.data.messages;
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
            formData.append('contents_type', topics.contents_type);
            if (this.categoryCount > 1) {
                formData.append('contents_type_2', topics.contents_type_2);
            }
            if (this.categoryCount > 2) {
                formData.append('contents_type_3', topics.contents_type_3);
            }
            formData.append('subject', topics.subject);
            formData.append('slug', topics.slug);
            formData.append('topics_flg', topics.topics_flg);
            formData.append('regular_flg', topics.regular_flg);
            const groups = topics.secure_level;
            for (let i = 0; i < groups.length; i++) {
                formData.append('secure_level[' + i + ']', groups[i]);
            }
            let cntTag = 0;
            const arrSelectedTags = Object.values(this.selectedTags);
            for (let i = 0; i < arrSelectedTags.length; i++) {
                const category = Object.values(arrSelectedTags[i]);
                for (let j = 0; j < category.length; j++) {
                    formData.append('tag_relation[' + cntTag + ']', category[j].tag_id);
                    cntTag++;
                }
            }
            formData.append('contents', topics.contents);
            formData.append('ext_1[0]', topics.ext[1][0]);
            formData.append('ext_1[1]', topics.ext[1][1]);
            formData.append('ext_2[0]', topics.ext[2][0]);
            formData.append('ext_2[1]', topics.ext[2][1]);
            formData.append('ext_2[2]', topics.ext[2][2]);
            formData.append('ext_3[0]', topics.ext[3][0]);
            formData.append('ext_3[1]', topics.ext[3][1]);
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
