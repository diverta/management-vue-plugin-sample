export default {
  API_URL:
    process.env.WEBPACK_MODE === 'production'
      ? 'https://kuroco-dev-mng.r-cms.jp'
      : 'http://localhost',
};
