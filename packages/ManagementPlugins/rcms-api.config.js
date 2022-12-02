module.exports = {
  API_URL: (() => {
    switch (process.env.NODE_ENV) {
      case 'production':
        // https://[prd-site-key].g.kuroco.app
        return '';
      default:
        // https://[dev-site-key].g.kuroco.app
        return '';
    }
  })(),
  API_SETTINGS: {
    /**
     * 1. Create an API for management plugins
     *   - Security: dynamic token
     * 2. Add the following endpoint
     *   - auth/login   : Login::login_challenge (login_method = "api_key/signature")
     *   - auth/token   : Login::token
     *   - auth/profile : Login::profile
     */
    // [api_id]: {
    //   apiSecurity: 'dynamic_token',
    //     endpoint: {
    //     login: 'auth/login',
    //     token: 'auth/token',
    //     profile: 'auth/profile',
    //   },
    // }
  },
};
