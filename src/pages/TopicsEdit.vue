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
        <label for="slug" class="col-md-2 d-flex justify-content-end"
          >Title
        </label>
        <div class="col-md-10">
          <input
            type="text"
            class="form-control"
            id="slug"
            v-model="topics.subject"
          />
        </div>
      </div>
      <div class="row mb-3">
        <label for="slug" class="col-md-2 d-flex justify-content-end"
          >Slug
        </label>
        <div class="col-md-10">
          <input
            type="text"
            class="form-control"
            id="slug"
            v-model="topics.slug"
          />
        </div>
      </div>
      <div class="row mb-3">
        <label for="category" class="col-md-2 d-flex justify-content-end"
          >Category
        </label>
        <div class="col-md-10">
          <select class="form-control" id="category">
            <option
              v-for="(category, key) in arrCategory"
              :value="key"
              :key="key"
            >
              {{ category.category_nm }}
            </option>
          </select>
        </div>
      </div>
      <hr />
      <div class="row mb-3">
        <label for="category" class="col-md-2 d-flex justify-content-end"
          >Publish settings
        </label>
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
          <label for="open_type_close" class="form-check-label"
            >Unpublished</label
          >
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
    formData: { type: Object },
    extCols: { type: Object },
    arrCategory: { type: Object },
  },
  data() {
    return {
      topics: {},
      extensionFields: {},
      categories: {},
      isLoading: false,
      errors: [],
      messages: [],
    };
  },
  mounted() {
    this.topics = this.formData;
    this.topics.topics_group_id = this.topics_group_id;
    console.log(this.extCols);
  },
  methods: {
    async save() {
      this.isLoading = true;
      this.errors = [];
      this.messages = [];
      try {
        const formData = this.bind(this.topics);
        const resp = await axios.post(
          config.API_URL + '/management/topics/topics_edit_api/',
          formData,
          {
            headers: { 'content-type': 'multipart/form-data' },
          }
        );
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
