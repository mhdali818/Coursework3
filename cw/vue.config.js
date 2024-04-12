const webpack = require('webpack');

module.exports = {
  configureWebpack: {
    plugins: [
      // Disable Hot Module Replacement (HMR)
      new webpack.HotModuleReplacementPlugin({
        multiStep: false,
      }),
    ],
  },
};
