const path = require('path');
const glob = require('glob');

module.exports = glob.sync('./src/pages/**/*.vue').reduce((exports, f) => {
    exports[path.basename(f, '.vue')] = f;
    return exports;
}, {});
