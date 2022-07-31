const path = require("path");
const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  pages: {
    index: {
      entry: "./src/entry/index/main.ts",
      template: "public/pages/index.html",
      filename: "index.html",
    },
    admin: {
      entry: "./src/entry/admin/main.ts",
      template: "public/pages/admin.html",
      filename: "admin.html",
    },
  },
  configureWebpack: {
    output: {
      library: `simple-vue`,
      libraryTarget: "umd",
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
        "@components": path.resolve(__dirname, "src/components"),
        "@views": path.resolve(__dirname, "src/views"),
        "@assets": path.resolve(__dirname, "src/assets"),
        "@utils": path.resolve(__dirname, "src/utils"),
        "@api": path.resolve(__dirname, "src/api"),
        "@plugins": path.resolve(__dirname, "src/plugins"),
        "@filters": path.resolve(__dirname, "src/filters"),
        "@directives": path.resolve(__dirname, "src/directives"),
      },
    },
  },
});
