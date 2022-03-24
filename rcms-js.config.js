module.exports = {
    name: 'FrontTopicsEditPluginDemo',
    path: 'dist',
    publicPath: '/files/user/js/front-topics-edit-plugin-demo/',

    devHost: process.env.RCMS_JS_DEV_HOST || '127.0.0.1',
    devPort: process.env.RCMS_JS_DEV_PORT || 26787,

    https: !!process.env.RCMS_JS_HTTPS,
    httpsKey: process.env.RCMS_JS_HTTPS_KEY_FILE,
    httpsCert: process.env.RCMS_JS_HTTPS_CERT_FILE,
    httpsCa: process.env.RCMS_JS_HTTPS_CA_FILE,
};
