<template>
  <div>
    <form>
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
        <label for="date" class="col-md-2 d-flex justify-content-end"
          >Date
        </label>
        <div class="col-md-10">
          <input
            type="text"
            class="form-control"
            id="date"
            v-model="topics.date"
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
              v-for="(category, key) in categories"
              :value="key"
              :key="key"
            >
              {{ category.category_nm }}
            </option>
          </select>
        </div>
      </div>
    </form>
  </div>
</template>
<script>
export default {
  props: {
    topicsGroupId: { type: Number },
    formData: { type: Object },
    extCols: { type: Object },
    arrCategory: { type: Object },
  },
  data() {
    return {
      topics: {},
      extensionFields: {},
      categories: {},
    };
  },
  mounted() {
    this.topics = this.formData;
    this.extensionFields = this.extCols;
    this.categories = this.arrCategory;
  },
};
</script>
