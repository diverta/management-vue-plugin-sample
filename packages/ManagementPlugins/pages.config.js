const path = require('path');
const glob = require('glob');

const jsExports = glob.sync('./src/pages/**/*.vue').reduce((exports, f) => {
  exports[path.basename(f, '.vue')] = f;
  return exports;
}, {});

const cssExports = glob.sync('./src/styles/**/*.scss').reduce((exports, f) => {
  exports['css/' + path.basename(f, '.scss')] = f;
  return exports;
}, {});

module.exports = {
  ...jsExports,
  ...cssExports,
};
