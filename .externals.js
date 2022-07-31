module.exports = {
  vue: {
    pkgPath: "/node_modules/vue",
    filePath: "dist",
    fileName: "vue.global.js",
    root: "Vue",
  },
  "vue-router": {
    pkgPath: "/node_modules/vue-router",
    filePath: "dist",
    fileName: "vue-router.global.js",
    root: "VueRouter",
  },
  "vue-demi": {
    pkgPath: "/node_modules/vue-demi",
    filePath: "lib",
    fileName: "index.iife.js",
    newFileName: "vue-demi.js",
    root: "VueDemi",
  },
  pinia: {
    pkgPath: "/node_modules/pinia",
    filePath: "dist",
    fileName: "pinia.iife.js",
    newFileName: "pinia.js",
    root: "Pinia",
  },
};
