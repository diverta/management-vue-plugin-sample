<template>
  <main>
    <div class="header">
      <div class="container-fluid">
        <div class="header-body">
          <div class="row align-items-center">
            <div class="col">
              <h1 class="header-title fw-bold d-inline-block">
                AuthSample
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container-fluid">
      <div class="main_contents">
        <div>
          <div>Request: <button @click="getProfile">getProfile</button></div>
          <div>
            Response: <code>{{ profile }}</code>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import Base from '@/common/Base.vue';
import ApiUser from '@/common/kuroco/ApiUser';

export default {
  extends: Base,
  components: {},
  props: {},
  data() {
    return {
      profile: {},
    };
  },
  computed: {
    /**
     * @returns {ApiUser}
     */
    apiUser() {
      return new ApiUser({
        apiId: 0, // Replace this with api_id that you have configured in rcms-api.config.js
        credentials: this.apiLoginCredentials,
      });
    },
  },
  created() {},
  methods: {
    getProfile() {
      this.apiUser.getProfile().then(response => {
        this.profile = response;
      });
    },
  },
};
</script>
