const path = require("path");
function resolve(dir) {
  return path.join(__dirname, "/", dir);
}
// const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = {
  publicPath: "/dist/",
  lintOnSave: process.env.NODE_ENV !== "production",

  /* 設定本機port */
  devServer: {
    port: 1803, // 端口
    overlay: {
      warnings: true,
      errors: false,
    },
  },

  /* css */
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/assets/css/basic/_variable.scss";`,
      },
    },
  },

  // configureWebpack: {
  //   devtool: "source-map",
  //   // plugins: [new BundleAnalyzerPlugin()],

  //   // externals: {
  //   //   vue: "Vue",
  //   //   vuex: "Vuex",
  //   //   axios: "axios",
  //   // },
  // },

  configureWebpack: (config) => {
    config.optimization = {
      runtimeChunk: "single",
      splitChunks: {
        chunks: "all",
        maxInitialRequests: Infinity,
        minSize: 20000,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              // get the name. E.g. node_modules/packageName/not/this/part.js
              // or node_modules/packageName
              const packageName = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
              )[1];
              // npm package names are URL-safe, but some servers don't like @ symbols
              return `npm.${packageName.replace("@", "")}`;
            },
          },
        },
      },
    };
  },

  // svg配置
  chainWebpack(config) {
    config.module
      .rule("svg")
      .exclude.add(resolve("src/icons"))
      .end();
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]",
      })
      .end();
  },
};
