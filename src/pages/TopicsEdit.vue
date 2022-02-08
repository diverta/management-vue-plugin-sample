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
                <label for="category" class="col-md-2 d-flex justify-content-end">Category </label>
                <div class="col-md-10">
                    <select class="form-control" id="category">
                        <option v-for="(category, key) in arrCategory" :value="key" :key="key">
                            {{ category.category_nm }}
                        </option>
                    </select>
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
export default {
    props: {
        topics_id: { type: Number, default: 0 },
        topics_group_id: { type: Number, default: 0 },
        formData: { type: Object, default: () => {} },
        ext_items: { type: Array, default: () => [] },
        arrCategory: { type: Object },
    },
    data() {
        return {
            topics: {},
            categories: {},
            isLoading: false,
            errors: [],
            messages: [],
        };
    },
    mounted() {
        this.topics = this.formData;
        this.topics.topics_group_id = this.topics_group_id;
        console.log(this.ext_items);
        console.log(this.topics);
    },
    methods: {
        async save() {
            this.isLoading = true;
            this.errors = [];
            this.messages = [];
            try {
                const formData = this.bind(this.topics);
                const resp = await axios.post(config.API_URL + '/management/topics/topics_edit_api/', formData, {
                    headers: { 'content-type': 'multipart/form-data' },
                });
                this.messages = resp.data.messages;
            } catch (error) {
                this.errors = error.response.data.errors;
            } finally {
                this.isLoading = false;
            }
        },
        bind(topics) {
            const formData = new FormData();
            formData.append('MODE', this.topics_id ? 'UPDATE' : 'INSERT');
            formData.append('topics_group_id', this.topics_group_id);
            for (const prop in topics) {
                formData.append(prop, topics[prop]);
            }
            return formData;
        },
    },
};
</script>
<style scoped>
.btn-default-width {
    width: 120px;
}
</style>
