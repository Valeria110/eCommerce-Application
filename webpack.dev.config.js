/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    // historyApiFallback: true,
    watchFiles: path.join(__dirname, 'src'),
    static: path.resolve(__dirname, './dist'),
    hot: true,
  },
};
